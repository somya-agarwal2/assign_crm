import re
from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.config import Config
from app.models import db

migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    import os
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://assign-crm.vercel.app')
    
    CORS(app, origins=[
        frontend_url,
        "https://ai-crm-platform-steel.vercel.app",
        "https://assign-crm.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ], supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if not origin:
            return response

        is_local_origin = re.match(r"^http://(localhost|127\.0\.0\.1):\d+$", origin) is not None
        is_prod_origin = origin == frontend_url or origin == "https://assign-crm.vercel.app" or origin.endswith(".vercel.app")
        if is_local_origin or is_prod_origin:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Vary'] = 'Origin'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'

        return response

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Ensure templates.thumbnail is TEXT (PostgreSQL) or ignored (SQLite)
    with app.app_context():
        try:
            db.session.execute(db.text("ALTER TABLE templates ALTER COLUMN thumbnail TYPE TEXT;"))
            db.session.commit()
        except Exception:
            db.session.rollback()

    # Register blueprints (stubs to be implemented)
    from app.routes import bp as routes_bp
    from app.routes.command_center import bp as command_center_bp
    from app.api.auth import auth_bp
    from app.api.workspaces import workspaces_bp
    app.register_blueprint(routes_bp, url_prefix='/api', strict_slashes=False)
    app.register_blueprint(command_center_bp, strict_slashes=False)
    app.register_blueprint(auth_bp, url_prefix='/api/auth', strict_slashes=False)
    app.register_blueprint(workspaces_bp, url_prefix='/api/workspaces', strict_slashes=False)

    @app.route('/health')
    def health():
        return {'status': 'ok'}

    @app.errorhandler(Exception)
    def handle_exception(e):
        import traceback
        with open('flask_error.txt', 'a') as f:
            f.write(traceback.format_exc() + '\n')
        return {"msg": "Internal Server Error", "error": str(e)}, 500

    return app

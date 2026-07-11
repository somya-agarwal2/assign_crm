import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key'
    
    # Accept DATABASE_URL (Render default) or DATABASE_URI (manually set)
    _db_url = os.environ.get('DATABASE_URL') or os.environ.get('DATABASE_URI')
    
    if _db_url:
        # Render provides postgres:// but SQLAlchemy needs postgresql://
        if _db_url.startswith('postgres://'):
            _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
        
        # Neon PostgreSQL strict requirement
        _db_url = _db_url.replace('&channel_binding=require', '')
        if 'neon.tech' in _db_url and 'sslmode=require' not in _db_url:
            separator = '&' if '?' in _db_url else '?'
            _db_url += f"{separator}sslmode=require"

    SQLALCHEMY_DATABASE_URI = _db_url or 'sqlite:///' + os.path.join(basedir, '..', 'ai_crm_v2.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Production Engine Options to prevent dropped connections
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 300, # Recycle connections every 5 minutes
        'pool_pre_ping': True, # Verify connection before usage
    }
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'

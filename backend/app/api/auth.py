from flask import Blueprint, request, jsonify
from functools import wraps
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt
)
from app.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

import json
from app.models import Workspace

def permission_required(permission_code):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")
            workspace_id = claims.get("workspace_id")
            
            if role == 'Admin':
                return fn(*args, **kwargs)
                
            workspace = Workspace.query.get(workspace_id)
            if not workspace or not workspace.role_permissions:
                return jsonify(msg="Insufficient permissions"), 403
                
            try:
                matrix = json.loads(workspace.role_permissions)
                # matrix format: [{ permission: 'campaign.delete', roles: { Admin: true, Analyst: false } }]
                for row in matrix:
                    if row.get('permission') == permission_code:
                        if row.get('roles', {}).get(role, False):
                            return fn(*args, **kwargs)
                        break
                return jsonify(msg="Insufficient permissions"), 403
            except Exception as e:
                return jsonify(msg="Permission error"), 500
                
        return decorator
    return wrapper

def role_required(*roles):
    """RBAC Decorator to protect endpoints."""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in roles:
                return jsonify(msg="Insufficient permissions"), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        additional_claims = {"role": user.role, "workspace_id": user.workspace_id}
        access_token = create_access_token(identity=user.id, additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify(
            access_token=access_token, 
            refresh_token=refresh_token, 
            user={"id": user.id, "role": user.role, "name": user.name, "email": user.email, "workspace_id": user.workspace_id}
        ), 200

    return jsonify({"msg": "Bad email or password"}), 401

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "Email already exists"}), 400
        
    new_user = User(
        name=data.get('name'),
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password')),
        role='Viewer' # Default safe role
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    access_token = create_access_token(identity=identity, additional_claims={"role": user.role, "workspace_id": user.workspace_id})
    return jsonify(access_token=access_token)

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a full implementation, you would blocklist the token here.
    return jsonify({"msg": "Successfully logged out"}), 200

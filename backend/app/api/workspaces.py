import re
import traceback
from flask import Blueprint, request, jsonify, current_app
from app.models import db, Organization, Workspace, User
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from sqlalchemy import inspect
from app.api.auth import role_required

workspaces_bp = Blueprint('workspaces', __name__)

@workspaces_bp.route('/onboard', methods=['POST'])
def onboard_workspace():
    current_app.logger.info("POST /api/workspaces/onboard request received")
    data = request.get_json(silent=True)
    current_app.logger.info("Onboarding payload: %s", data)

    if data is None:
        current_app.logger.warning("Validation failed: request body is not valid JSON")
        return jsonify({'success': False, 'error': 'Invalid JSON payload'}), 400
    
    company_name = data.get('companyName')
    workspace_name = data.get('workspaceName')
    admin_name = data.get('adminName')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    phone = data.get('phone')
    industry = data.get('industry')
    country = data.get('country')
    timezone = data.get('timezone', 'UTC')
    
    if not all([company_name, workspace_name, admin_name, email, password]):
        current_app.logger.warning("Validation failed: missing required fields")
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    if confirm_password is not None and password != confirm_password:
        current_app.logger.warning("Validation failed: password confirmation mismatch for email=%s", email)
        return jsonify({'success': False, 'error': 'Password and confirm password do not match'}), 400

    email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    if not re.match(email_pattern, email):
        current_app.logger.warning("Validation failed: invalid email format email=%s", email)
        return jsonify({'success': False, 'error': 'Invalid email format'}), 400

    inspector = inspect(db.engine)
    required_tables = ['organizations', 'workspaces', 'users']
    missing_tables = [table for table in required_tables if not inspector.has_table(table)]
    if missing_tables:
        current_app.logger.error("Database validation failed: missing required tables %s", missing_tables)
        return jsonify({'success': False, 'error': f"Missing required database tables: {', '.join(missing_tables)}"}), 500

    current_app.logger.info("Checking duplicate email for %s", email)
    if User.query.filter_by(email=email).first():
        current_app.logger.warning("Duplicate email check failed for %s", email)
        return jsonify({'success': False, 'error': 'Email already registered'}), 409

    current_app.logger.info("Checking duplicate workspace for %s", workspace_name)
    if Workspace.query.filter_by(name=workspace_name).first():
        current_app.logger.warning("Workspace uniqueness check failed for %s", workspace_name)
        return jsonify({'success': False, 'error': 'Workspace name already exists'}), 409
        
    try:
        # Step 1: Create Organization
        org = Organization(
            name=company_name,
            industry=industry,
            country=country
        )
        db.session.add(org)
        db.session.flush() # To get org.id
        
        # Step 2: Create Workspace
        workspace = Workspace(
            organization_id=org.id,
            name=workspace_name,
            timezone=timezone
        )
        db.session.add(workspace)
        db.session.flush() # To get workspace.id
        
        # Step 3: Create Admin User
        admin_user = User(
            workspace_id=workspace.id,
            name=admin_name,
            email=email,
            phone=phone,
            password_hash=generate_password_hash(password),
            role='Admin'
        )
        db.session.add(admin_user)
        
        # (In a real app, we would seed default dashboards, templates here)
        # For assignment scope, we commit the core multi-tenant structure
        
        db.session.commit()
        current_app.logger.info(
            "Onboarding successful: org_id=%s workspace_id=%s admin_user_id=%s",
            org.id,
            workspace.id,
            admin_user.id
        )
        
        # Generate JWT token
        additional_claims = {"role": admin_user.role, "workspace_id": workspace.id}
        access_token = create_access_token(identity=admin_user.id, additional_claims=additional_claims)
        
        return jsonify({
            'success': True,
            'message': 'Workspace created successfully',
            'access_token': access_token,
            'refresh_token': access_token, # mock refresh token for now
            'user': {
                'id': admin_user.id,
                'name': admin_user.name,
                'email': admin_user.email,
                'role': admin_user.role,
                'workspace_id': workspace.id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error("Database exception during onboarding: %s", str(e))
        current_app.logger.error("Onboarding stack trace:\n%s", traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@workspaces_bp.route('/members', methods=['GET'])
@jwt_required()
def get_members():
    workspace_id = get_jwt().get('workspace_id')
    if not workspace_id:
        return jsonify({'error': 'Workspace ID missing from token'}), 400
        
    members = User.query.filter_by(workspace_id=workspace_id).all()
    return jsonify([{
        'id': m.id,
        'name': m.name,
        'email': m.email,
        'role': m.role,
        'status': 'Active',
        'isMe': m.id == get_jwt_identity()
    } for m in members]), 200

@workspaces_bp.route('/members', methods=['POST'])
@jwt_required()
@role_required('Admin')
def add_member():
    workspace_id = get_jwt().get('workspace_id')
    if not workspace_id:
        return jsonify({'error': 'Workspace ID missing from token'}), 400
        
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password', 'MemberPass123!')
    role = data.get('role', 'Viewer')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    if role == 'Campaign Manager':
        role = 'Marketing Manager'

    new_user = User(
        workspace_id=workspace_id,
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'id': new_user.id,
        'name': new_user.name,
        'email': new_user.email,
        'role': new_user.role,
        'status': 'Active',
        'isMe': False
    }), 201

@workspaces_bp.route('/members/<id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def update_member(id):
    workspace_id = get_jwt().get('workspace_id')
    if not workspace_id:
        return jsonify({'error': 'Workspace ID missing from token'}), 400
        
    user = User.query.filter_by(id=id, workspace_id=workspace_id).first_or_404()
    data = request.json
    role = data.get('role')

    if role:
        if role == 'Campaign Manager':
            role = 'Marketing Manager'
        user.role = role
        db.session.commit()

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'status': 'Active',
        'isMe': user.id == get_jwt_identity()
    }), 200

@workspaces_bp.route('/members/<id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delete_member(id):
    workspace_id = get_jwt().get('workspace_id')
    if not workspace_id:
        return jsonify({'error': 'Workspace ID missing from token'}), 400
        
    current_user_id = get_jwt_identity()
    if id == current_user_id:
        return jsonify({'error': 'You cannot remove yourself from the workspace'}), 400

    user = User.query.filter_by(id=id, workspace_id=workspace_id).first_or_404()
    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'Member removed successfully'}), 200

@workspaces_bp.route('/permissions', methods=['GET'])
@jwt_required()
def get_permissions():
    workspace_id = get_jwt().get('workspace_id')
    workspace = Workspace.query.get(workspace_id)
    if not workspace:
        return jsonify(error="Workspace not found"), 404
        
    import json
    if workspace.role_permissions:
        return jsonify(json.loads(workspace.role_permissions)), 200
        
    # Default fallback
    default_matrix = [
      { 'permission': 'campaign.create', 'roles': { 'Admin': True, 'Manager': True, 'Analyst': True, 'Viewer': False } },
      { 'permission': 'campaign.delete', 'roles': { 'Admin': True, 'Manager': False, 'Analyst': False, 'Viewer': False } },
      { 'permission': 'journey.edit', 'roles': { 'Admin': True, 'Manager': True, 'Analyst': False, 'Viewer': False } },
      { 'permission': 'ai.access', 'roles': { 'Admin': True, 'Manager': True, 'Analyst': True, 'Viewer': True } },
      { 'permission': 'workspace.manage', 'roles': { 'Admin': True, 'Manager': False, 'Analyst': False, 'Viewer': False } },
    ]
    return jsonify(default_matrix), 200

@workspaces_bp.route('/permissions', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def update_permissions():
    workspace_id = get_jwt().get('workspace_id')
    workspace = Workspace.query.get(workspace_id)
    if not workspace:
        return jsonify(error="Workspace not found"), 404
        
    import json
    try:
        data = request.get_json()
        if not isinstance(data, list):
            return jsonify(error="Invalid data format"), 400
        workspace.role_permissions = json.dumps(data)
        db.session.commit()
        return jsonify({"message": "Permissions updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error=str(e)), 500

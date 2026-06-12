from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already taken'}), 409

        user = User(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        return jsonify({'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify({'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
def me():
    from flask_jwt_extended import jwt_required, get_jwt_identity
    @jwt_required()
    def protected():
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'id': user.id, 'username': user.username, 'email': user.email}), 200
    return protected()
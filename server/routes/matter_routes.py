from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.matter import Matter
from app import db

matter_bp = Blueprint('matters', __name__)

@matter_bp.route('/', methods=['GET'])
@jwt_required()
def get_matters():
    try:
        user_id = int(get_jwt_identity())
        matters = Matter.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': m.id,
            'title': m.title,
            'client_name': m.client_name,
            'matter_type': m.matter_type,
            'jurisdiction': m.jurisdiction,
            'description': m.description,
            'status': m.status,
            'created_at': m.created_at.isoformat(),
            'updated_at': m.updated_at.isoformat()
        } for m in matters]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@matter_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_matter(id):
    try:
        user_id = int(get_jwt_identity())
        matter = Matter.query.filter_by(id=id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Matter not found'}), 404
        return jsonify({
            'id': matter.id,
            'title': matter.title,
            'client_name': matter.client_name,
            'matter_type': matter.matter_type,
            'jurisdiction': matter.jurisdiction,
            'description': matter.description,
            'status': matter.status,
            'created_at': matter.created_at.isoformat(),
            'updated_at': matter.updated_at.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@matter_bp.route('/', methods=['POST'])
@jwt_required()
def create_matter():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        if not data.get('title') or not data.get('client_name') or not data.get('matter_type') or not data.get('jurisdiction'):
            return jsonify({'error': 'Title, client name, matter type, and jurisdiction are required'}), 400

        matter = Matter(
            title=data['title'],
            client_name=data['client_name'],
            matter_type=data['matter_type'],
            jurisdiction=data['jurisdiction'],
            description=data.get('description', ''),
            status=data.get('status', 'Active'),
            user_id=user_id
        )

        db.session.add(matter)
        db.session.commit()

        return jsonify({
            'id': matter.id,
            'title': matter.title,
            'client_name': matter.client_name,
            'matter_type': matter.matter_type,
            'jurisdiction': matter.jurisdiction,
            'description': matter.description,
            'status': matter.status,
            'created_at': matter.created_at.isoformat(),
            'updated_at': matter.updated_at.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@matter_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_matter(id):
    try:
        user_id = int(get_jwt_identity())
        matter = Matter.query.filter_by(id=id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Matter not found'}), 404

        data = request.get_json()
        if 'title' in data:
            matter.title = data['title']
        if 'client_name' in data:
            matter.client_name = data['client_name']
        if 'matter_type' in data:
            matter.matter_type = data['matter_type']
        if 'jurisdiction' in data:
            matter.jurisdiction = data['jurisdiction']
        if 'description' in data:
            matter.description = data['description']
        if 'status' in data:
            matter.status = data['status']

        db.session.commit()

        return jsonify({
            'id': matter.id,
            'title': matter.title,
            'client_name': matter.client_name,
            'matter_type': matter.matter_type,
            'jurisdiction': matter.jurisdiction,
            'description': matter.description,
            'status': matter.status,
            'created_at': matter.created_at.isoformat(),
            'updated_at': matter.updated_at.isoformat()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@matter_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_matter(id):
    try:
        user_id = int(get_jwt_identity())
        matter = Matter.query.filter_by(id=id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Matter not found'}), 404

        db.session.delete(matter)
        db.session.commit()
        return jsonify({'message': 'Matter deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
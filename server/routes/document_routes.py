from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.document import Document
from models.matter import Matter
from app import db
import os
import anthropic

document_bp = Blueprint('documents', __name__)

@document_bp.route('/matter/<int:matter_id>', methods=['GET'])
@jwt_required()
def get_documents(matter_id):
    try:
        user_id = int(get_jwt_identity())
        matter = Matter.query.filter_by(id=matter_id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Matter not found'}), 404

        documents = Document.query.filter_by(matter_id=matter_id).all()
        return jsonify([{
            'id': d.id,
            'title': d.title,
            'document_type': d.document_type,
            'content': d.content,
            'status': d.status,
            'matter_id': d.matter_id,
            'created_at': d.created_at.isoformat(),
            'updated_at': d.updated_at.isoformat()
        } for d in documents]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@document_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_document(id):
    try:
        user_id = int(get_jwt_identity())
        document = Document.query.get(id)
        if not document:
            return jsonify({'error': 'Document not found'}), 404

        matter = Matter.query.filter_by(id=document.matter_id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Unauthorized'}), 403

        return jsonify({
            'id': document.id,
            'title': document.title,
            'document_type': document.document_type,
            'content': document.content,
            'status': document.status,
            'matter_id': document.matter_id,
            'created_at': document.created_at.isoformat(),
            'updated_at': document.updated_at.isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@document_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_document():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        matter_id = data.get('matter_id')
        document_type = data.get('document_type')
        parties = data.get('parties')
        jurisdiction = data.get('jurisdiction')
        notes = data.get('notes', '')

        if not matter_id or not document_type or not parties or not jurisdiction:
            return jsonify({'error': 'matter_id, document_type, parties, and jurisdiction are required'}), 400

        matter = Matter.query.filter_by(id=matter_id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Matter not found'}), 404

        client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

        prompt = f"""You are a legal document drafting assistant. Draft a professional {document_type} with the following details:

Parties: {parties}
Jurisdiction: {jurisdiction}
Matter: {matter.title}
Client: {matter.client_name}
Additional Notes: {notes}

Please draft a complete, professional {document_type}. Use standard legal formatting and language appropriate for {jurisdiction}. Include all standard clauses and provisions typical for this document type."""

        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        generated_content = message.content[0].text

        document = Document(
            title=f"{document_type} - {matter.client_name}",
            document_type=document_type,
            content=generated_content,
            status='Draft',
            matter_id=matter_id
        )

        db.session.add(document)
        db.session.commit()

        return jsonify({
            'id': document.id,
            'title': document.title,
            'document_type': document.document_type,
            'content': document.content,
            'status': document.status,
            'matter_id': document.matter_id,
            'created_at': document.created_at.isoformat(),
            'updated_at': document.updated_at.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@document_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_document(id):
    try:
        user_id = int(get_jwt_identity())
        document = Document.query.get(id)
        if not document:
            return jsonify({'error': 'Document not found'}), 404

        matter = Matter.query.filter_by(id=document.matter_id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        if 'title' in data:
            document.title = data['title']
        if 'content' in data:
            document.content = data['content']
        if 'status' in data:
            document.status = data['status']

        db.session.commit()

        return jsonify({
            'id': document.id,
            'title': document.title,
            'document_type': document.document_type,
            'content': document.content,
            'status': document.status,
            'matter_id': document.matter_id,
            'created_at': document.created_at.isoformat(),
            'updated_at': document.updated_at.isoformat()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@document_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_document(id):
    try:
        user_id = int(get_jwt_identity())
        document = Document.query.get(id)
        if not document:
            return jsonify({'error': 'Document not found'}), 404

        matter = Matter.query.filter_by(id=document.matter_id, user_id=user_id).first()
        if not matter:
            return jsonify({'error': 'Unauthorized'}), 403

        db.session.delete(document)
        db.session.commit()
        return jsonify({'message': 'Document deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
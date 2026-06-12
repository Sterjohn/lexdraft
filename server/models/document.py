from app import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    document_type = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='Draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    matter_id = db.Column(db.Integer, db.ForeignKey('matters.id'), nullable=False)

    def __repr__(self):
        return f'<Document {self.title}>'
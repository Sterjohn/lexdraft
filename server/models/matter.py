from app import db
from datetime import datetime

class Matter(db.Model):
    __tablename__ = 'matters'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    client_name = db.Column(db.String(200), nullable=False)
    matter_type = db.Column(db.String(100), nullable=False)
    jurisdiction = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    documents = db.relationship('Document', backref='matter', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Matter {self.title}>'
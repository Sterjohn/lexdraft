from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from routes.auth_routes import auth_bp
    from routes.matter_routes import matter_bp
    from routes.document_routes import document_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(matter_bp, url_prefix='/matters')
    app.register_blueprint(document_bp, url_prefix='/documents')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
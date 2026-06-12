# LexDraft

LexDraft is an AI-powered legal document drafting assistant built for attorneys and legal professionals. Users can organize client matters, generate first-draft legal documents using the Anthropic Claude API, and edit and save documents — all in one place.

## Features

- User authentication (register, login, logout)
- Create, view, edit, and delete client matters
- AI-generated legal documents using the Anthropic Claude API
- Edit and save AI-generated drafts inline
- Documents organized by matter
- Protected routes — users can only access their own data

## Tech Stack

**Frontend**
- React
- React Router v6
- Axios
- Tailwind CSS

**Backend**
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-Bcrypt
- Flask-CORS
- PostgreSQL
- Anthropic Claude API

## Project Structure

```
lexdraft/
├── client/          # React frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
└── server/          # Flask backend
    ├── models/
    ├── routes/
    ├── schemas/
    └── migrations/
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js
- PostgreSQL

### Backend Setup

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install flask flask-sqlalchemy flask-migrate flask-bcrypt flask-jwt-extended flask-marshmallow marshmallow-sqlalchemy python-dotenv psycopg2-binary anthropic flask-cors
```

Create a `.env` file in the `server` folder:
DATABASE_URL=postgresql://localhost/lexdraft
JWT_SECRET_KEY=your_secret_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

Create the database and run migrations:

```bash
createdb lexdraft
flask --app app.py db upgrade
```

Start the Flask server:

```bash
flask --app app.py run
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

The app will open at `http://localhost:3000`.

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive JWT token |
| GET | /auth/me | Get current user |

### Matters
| Method | Route | Description |
|--------|-------|-------------|
| GET | /matters/ | Get all matters for current user |
| GET | /matters/:id | Get a single matter |
| POST | /matters/ | Create a new matter |
| PATCH | /matters/:id | Update a matter |
| DELETE | /matters/:id | Delete a matter |

### Documents
| Method | Route | Description |
|--------|-------|-------------|
| GET | /documents/matter/:id | Get all documents for a matter |
| GET | /documents/:id | Get a single document |
| POST | /documents/generate | Generate a document using AI |
| PATCH | /documents/:id | Update a document |
| DELETE | /documents/:id | Delete a document |

## Data Models

**User** — id, username, email, password_hash
**Matter** — id, title, client_name, matter_type, jurisdiction, description, status, user_id
**Document** — id, title, document_type, content, status, matter_id, created_at, updated_at

## Author

Sterling Johnson — [GitHub](https://github.com/Sterjohn)
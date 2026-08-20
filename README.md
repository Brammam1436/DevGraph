# DevGraph

DevGraph is a graph-based developer relationship visualization application
built using Django REST Framework, React and CognoDB.

## Technologies

- Python
- Django
- Django REST Framework
- React
- JavaScript
- Neo4j Python Driver
- CognoDB
- openCypher

## Features

- Developer graph visualization
- Developer profiles
- Skills and technologies
- Project relationships
- Graph search
- Node type filtering
- Developer filtering
- Graph statistics
- Relationship visualization

## Architecture

React Frontend
        |
        | REST API
        ↓
Django REST Framework
        |
        | Neo4j Driver
        ↓
CognoDB

## Why Graph Database?

DevGraph focuses on relationships between developers,
skills, technologies and projects.

A graph database makes relationship traversal and
multi-hop queries natural and efficient.

## Graph Model

Developer
    |
    | KNOWS
    ↓
Technology
    |
    | USED_IN
    ↓
Project

Developer
    |
    | HAS_SKILL
    ↓
Skill

## Backend Setup

Create virtual environment:

    python -m venv venv

Activate:

    .\venv\Scripts\Activate.ps1

Install dependencies:

    pip install -r requirements.txt

Create `.env`:

    COGNODB_URI=your_uri
    COGNODB_USERNAME=cognodb
    COGNODB_PASSWORD=your_password

Run Django:

    python manage.py runserver

## Frontend Setup

    cd frontend
    npm install
    npm run dev

## API

GET /api/graph/

GET /api/developers/

GET /api/developers/<id>/graph/

## Future Improvements

- Advanced graph traversal
- Recommendation system
- More graph analytics
- Authentication
- Production deployment
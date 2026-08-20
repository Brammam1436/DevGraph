import sys
from pathlib import Path

# Add project root to Python path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

from graph.database import CognoDB


developers = [
    {
        "name": "Ravi",
        "email": "ravi@example.com",
        "experience": 2
    },
    {
        "name": "Anjali",
        "email": "anjali@example.com",
        "experience": 3
    },
    {
        "name": "Kiran",
        "email": "kiran@example.com",
        "experience": 4
    },
    {
        "name": "Priya",
        "email": "priya@example.com",
        "experience": 2
    },
    {
        "name": "Arjun",
        "email": "arjun@example.com",
        "experience": 5
    }
]


skills = [
    {
        "name": "Python",
        "level": "Advanced"
    },
    {
        "name": "JavaScript",
        "level": "Intermediate"
    },
    {
        "name": "React",
        "level": "Advanced"
    },
    {
        "name": "Django",
        "level": "Intermediate"
    },
    {
        "name": "REST API",
        "level": "Advanced"
    },
    {
        "name": "SQL",
        "level": "Intermediate"
    },
    {
        "name": "Machine Learning",
        "level": "Intermediate"
    },
    {
        "name": "Docker",
        "level": "Beginner"
    }
]


technologies = [
    {
        "name": "Django",
        "category": "Backend"
    },
    {
        "name": "React",
        "category": "Frontend"
    },
    {
        "name": "Django REST Framework",
        "category": "Backend"
    },
    {
        "name": "MySQL",
        "category": "Database"
    },
    {
        "name": "Scikit-learn",
        "category": "AI"
    },
    {
        "name": "Docker",
        "category": "DevOps"
    },
    {
        "name": "FastAPI",
        "category": "Backend"
    },
    {
        "name": "PostgreSQL",
        "category": "Database"
    }
]


projects = [
    {
        "name": "E-Commerce API",
        "description": "Backend API for an online shopping platform",
        "difficulty": "Intermediate"
    },
    {
        "name": "Food Delivery Platform",
        "description": "Application for ordering and tracking food deliveries",
        "difficulty": "Advanced"
    },
    {
        "name": "AI Student Predictor",
        "description": "Machine learning system for predicting student performance",
        "difficulty": "Advanced"
    },
    {
        "name": "Task Management App",
        "description": "Application for managing tasks and teams",
        "difficulty": "Beginner"
    },
    {
        "name": "Developer Portfolio",
        "description": "Personal portfolio application for developers",
        "difficulty": "Beginner"
    },
    {
        "name": "Cloud Deployment System",
        "description": "Containerized application deployment platform",
        "difficulty": "Advanced"
    }
]


developer_skills = [
    ("ravi@example.com", "Python"),
    ("ravi@example.com", "Django"),
    ("ravi@example.com", "REST API"),
    ("ravi@example.com", "SQL"),

    ("anjali@example.com", "Python"),
    ("anjali@example.com", "React"),
    ("anjali@example.com", "JavaScript"),

    ("kiran@example.com", "Python"),
    ("kiran@example.com", "Machine Learning"),
    ("kiran@example.com", "SQL"),

    ("priya@example.com", "React"),
    ("priya@example.com", "JavaScript"),
    ("priya@example.com", "REST API"),

    ("arjun@example.com", "Python"),
    ("arjun@example.com", "Docker"),
    ("arjun@example.com", "Django")
]


skill_technologies = [
    ("Python", "Django"),
    ("Python", "FastAPI"),
    ("JavaScript", "React"),
    ("React", "React"),
    ("Django", "Django"),
    ("REST API", "Django REST Framework"),
    ("SQL", "MySQL"),
    ("SQL", "PostgreSQL"),
    ("Machine Learning", "Scikit-learn"),
    ("Docker", "Docker")
]


technology_projects = [
    ("Django", "E-Commerce API"),
    ("Django REST Framework", "E-Commerce API"),
    ("React", "E-Commerce API"),

    ("Django", "Food Delivery Platform"),
    ("React", "Food Delivery Platform"),
    ("Django REST Framework", "Food Delivery Platform"),

    ("Python", "AI Student Predictor"),
    ("Scikit-learn", "AI Student Predictor"),

    ("React", "Task Management App"),
    ("Django", "Task Management App"),

    ("React", "Developer Portfolio"),
    ("Django", "Developer Portfolio"),

    ("Docker", "Cloud Deployment System")
]


developer_projects = [
    ("ravi@example.com", "E-Commerce API"),
    ("ravi@example.com", "Task Management App"),

    ("anjali@example.com", "Developer Portfolio"),
    ("anjali@example.com", "E-Commerce API"),

    ("kiran@example.com", "AI Student Predictor"),

    ("priya@example.com", "Food Delivery Platform"),
    ("priya@example.com", "Developer Portfolio"),

    ("arjun@example.com", "Cloud Deployment System"),
    ("arjun@example.com", "E-Commerce API")
]

def seed_database():

    db = CognoDB()

    try:

        print("Checking CognoDB connection...")
        db.verify_connection()

        print("Connection successful!")

        # -------------------------
        # Create Developers
        # -------------------------

        for developer in developers:

            db.run_query(
                """
                MERGE (d:Developer {email: $email})
                SET
                    d.name = $name,
                    d.experience = $experience
                """,
                developer
            )

        print("Developers created.")

        # -------------------------
        # Create Skills
        # -------------------------

        for skill in skills:

            db.run_query(
                """
                MERGE (s:Skill {name: $name})
                SET s.level = $level
                """,
                skill
            )

        print("Skills created.")

        # -------------------------
        # Create Technologies
        # -------------------------

        for technology in technologies:

            db.run_query(
                """
                MERGE (t:Technology {name: $name})
                SET t.category = $category
                """,
                technology
            )

        print("Technologies created.")

        # -------------------------
        # Create Projects
        # -------------------------

        for project in projects:

            db.run_query(
                """
                MERGE (p:Project {name: $name})
                SET
                    p.description = $description,
                    p.difficulty = $difficulty
                """,
                project
            )

        print("Projects created.")

        # -------------------------
        # Developer -> Skill
        # -------------------------

        for email, skill in developer_skills:

            db.run_query(
                """
                MATCH (d:Developer {email: $email})
                MATCH (s:Skill {name: $skill})
                MERGE (d)-[:HAS_SKILL]->(s)
                """,
                {
                    "email": email,
                    "skill": skill
                }
            )

        print("Developer-Skill relationships created.")

        # -------------------------
        # Skill -> Technology
        # -------------------------

        for skill, technology in skill_technologies:

            db.run_query(
                """
                MATCH (s:Skill {name: $skill})
                MATCH (t:Technology {name: $technology})
                MERGE (s)-[:RELATED_TO]->(t)
                """,
                {
                    "skill": skill,
                    "technology": technology
                }
            )

        print("Skill-Technology relationships created.")

        # -------------------------
        # Technology -> Project
        # -------------------------

        for technology, project in technology_projects:

            db.run_query(
                """
                MATCH (t:Technology {name: $technology})
                MATCH (p:Project {name: $project})
                MERGE (t)-[:USED_IN]->(p)
                """,
                {
                    "technology": technology,
                    "project": project
                }
            )

        print("Technology-Project relationships created.")

        # -------------------------
        # Developer -> Project
        # -------------------------

        for email, project in developer_projects:

            db.run_query(
                """
                MATCH (d:Developer {email: $email})
                MATCH (p:Project {name: $project})
                MERGE (d)-[:WORKED_ON]->(p)
                """,
                {
                    "email": email,
                    "project": project
                }
            )

        print("Developer-Project relationships created.")

        print("\nGraph database seeded successfully!")


    except Exception as e:

        print("\nError while seeding database:")
        print(e)

    finally:

        db.close()


if __name__ == "__main__":
    seed_database()
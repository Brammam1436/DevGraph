import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()


class CognoDB:

    def __init__(self):
        self.uri = os.getenv("COGNODB_URI")
        self.username = os.getenv("COGNODB_USERNAME")
        self.password = os.getenv("COGNODB_PASSWORD")

        if not self.uri:
            raise ValueError("COGNODB_URI is not configured")

        if not self.username:
            raise ValueError("COGNODB_USERNAME is not configured")

        if not self.password:
            raise ValueError("COGNODB_PASSWORD is not configured")

        self.driver = GraphDatabase.driver(
            self.uri,
            auth=(self.username, self.password)
        )

    def verify_connection(self):
        self.driver.verify_connectivity()
        return True

    def run_query(self, query, parameters=None):

        with self.driver.session() as session:

            result = session.run(
                query,
                parameters or {}
            )

            return [record.data() for record in result]

    def close(self):
        self.driver.close()
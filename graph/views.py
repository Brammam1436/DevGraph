from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from neo4j import GraphDatabase

import os


COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(
        COGNODB_USERNAME,
        COGNODB_PASSWORD
    )
)

from .database import CognoDB
from .queries import (
    GET_ALL_DEVELOPERS,
    GET_DEVELOPER_BY_EMAIL
)

from .queries import (
    GET_ALL_DEVELOPERS,
    GET_DEVELOPER_BY_EMAIL,
    RECOMMENDED_PROJECTS,
    GET_ALL_PROJECTS,
    GET_ALL_SKILLS,
    GET_ALL_TECHNOLOGIES
)


class CognoDBTestAPIView(APIView):

    def get(self, request):

        db = None

        try:
            db = CognoDB()

            db.verify_connection()

            result = db.run_query(
                "RETURN 'CognoDB connection successful' AS message"
            )

            return Response(
                {
                    "status": "success",
                    "message": result[0]["message"]
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "status": "error",
                    "message": "Could not connect to CognoDB",
                    "error": str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        finally:

            if db:
                db.close()


class DeveloperListAPIView(APIView):

    def get(self, request):

        db = None

        try:
            search = request.query_params.get("search", "").strip()

            db = CognoDB()

            db.verify_connection()

            developers = db.run_query(
                GET_ALL_DEVELOPERS,
                {
                    "search": search
                }
            )

            return Response(
                {
                    "count": len(developers),
                    "results": developers
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "status": "error",
                    "message": "Unable to retrieve developers",
                    "error": str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        finally:

            if db:
                db.close()


class DeveloperDetailAPIView(APIView):

    def get(self, request, email):

        db = None

        try:
            db = CognoDB()

            db.verify_connection()

            developers = db.run_query(
                GET_DEVELOPER_BY_EMAIL,
                {
                    "email": email
                }
            )

            if not developers:

                return Response(
                    {
                        "status": "error",
                        "message": "Developer not found"
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                developers[0],
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "status": "error",
                    "message": "Unable to retrieve developer",
                    "error": str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        finally:

            if db:
                db.close()

class ProjectRecommendationAPIView(APIView):

    def get(self, request, email):

        db = None

        try:
            db = CognoDB()

            db.verify_connection()

            recommendations = db.run_query(
                RECOMMENDED_PROJECTS,
                {
                    "email": email
                }
            )

            if not recommendations:
                return Response(
                    {
                        "status": "success",
                        "message": "No recommended projects found",
                        "results": []
                    },
                    status=status.HTTP_200_OK
                )

            return Response(
                {
                    "status": "success",
                    "count": len(recommendations),
                    "results": recommendations
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "status": "error",
                    "message": "Unable to generate project recommendations",
                    "error": str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        finally:

            if db:
                db.close()

class ProjectListAPIView(APIView):

    def get(self, request):

        db = None

        try:

            # -------------------------
            # Search
            # -------------------------

            search = request.query_params.get(
                "search",
                ""
            ).strip()


            # -------------------------
            # Difficulty filter
            # -------------------------

            difficulty = request.query_params.get(
                "difficulty",
                ""
            ).strip()


            # -------------------------
            # Page
            # -------------------------

            try:
                page = int(
                    request.query_params.get(
                        "page",
                        1
                    )
                )
            except ValueError:

                return Response(
                    {
                        "status": "error",
                        "message": "page must be a number"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # -------------------------
            # Page size
            # -------------------------

            try:
                page_size = int(
                    request.query_params.get(
                        "page_size",
                        3
                    )
                )
            except ValueError:

                return Response(
                    {
                        "status": "error",
                        "message": "page_size must be a number"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # -------------------------
            # Validate page
            # -------------------------

            if page < 1:

                return Response(
                    {
                        "status": "error",
                        "message": "page must be greater than 0"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # -------------------------
            # Validate page size
            # -------------------------

            if page_size < 1 or page_size > 50:

                return Response(
                    {
                        "status": "error",
                        "message": "page_size must be between 1 and 50"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )


            # -------------------------
            # Calculate skip
            # -------------------------

            skip = (page - 1) * page_size


            # -------------------------
            # Connect to CognoDB
            # -------------------------

            db = CognoDB()

            db.verify_connection()


            # -------------------------
            # Get total count
            # -------------------------

            count_result = db.run_query(
                """
                MATCH (p:Project)

                WHERE
                    (
                        $search = ""
                        OR toLower(p.name) CONTAINS toLower($search)
                        OR toLower(p.description) CONTAINS toLower($search)
                    )
                    AND
                    (
                        $difficulty = ""
                        OR toLower(p.difficulty) = toLower($difficulty)
                    )

                RETURN count(p) AS total
                """,
                {
                    "search": search,
                    "difficulty": difficulty
                }
            )

            total_count = count_result[0]["total"]


            # -------------------------
            # Get projects
            # -------------------------

            projects = db.run_query(
                GET_ALL_PROJECTS,
                {
                    "search": search,
                    "difficulty": difficulty,
                    "skip": skip,
                    "limit": page_size
                }
            )


            # -------------------------
            # Calculate total pages
            # -------------------------

            total_pages = (
                total_count + page_size - 1
            ) // page_size


            # -------------------------
            # Response
            # -------------------------

            return Response(
                {
                    "count": total_count,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": total_pages,
                    "results": projects
                },
                status=status.HTTP_200_OK
            )


        except Exception:

            return Response(
                {
                    "status": "error",
                    "message": "Unable to retrieve projects"
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


        finally:

            if db:
                db.close()

class SkillListAPIView(APIView):

    def get(self, request):

        db = None

        try:
            search = request.query_params.get(
                "search",
                ""
            ).strip()

            db = CognoDB()

            db.verify_connection()

            skills = db.run_query(
                GET_ALL_SKILLS,
                {
                    "search": search
                }
            )

            return Response(
                {
                    "count": len(skills),
                    "results": skills
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "status": "error",
                    "message": "Unable to retrieve skills",
                    "error": str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        finally:

            if db:
                db.close()

class TechnologyListAPIView(APIView):

    def get(self, request):

        db = None

        try:
            search = request.query_params.get(
                "search",
                ""
            ).strip()

            db = CognoDB()

            db.verify_connection()

            technologies = db.run_query(
                GET_ALL_TECHNOLOGIES,
                {
                    "search": search
                }
            )

            return Response(
                {
                    "count": len(technologies),
                    "results": technologies
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "status": "error",
                    "message": "Unable to retrieve technologies",
                    "error": str(e)
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        finally:

            if db:
                db.close()

class GraphApiView(APIView):

    def get(self, request):

        nodes = []
        links = []

        query = """
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m
        LIMIT 500
        """

        try:

            with driver.session() as session:

                result = session.run(query)

                node_ids = set()

                for record in result:

                    n = record["n"]
                    r = record["r"]
                    m = record["m"]


                    # Add first node

                    if n is not None:

                        node_id = str(n.element_id)

                        if node_id not in node_ids:

                            nodes.append({
                                "id": node_id,
                                "label": (
                                    n.get("name")
                                    or n.get("title")
                                    or node_id
                                ),
                                "group": (
                                    list(n.labels)[0]
                                    if n.labels
                                    else "Node"
                                )
                            })

                            node_ids.add(node_id)


                    # Add second node

                    if m is not None:

                        node_id = str(m.element_id)

                        if node_id not in node_ids:

                            nodes.append({
                                "id": node_id,
                                "label": (
                                    m.get("name")
                                    or m.get("title")
                                    or node_id
                                ),
                                "group": (
                                    list(m.labels)[0]
                                    if m.labels
                                    else "Node"
                                )
                            })

                            node_ids.add(node_id)


                    # Add relationship

                    if r is not None:

                        links.append({
                            "source": str(
                                n.element_id
                            ),

                            "target": str(
                                m.element_id
                            ),

                            "label": r.type
                        })


            return Response({
                "nodes": nodes,
                "links": links
            })


        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeveloperGraphApiView(APIView):

    def get(self, request, developer_id):

        nodes = []
        links = []

        query = """
        MATCH (d)
        WHERE elementId(d) = $developer_id

        OPTIONAL MATCH path = (d)-[*1..2]-(connected)

        WITH d, collect(DISTINCT connected) AS connected_nodes

        UNWIND connected_nodes AS n

        OPTIONAL MATCH (n)-[r]-(m)

        WHERE m IS NOT NULL
          AND (
              elementId(n) = elementId(d)
              OR elementId(m) = elementId(d)
          )

        RETURN d, n, r, m
        """

        try:

            with driver.session() as session:

                result = session.run(
                    query,
                    developer_id=developer_id
                )

                node_ids = set()

                for record in result:

                    d = record["d"]
                    n = record["n"]
                    r = record["r"]
                    m = record["m"]

                    # Developer node

                    if d is not None:

                        node_id = str(
                            d.element_id
                        )

                        if node_id not in node_ids:

                            nodes.append({
                                "id": node_id,

                                "label": (
                                    d.get("name")
                                    or d.get("username")
                                    or node_id
                                ),

                                "group": (
                                    list(d.labels)[0]
                                    if d.labels
                                    else "Developer"
                                )
                            })

                            node_ids.add(
                                node_id
                            )

                    # Connected node

                    if n is not None:

                        node_id = str(
                            n.element_id
                        )

                        if node_id not in node_ids:

                            nodes.append({
                                "id": node_id,

                                "label": (
                                    n.get("name")
                                    or n.get("title")
                                    or node_id
                                ),

                                "group": (
                                    list(n.labels)[0]
                                    if n.labels
                                    else "Node"
                                )
                            })

                            node_ids.add(
                                node_id
                            )

                    # Relationship

                    if (
                        r is not None
                        and n is not None
                        and m is not None
                    ):

                        links.append({
                            "source": str(
                                n.element_id
                            ),

                            "target": str(
                                m.element_id
                            ),

                            "label": r.type
                        })

            return Response({
                "nodes": nodes,
                "links": links
            })

        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeveloperProfileApiView(APIView):

    def get(self, request, developer_id):

        query = """
        MATCH (d)
        WHERE elementId(d) = $developer_id

        OPTIONAL MATCH (d)-[r]-(connected)

        RETURN
            d,
            collect({
                relationship: type(r),
                node: connected
            }) AS connections
        """

        try:

            with driver.session() as session:

                result = session.run(
                    query,
                    developer_id=developer_id
                )

                record = result.single()

                if not record:

                    return Response(
                        {
                            "error":
                            "Developer not found."
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )


                developer = record["d"]

                connections = record[
                    "connections"
                ]


                skills = []

                technologies = []

                projects = []


                for connection in connections:

                    node = connection["node"]

                    relationship = connection[
                        "relationship"
                    ]


                    if node is None:
                        continue


                    node_data = {

                        "id":
                            str(node.element_id),

                        "name":
                            node.get("name")
                            or node.get("title")
                            or node.get("username")
                            or str(node.element_id),

                        "type":
                            list(node.labels)[0]
                            if node.labels
                            else "Node",

                        "relationship":
                            relationship

                    }


                    node_type = (
                        node_data["type"]
                        .lower()
                    )


                    if "skill" in node_type:

                        skills.append(
                            node_data
                        )


                    elif "technology" in node_type:

                        technologies.append(
                            node_data
                        )


                    elif "project" in node_type:

                        projects.append(
                            node_data
                        )


                response_data = {

                    "id":
                        str(developer.element_id),

                    "name":
                        developer.get("name")
                        or developer.get("username")
                        or str(developer.element_id),

                    "skills":
                        skills,

                    "technologies":
                        technologies,

                    "projects":
                        projects,

                }


                return Response(
                    response_data
                )


        except Exception as e:

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
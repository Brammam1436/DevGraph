CREATE_DEVELOPER = """
MERGE (d:Developer {email: $email})
SET
    d.name = $name,
    d.experience = $experience
RETURN d
"""


CREATE_SKILL = """
MERGE (s:Skill {name: $name})
SET s.level = $level
RETURN s
"""


CREATE_TECHNOLOGY = """
MERGE (t:Technology {name: $name})
SET t.category = $category
RETURN t
"""


CREATE_PROJECT = """
MERGE (p:Project {name: $name})
SET
    p.description = $description,
    p.difficulty = $difficulty
RETURN p
"""

CREATE_DEVELOPER_SKILL = """
MATCH (d:Developer {email: $email})
MATCH (s:Skill {name: $skill})
MERGE (d)-[:HAS_SKILL]->(s)
RETURN d, s
"""


CREATE_SKILL_TECHNOLOGY = """
MATCH (s:Skill {name: $skill})
MATCH (t:Technology {name: $technology})
MERGE (s)-[:RELATED_TO]->(t)
RETURN s, t
"""


CREATE_TECHNOLOGY_PROJECT = """
MATCH (t:Technology {name: $technology})
MATCH (p:Project {name: $project})
MERGE (t)-[:USED_IN]->(p)
RETURN t, p
"""


CREATE_DEVELOPER_PROJECT = """
MATCH (d:Developer {email: $email})
MATCH (p:Project {name: $project})
MERGE (d)-[:WORKED_ON]->(p)
RETURN d, p
"""

GET_ALL_DEVELOPERS = """
MATCH (d:Developer)
WHERE
    $search = ""
    OR toLower(d.name) CONTAINS toLower($search)

OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)

RETURN
    d.name AS name,
    d.email AS email,
    d.experience AS experience,
    collect(DISTINCT s.name) AS skills,
    collect(DISTINCT p.name) AS projects

ORDER BY d.name
"""


GET_DEVELOPER_BY_EMAIL = """
MATCH (d:Developer {email: $email})

OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)

RETURN
    d.name AS name,
    d.email AS email,
    d.experience AS experience,
    collect(DISTINCT s.name) AS skills,
    collect(DISTINCT p.name) AS projects
"""

RECOMMENDED_PROJECTS = """
MATCH (d:Developer {email: $email})
      -[:HAS_SKILL]->(s:Skill)
      -[:RELATED_TO]->(t:Technology)
      -[:USED_IN]->(p:Project)

OPTIONAL MATCH (d)-[:WORKED_ON]->(worked:Project)

WITH
    d,
    p,
    collect(DISTINCT s.name) AS matched_skills,
    collect(DISTINCT t.name) AS matched_technologies,
    worked

WHERE worked IS NULL OR worked <> p

RETURN
    p.name AS project,
    p.description AS description,
    p.difficulty AS difficulty,
    matched_skills,
    matched_technologies,
    size(matched_skills) AS match_score

ORDER BY match_score DESC, p.name
"""

GET_ALL_PROJECTS = """
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

OPTIONAL MATCH (t:Technology)-[:USED_IN]->(p)

WITH
    p,
    collect(DISTINCT t.name) AS technologies

RETURN
    p.name AS name,
    p.description AS description,
    p.difficulty AS difficulty,
    technologies

ORDER BY p.name

SKIP $skip
LIMIT $limit
"""

GET_ALL_SKILLS = """
MATCH (s:Skill)

WHERE
    $search = ""
    OR toLower(s.name) CONTAINS toLower($search)

OPTIONAL MATCH (s)-[:RELATED_TO]->(t:Technology)

RETURN
    s.name AS name,
    s.level AS level,
    collect(DISTINCT t.name) AS technologies

ORDER BY s.name
"""

GET_ALL_TECHNOLOGIES = """
MATCH (t:Technology)

WHERE
    $search = ""
    OR toLower(t.name) CONTAINS toLower($search)

OPTIONAL MATCH (s:Skill)-[:RELATED_TO]->(t)

OPTIONAL MATCH (t)-[:USED_IN]->(p:Project)

RETURN
    t.name AS name,
    t.category AS category,
    collect(DISTINCT s.name) AS skills,
    collect(DISTINCT p.name) AS projects

ORDER BY t.name
"""
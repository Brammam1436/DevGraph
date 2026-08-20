import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

function Projects() {

    const [projects, setProjects] = useState([]);

    const [search, setSearch] = useState("");

    const [difficulty, setDifficulty] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize] = useState(3);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const loadProjects = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getProjects({
                page: page,
                pageSize: pageSize,
                search: search,
                difficulty: difficulty,
            });

            setProjects(data.results || []);

            setTotalPages(
                data.total_pages || 1
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load projects."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadProjects();

    }, [page]);


    const handleSearch = (event) => {

        setSearch(event.target.value);

    };


    const handleSearchSubmit = (event) => {

        event.preventDefault();

        setPage(1);

        loadProjects();

    };


    const handleDifficultyChange = (event) => {

        setDifficulty(event.target.value);

        setPage(1);

    };


    const nextPage = () => {

        if (page < totalPages) {

            setPage(page + 1);

        }

    };


    const previousPage = () => {

        if (page > 1) {

            setPage(page - 1);

        }

    };


    return (

        <div className="projects-page">

            <h1>Projects</h1>

            <p>
                Explore projects from the DevGraph knowledge graph.
            </p>


            {/* Search and Filter */}

            <div className="project-controls">

                <form onSubmit={handleSearchSubmit}>

                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={handleSearch}
                    />

                    <button type="submit">
                        Search
                    </button>

                </form>


                <select
                    value={difficulty}
                    onChange={handleDifficultyChange}
                >

                    <option value="">
                        All Difficulties
                    </option>

                    <option value="Beginner">
                        Beginner
                    </option>

                    <option value="Intermediate">
                        Intermediate
                    </option>

                    <option value="Advanced">
                        Advanced
                    </option>

                </select>

            </div>


            {/* Loading */}

            {loading && (
                <p>Loading projects...</p>
            )}


            {/* Error */}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}


            {/* Projects */}

            {!loading && !error && (

                <div className="project-grid">

                    {projects.length === 0 ? (

                        <p>
                            No projects found.
                        </p>

                    ) : (

                        projects.map((project, index) => (

                            <div
                                className="project-card"
                                key={index}
                            >

                                <h2>
                                    {project.name}
                                </h2>

                                <p>
                                    {project.description}
                                </p>


                                <p>
                                    <strong>
                                        Difficulty:
                                    </strong>{" "}
                                    {project.difficulty}
                                </p>


                                <div>

                                    <strong>
                                        Technologies:
                                    </strong>

                                    <div className="technology-list">

                                        {project.technologies?.map(
                                            (technology, techIndex) => (

                                                <span
                                                    className="technology-tag"
                                                    key={techIndex}
                                                >
                                                    {technology}
                                                </span>

                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}


            {/* Pagination */}

            {!loading && totalPages > 0 && (

                <div className="pagination">

                    <button
                        onClick={previousPage}
                        disabled={page === 1}
                    >
                        ← Previous
                    </button>


                    <span>
                        Page {page} of {totalPages}
                    </span>


                    <button
                        onClick={nextPage}
                        disabled={page === totalPages}
                    >
                        Next →
                    </button>

                </div>

            )}

        </div>

    );
}

export default Projects;
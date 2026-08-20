import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";


function DeveloperProfile() {

    const { developerId } = useParams();

    const navigate = useNavigate();


    const [developer, setDeveloper] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==============================
    // LOAD DEVELOPER PROFILE
    // ==============================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/developers/${developerId}/profile/`
                    );


                console.log(
                    "Developer profile:",
                    response.data
                );


                setDeveloper(
                    response.data
                );


            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );


                setError(
                    "Unable to load developer profile."
                );


            } finally {

                setLoading(false);

            }

        };


        loadProfile();

    }, [developerId]);


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="profile-page">

                <h1>
                    Developer Profile
                </h1>

                <p>
                    Loading profile...
                </p>

            </div>

        );

    }


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        return (

            <div className="profile-page">

                <h1>
                    Developer Profile
                </h1>

                <p>
                    {error}
                </p>


                <button
                    onClick={() =>
                        navigate("/graph")
                    }
                >
                    Back to Graph
                </button>

            </div>

        );

    }


    // ==============================
    // NO DATA
    // ==============================

    if (!developer) {

        return (

            <div className="profile-page">

                <h1>
                    Developer not found
                </h1>


                <button
                    onClick={() =>
                        navigate("/graph")
                    }
                >
                    Back to Graph
                </button>

            </div>

        );

    }


    // ==============================
    // PROFILE UI
    // ==============================

    return (

        <div className="profile-page">


            {/* HEADER */}

            <div className="profile-header">

                <button
                    onClick={() =>
                        navigate("/graph")
                    }
                >
                    ← Back to Graph
                </button>


                <h1>
                    {developer.name}
                </h1>


                <p>
                    Developer Profile
                </p>

            </div>


            {/* STATISTICS */}

            <div className="profile-stats">


                <div className="stat-card">

                    <h3>
                        Skills
                    </h3>

                    <p>
                        {
                            developer.skills?.length || 0
                        }
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Technologies
                    </h3>

                    <p>
                        {
                            developer.technologies?.length || 0
                        }
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Projects
                    </h3>

                    <p>
                        {
                            developer.projects?.length || 0
                        }
                    </p>

                </div>


            </div>


            {/* ==========================
                SKILLS
            ========================== */}

            <div className="profile-section">

                <h2>
                    Skills
                </h2>


                {developer.skills?.length > 0 ? (

                    <div className="item-list">

                        {developer.skills.map(
                            (skill) => (

                                <div
                                    className="profile-item"
                                    key={skill.id}
                                >

                                    <h3>
                                        {skill.name}
                                    </h3>


                                    <p>

                                        Relationship:{" "}

                                        {
                                            skill.relationship
                                        }

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <p>
                        No skills found.
                    </p>

                )}

            </div>


            {/* ==========================
                TECHNOLOGIES
            ========================== */}

            <div className="profile-section">

                <h2>
                    Technologies
                </h2>


                {developer.technologies?.length > 0 ? (

                    <div className="item-list">

                        {developer.technologies.map(
                            (technology) => (

                                <div
                                    className="profile-item"
                                    key={technology.id}
                                >

                                    <h3>
                                        {technology.name}
                                    </h3>


                                    <p>

                                        Relationship:{" "}

                                        {
                                            technology.relationship
                                        }

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <p>
                        No technologies found.
                    </p>

                )}

            </div>


            {/* ==========================
                PROJECTS
            ========================== */}

            <div className="profile-section">

                <h2>
                    Projects
                </h2>


                {developer.projects?.length > 0 ? (

                    <div className="item-list">

                        {developer.projects.map(
                            (project) => (

                                <div
                                    className="profile-item"
                                    key={project.id}
                                >

                                    <h3>
                                        {project.name}
                                    </h3>


                                    <p>

                                        Relationship:{" "}

                                        {
                                            project.relationship
                                        }

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <p>
                        No projects found.
                    </p>

                )}

            </div>


        </div>

    );

}


export default DeveloperProfile;
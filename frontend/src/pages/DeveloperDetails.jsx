import { useEffect, useState } from "react";
import {
    getDeveloper,
    getRecommendations
} from "../services/developerService";

function DeveloperDetails({ email, onBack }) {

    const [developer, setDeveloper] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const developerData =
                    await getDeveloper(email);

                const recommendationData =
                    await getRecommendations(email);

                setDeveloper(
                    developerData
                );

                setRecommendations(
                    recommendationData.results || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load developer details."
                );

            } finally {

                setLoading(false);

            }
        };

        loadData();

    }, [email]);


    if (loading) {

        return (
            <div className="dashboard-content">
                <p>Loading developer...</p>
            </div>
        );

    }


    if (error) {

        return (
            <div className="dashboard-content">

                <button onClick={onBack}>
                    Back
                </button>

                <p className="error">
                    {error}
                </p>

            </div>
        );

    }


    return (
        <div className="dashboard-content">

            <button onClick={onBack}>
                ← Back
            </button>


            {developer && (

                <section>

                    <h1>
                        {developer.name}
                    </h1>

                    <p>
                        {developer.email}
                    </p>

                    <p>
                        Experience:
                        {" "}
                        {developer.experience}
                        {" "}
                        years
                    </p>


                    <hr />


                    <h2>
                        Recommended Projects
                    </h2>


                    {recommendations.length === 0 ? (

                        <p>
                            No recommended projects found.
                        </p>

                    ) : (

                        <div className="developer-grid">

                            {recommendations.map(
                                (project, index) => (

                                    <div
                                        className="developer-card"
                                        key={index}
                                    >

                                        <h3>
                                            {project.project}
                                        </h3>

                                        <p>
                                            {project.description}
                                        </p>

                                        <p>
                                            Difficulty:
                                            {" "}
                                            {project.difficulty}
                                        </p>

                                        <p>
                                            Match Score:
                                            {" "}
                                            {project.match_score}
                                        </p>


                                        <h4>
                                            Matched Skills
                                        </h4>

                                        <p>
                                            {project.matched_skills?.join(
                                                ", "
                                            )}
                                        </p>


                                        <h4>
                                            Technologies
                                        </h4>

                                        <p>
                                            {project.matched_technologies?.join(
                                                ", "
                                            )}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            )}

        </div>
    );
}

export default DeveloperDetails;
import { useEffect, useState } from "react";
import { getSkills } from "../services/skillService";

function Skills() {

    const [skills, setSkills] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadSkills = async (searchValue = "") => {

        try {

            setLoading(true);
            setError("");

            const data = await getSkills(searchValue);

            setSkills(data.results || []);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load skills."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadSkills();

    }, []);


    const handleSearch = (event) => {

        setSearch(event.target.value);

    };


    const handleSubmit = (event) => {

        event.preventDefault();

        loadSkills(search);

    };


    return (

        <div className="skills-page">

            <h1>Skills</h1>

            <p>
                Explore developer skills in the DevGraph knowledge graph.
            </p>


            <form
                className="skill-search"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Search skills..."
                    value={search}
                    onChange={handleSearch}
                />

                <button type="submit">
                    Search
                </button>

            </form>


            {loading && (
                <p>Loading skills...</p>
            )}


            {error && (
                <p className="error">
                    {error}
                </p>
            )}


            {!loading &&
                !error &&
                skills.length === 0 && (

                    <p>
                        No skills found.
                    </p>

                )}


            {!loading && !error && (

                <div className="skill-grid">

                    {skills.map((skill, index) => (

                        <div
                            className="skill-card"
                            key={index}
                        >

                            <h3>
                                {skill.name}
                            </h3>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default Skills;
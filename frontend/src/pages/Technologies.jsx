import { useEffect, useState } from "react";
import {
    getTechnologies
} from "../services/technologyService";

function Technologies() {

    const [technologies, setTechnologies] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadTechnologies = async (
        searchValue = ""
    ) => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTechnologies(
                    searchValue
                );

            setTechnologies(
                data.results || []
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load technologies."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadTechnologies();

    }, []);


    const handleSearch = (event) => {

        setSearch(
            event.target.value
        );

    };


    const handleSubmit = (event) => {

        event.preventDefault();

        loadTechnologies(search);

    };


    return (

        <div className="technologies-page">

            <h1>Technologies</h1>

            <p>
                Explore technologies used across
                developers and projects.
            </p>


            <form
                className="technology-search"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Search technologies..."
                    value={search}
                    onChange={handleSearch}
                />

                <button type="submit">
                    Search
                </button>

            </form>


            {loading && (
                <p>
                    Loading technologies...
                </p>
            )}


            {error && (
                <p className="error">
                    {error}
                </p>
            )}


            {!loading &&
                !error &&
                technologies.length === 0 && (

                    <p>
                        No technologies found.
                    </p>

                )}


            {!loading && !error && (

                <div className="technology-grid">

                    {technologies.map(
                        (technology, index) => (

                            <div
                                className="technology-card"
                                key={index}
                            >

                                <h3>
                                    {technology.name}
                                </h3>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );
}

export default Technologies;
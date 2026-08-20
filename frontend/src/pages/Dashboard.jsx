import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Dashboard() {

    const navigate = useNavigate();


    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // ==============================
    // LOAD GRAPH DATA
    // ==============================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await api.get("/graph/");


                setGraphData({

                    nodes:
                        response.data.nodes || [],

                    links:
                        response.data.links || [],

                });


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );


                setError(
                    "Unable to load dashboard data."
                );


            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="dashboard-page">

                <h1>
                    DevGraph Dashboard
                </h1>

                <p>
                    Loading dashboard...
                </p>

            </div>

        );

    }


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        return (

            <div className="dashboard-page">

                <h1>
                    DevGraph Dashboard
                </h1>

                <p className="error">
                    {error}
                </p>

            </div>

        );

    }


    // ==============================
    // COUNT NODES
    // ==============================

    const developers =
        graphData.nodes.filter(
            (node) =>
                node.group
                    ?.toLowerCase()
                    .includes("developer")
        );


    const skills =
        graphData.nodes.filter(
            (node) =>
                node.group
                    ?.toLowerCase()
                    .includes("skill")
        );


    const technologies =
        graphData.nodes.filter(
            (node) =>
                node.group
                    ?.toLowerCase()
                    .includes("technology")
        );


    const projects =
        graphData.nodes.filter(
            (node) =>
                node.group
                    ?.toLowerCase()
                    .includes("project")
        );


    // ==============================
    // DASHBOARD
    // ==============================

    return (

        <div className="dashboard-page">


            {/* ==========================
                HEADER
            ========================== */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        DevGraph Dashboard
                    </h1>

                    <p>
                        Overview of developers,
                        skills, technologies
                        and projects.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/graph")
                    }
                >
                    Open Graph
                </button>

            </div>


            {/* ==========================
                STATISTICS
            ========================== */}

            <div className="dashboard-stats">


                {/* DEVELOPERS */}

                <div className="dashboard-card">

                    <h2>
                        {developers.length}
                    </h2>

                    <p>
                        Developers
                    </p>

                </div>


                {/* SKILLS */}

                <div className="dashboard-card">

                    <h2>
                        {skills.length}
                    </h2>

                    <p>
                        Skills
                    </p>

                </div>


                {/* TECHNOLOGIES */}

                <div className="dashboard-card">

                    <h2>
                        {technologies.length}
                    </h2>

                    <p>
                        Technologies
                    </p>

                </div>


                {/* PROJECTS */}

                <div className="dashboard-card">

                    <h2>
                        {projects.length}
                    </h2>

                    <p>
                        Projects
                    </p>

                </div>


            </div>


            {/* ==========================
                GRAPH SUMMARY
            ========================== */}

            <div className="dashboard-section">

                <h2>
                    Graph Summary
                </h2>


                <div className="summary-row">

                    <div>

                        <strong>
                            Total Nodes
                        </strong>

                        <span>
                            {graphData.nodes.length}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Total Relationships
                        </strong>

                        <span>
                            {graphData.links.length}
                        </span>

                    </div>

                </div>

            </div>


            {/* ==========================
                NODE DISTRIBUTION
            ========================== */}

            <div className="dashboard-section">

                <h2>
                    Node Distribution
                </h2>


                <div className="distribution-list">


                    <div className="distribution-item">

                        <span>
                            Developers
                        </span>

                        <strong>
                            {developers.length}
                        </strong>

                    </div>


                    <div className="distribution-item">

                        <span>
                            Skills
                        </span>

                        <strong>
                            {skills.length}
                        </strong>

                    </div>


                    <div className="distribution-item">

                        <span>
                            Technologies
                        </span>

                        <strong>
                            {technologies.length}
                        </strong>

                    </div>


                    <div className="distribution-item">

                        <span>
                            Projects
                        </span>

                        <strong>
                            {projects.length}
                        </strong>

                    </div>


                </div>

            </div>


        </div>

    );

}


export default Dashboard;
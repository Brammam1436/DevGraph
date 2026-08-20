import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import api from "../services/api";


function Graph() {

    const navigate = useNavigate();


    // ==============================
    // STATE
    // ==============================

    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });


    const [selectedNode, setSelectedNode] =
        useState(null);


    const [developers, setDevelopers] =
        useState([]);


    const [selectedDeveloper, setSelectedDeveloper] =
        useState("");


    const [developerLoading, setDeveloperLoading] =
        useState(false);


    const [searchText, setSearchText] =
        useState("");


    const [filterType, setFilterType] =
        useState("All");


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // ==============================
    // GET NODE TYPE
    // ==============================

    const getNodeType = (node) => {

        return (
            node?.group ||
            node?.type ||
            node?.category ||
            ""
        );

    };


    // ==============================
    // GET NODE LABEL
    // ==============================

    const getNodeLabel = (node) => {

        return (
            node?.label ||
            node?.name ||
            node?.username ||
            String(node?.id || "")
        );

    };


    // ==============================
    // GET NODE COUNT
    // ==============================

    const getNodeCount = (type) => {

        return graphData.nodes.filter(
            (node) => {

                const nodeType =
                    String(
                        getNodeType(node)
                    ).toLowerCase();

                return nodeType.includes(
                    type.toLowerCase()
                );

            }
        ).length;

    };


    // ==============================
    // LOAD GRAPH + DEVELOPERS
    // ==============================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                setError("");


                // ==========================
                // LOAD COMPLETE GRAPH
                // ==========================

                const graphResponse =
                    await api.get("/graph/");


                setGraphData({

                    nodes:
                        graphResponse.data.nodes ||
                        [],

                    links:
                        graphResponse.data.links ||
                        [],

                });


                // ==========================
                // LOAD DEVELOPERS
                // ==========================

                const developerResponse =
                    await api.get("/developers/");


                setDevelopers(

                    developerResponse.data.results ||
                    developerResponse.data ||
                    []

                );


            } catch (error) {

                console.error(
                    "Error loading graph:",
                    error
                );


                setError(
                    "Unable to load graph data."
                );


            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // ==============================
    // NODE CLICK
    // ==============================

    const handleNodeClick = (node) => {

        setSelectedNode(node);

    };


    // ==============================
    // CLOSE NODE DETAILS
    // ==============================

    const closeDetails = () => {

        setSelectedNode(null);

    };


    // ==============================
    // FILTER GRAPH
    // ==============================

    const getFilteredGraph = () => {

        // No search and no type filter
        if (
            !searchText.trim() &&
            filterType === "All"
        ) {

            return graphData;

        }


        const search =
            searchText
                .toLowerCase()
                .trim();


        // ==========================
        // FIND MATCHING NODES
        // ==========================

        const matchingNodes =
            graphData.nodes.filter(
                (node) => {

                    const nodeLabel =
                        getNodeLabel(node)
                            .toLowerCase();


                    const nodeType =
                        String(
                            getNodeType(node)
                        ).toLowerCase();


                    const matchesText =
                        !search ||
                        nodeLabel.includes(search);


                    const matchesType =
                        filterType === "All" ||
                        nodeType.includes(
                            filterType.toLowerCase()
                        );


                    return (
                        matchesText &&
                        matchesType
                    );

                }
            );


        // ==========================
        // MATCHING NODE IDS
        // ==========================

        const matchingIds =
            new Set(
                matchingNodes.map(
                    (node) =>
                        String(node.id)
                )
            );


        // ==========================
        // FIND CONNECTED LINKS
        // ==========================

        const filteredLinks =
            graphData.links.filter(
                (link) => {

                    const sourceId =
                        String(
                            typeof link.source === "object"
                                ? link.source?.id
                                : link.source
                        );


                    const targetId =
                        String(
                            typeof link.target === "object"
                                ? link.target?.id
                                : link.target
                        );


                    return (
                        matchingIds.has(
                            sourceId
                        ) ||
                        matchingIds.has(
                            targetId
                        )
                    );

                }
            );


        // ==========================
        // CONNECTED NODE IDS
        // ==========================

        const connectedIds =
            new Set(matchingIds);


        filteredLinks.forEach(
            (link) => {

                const sourceId =
                    String(
                        typeof link.source === "object"
                            ? link.source?.id
                            : link.source
                    );


                const targetId =
                    String(
                        typeof link.target === "object"
                            ? link.target?.id
                            : link.target
                    );


                connectedIds.add(
                    sourceId
                );


                connectedIds.add(
                    targetId
                );

            }
        );


        // ==========================
        // FINAL NODES
        // ==========================

        const filteredNodes =
            graphData.nodes.filter(
                (node) =>
                    connectedIds.has(
                        String(node.id)
                    )
            );


        return {

            nodes: filteredNodes,

            links: filteredLinks,

        };

    };


    // ==============================
    // DEVELOPER FILTER
    // ==============================

    const handleDeveloperChange =
        async (event) => {

            const developerId =
                event.target.value;


            setSelectedDeveloper(
                developerId
            );


            // ==========================
            // ALL DEVELOPERS
            // ==========================

            if (!developerId) {

                try {

                    setDeveloperLoading(true);


                    const response =
                        await api.get(
                            "/graph/"
                        );


                    setGraphData({

                        nodes:
                            response.data.nodes ||
                            [],

                        links:
                            response.data.links ||
                            [],

                    });


                    setSelectedNode(null);


                } catch (error) {

                    console.error(
                        "Developer reset error:",
                        error
                    );


                } finally {

                    setDeveloperLoading(false);

                }


                return;

            }


            // ==========================
            // SELECTED DEVELOPER
            // ==========================

            try {

                setDeveloperLoading(true);

                setError("");


                const response =
                    await api.get(
                        `/developers/${developerId}/graph/`
                    );


                setGraphData({

                    nodes:
                        response.data.nodes ||
                        [],

                    links:
                        response.data.links ||
                        [],

                });


                setSelectedNode(null);


            } catch (error) {

                console.error(
                    "Developer graph error:",
                    error
                );


                setError(
                    "Unable to load developer graph."
                );


            } finally {

                setDeveloperLoading(false);

            }

        };


    // ==============================
    // RESET GRAPH
    // ==============================

    const resetGraph = async () => {

        try {

            setDeveloperLoading(true);

            setSearchText("");

            setFilterType("All");

            setSelectedDeveloper("");

            setSelectedNode(null);

            setError("");


            const response =
                await api.get(
                    "/graph/"
                );


            setGraphData({

                nodes:
                    response.data.nodes ||
                    [],

                links:
                    response.data.links ||
                    [],

            });


        } catch (error) {

            console.error(
                "Reset graph error:",
                error
            );


            setError(
                "Unable to reset graph."
            );


        } finally {

            setDeveloperLoading(false);

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="graph-page">

                <h1>
                    DevGraph Visualization
                </h1>

                <p>
                    Loading graph...
                </p>

            </div>

        );

    }


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        return (

            <div className="graph-page">

                <h1>
                    DevGraph Visualization
                </h1>

                <p className="error">
                    {error}
                </p>

                <button
                    onClick={resetGraph}
                >
                    Try Again
                </button>

            </div>

        );

    }


    // ==============================
    // MAIN UI
    // ==============================

    return (

        <div className="graph-page">


            {/* ==========================
                HEADER
            ========================== */}

            <div className="graph-header">

                <div>

                    <h1>
                        DevGraph Visualization
                    </h1>

                    <p>
                        Explore relationships between
                        developers, skills, technologies
                        and projects.
                    </p>

                </div>


                <button
                    className="dashboard-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>


            {/* ==========================
                LEGEND
            ========================== */}

            <div className="graph-legend">

                <span>
                    ● Developer
                </span>

                <span>
                    ● Skill
                </span>

                <span>
                    ● Technology
                </span>

                <span>
                    ● Project
                </span>

            </div>


            {/* ==========================
                DEVELOPER FILTER
            ========================== */}

            <div className="developer-filter">

                <label>
                    Select Developer:
                </label>


                <select
                    value={selectedDeveloper}
                    onChange={
                        handleDeveloperChange
                    }
                >

                    <option value="">
                        All Developers
                    </option>


                    {developers.map(
                        (developer) => (

                            <option
                                key={developer.id}
                                value={developer.id}
                            >

                                {
                                    developer.name ||
                                    developer.username ||
                                    developer.label ||
                                    developer.id
                                }

                            </option>

                        )
                    )}

                </select>


                {developerLoading && (

                    <span>
                        Loading...
                    </span>

                )}


                <button
                    onClick={resetGraph}
                >
                    Reset Graph
                </button>

            </div>


            {/* ==========================
                SEARCH + TYPE FILTER
            ========================== */}

            <div className="graph-filter">


                {/* SEARCH */}

                <div className="search-box">

                    <label>
                        Search Graph
                    </label>


                    <input
                        type="text"
                        placeholder="Search developer, skill, technology or project..."
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* TYPE */}

                <div className="filter-box">

                    <label>
                        Type
                    </label>


                    <select
                        value={filterType}
                        onChange={(event) =>
                            setFilterType(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All
                        </option>

                        <option value="Developer">
                            Developer
                        </option>

                        <option value="Skill">
                            Skill
                        </option>

                        <option value="Technology">
                            Technology
                        </option>

                        <option value="Project">
                            Project
                        </option>

                    </select>

                </div>


                {/* CLEAR */}

                <button
                    className="clear-filter"
                    onClick={() => {

                        setSearchText("");

                        setFilterType("All");

                    }}
                >
                    Clear
                </button>

            </div>


            {/* =========================================
                GRAPH STATISTICS
            ========================================= */}

            <div className="graph-statistics">


                {/* TOTAL NODES */}

                <div className="stat-box">

                    <h3>
                        {graphData.nodes.length}
                    </h3>

                    <p>
                        Total Nodes
                    </p>

                </div>


                {/* TOTAL RELATIONSHIPS */}

                <div className="stat-box">

                    <h3>
                        {graphData.links.length}
                    </h3>

                    <p>
                        Relationships
                    </p>

                </div>


                {/* DEVELOPERS */}

                <div className="stat-box">

                    <h3>
                        {getNodeCount("Developer")}
                    </h3>

                    <p>
                        Developers
                    </p>

                </div>


                {/* SKILLS */}

                <div className="stat-box">

                    <h3>
                        {getNodeCount("Skill")}
                    </h3>

                    <p>
                        Skills
                    </p>

                </div>


                {/* TECHNOLOGIES */}

                <div className="stat-box">

                    <h3>
                        {getNodeCount("Technology")}
                    </h3>

                    <p>
                        Technologies
                    </p>

                </div>


                {/* PROJECTS */}

                <div className="stat-box">

                    <h3>
                        {getNodeCount("Project")}
                    </h3>

                    <p>
                        Projects
                    </p>

                </div>


            </div>


            {/* =========================================
                RELATIONSHIP INFORMATION
            ========================================= */}

            <div className="relationship-info">

                <h2>
                    Graph Relationships
                </h2>


                {graphData.links.length === 0 ? (

                    <p>
                        No relationships found.
                    </p>

                ) : (

                    <div className="relationship-list">

                        {graphData.links
                            .slice(0, 10)
                            .map(
                                (link, index) => {

                                    // ==========================
                                    // SOURCE
                                    // ==========================

                                    const source =
                                        typeof link.source === "object"
                                            ? link.source
                                            : graphData.nodes.find(
                                                (node) =>
                                                    String(node.id) ===
                                                    String(link.source)
                                            );


                                    // ==========================
                                    // TARGET
                                    // ==========================

                                    const target =
                                        typeof link.target === "object"
                                            ? link.target
                                            : graphData.nodes.find(
                                                (node) =>
                                                    String(node.id) ===
                                                    String(link.target)
                                            );


                                    return (

                                        <div
                                            className="relationship-item"
                                            key={index}
                                        >

                                            <span>

                                                {
                                                    getNodeLabel(
                                                        source
                                                    )
                                                }

                                            </span>


                                            <strong>

                                                →

                                                {" "}

                                                {
                                                    link.label ||
                                                    link.type ||
                                                    "RELATED_TO"
                                                }

                                                {" "}

                                                →

                                            </strong>


                                            <span>

                                                {
                                                    getNodeLabel(
                                                        target
                                                    )
                                                }

                                            </span>

                                        </div>

                                    );

                                }
                            )}

                    </div>

                )}

            </div>


            {/* ==========================
                GRAPH + DETAILS
            ========================== */}

            <div className="graph-layout">


                {/* ==========================
                    GRAPH
                ========================== */}

                <div className="graph-container">

                    <ForceGraph2D

                        graphData={
                            getFilteredGraph()
                        }


                        nodeLabel={(node) =>
                            `${getNodeType(node)}: ${getNodeLabel(node)}`
                        }


                        linkLabel={(link) =>
                            link.label ||
                            link.type ||
                            "RELATED_TO"
                        }


                        nodeAutoColorBy="group"


                        linkDirectionalArrowLength={
                            5
                        }


                        linkDirectionalArrowRelPos={
                            1
                        }


                        linkCurvature={
                            0.1
                        }


                        onNodeClick={
                            handleNodeClick
                        }


                        width={
                            850
                        }


                        height={
                            650
                        }

                    />

                </div>


                {/* ==========================
                    NODE DETAILS
                ========================== */}

                <div className="graph-info">

                    <h2>
                        Node Details
                    </h2>


                    {!selectedNode && (

                        <p>
                            Click a node to view
                            its details.
                        </p>

                    )}


                    {selectedNode && (

                        <div>

                            <h3>
                                {
                                    getNodeLabel(
                                        selectedNode
                                    )
                                }
                            </h3>


                            <p>

                                <strong>
                                    Type:
                                </strong>

                                {" "}

                                {
                                    getNodeType(
                                        selectedNode
                                    ) ||
                                    "Unknown"
                                }

                            </p>


                            <p>

                                <strong>
                                    ID:
                                </strong>

                                {" "}

                                {
                                    selectedNode.id
                                }

                            </p>


                            <button
                                onClick={
                                    closeDetails
                                }
                            >
                                Close
                            </button>


                            {/* ==========================
                                DEVELOPER PROFILE
                            ========================== */}

                            {getNodeType(
                                selectedNode
                            )
                                .toLowerCase()
                                .includes(
                                    "developer"
                                ) && (

                                <button
                                    onClick={() => {

                                        navigate(
                                            `/developers/${selectedNode.id}`
                                        );

                                    }}
                                >
                                    View Profile
                                </button>

                            )}

                        </div>

                    )}

                </div>


            </div>


        </div>

    );

}


export default Graph;
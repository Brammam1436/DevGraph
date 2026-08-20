import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Graph from "./pages/Graph";

import DeveloperProfile
    from "./pages/DeveloperProfile";

import Dashboard
    from "./pages/Dashboard";

import Navbar
    from "./components/Navbar";


function App() {

    return (

        <BrowserRouter>

            {/* ==========================
                NAVIGATION
            ========================== */}

            <Navbar />


            {/* ==========================
                ROUTES
            ========================== */}

            <Routes>


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={
                        <Dashboard />
                    }
                />


                {/* Graph */}

                <Route
                    path="/graph"
                    element={
                        <Graph />
                    }
                />


                {/* Developer Profile */}

                <Route
                    path="/developers/:developerId"
                    element={
                        <DeveloperProfile />
                    }
                />


                {/* Home */}

                <Route
                    path="/"
                    element={
                        <Dashboard />
                    }
                />


                {/* Unknown URL */}

                <Route
                    path="*"
                    element={
                        <Dashboard />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;
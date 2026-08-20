import { NavLink } from "react-router-dom";


function Navbar() {

    return (

        <nav className="navbar">

            {/* Logo */}

            <div className="navbar-logo">

                <NavLink to="/dashboard">
                    DevGraph
                </NavLink>

            </div>


            {/* Navigation Links */}

            <div className="navbar-links">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Dashboard
                </NavLink>


                <NavLink
                    to="/graph"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Graph
                </NavLink>

            </div>

        </nav>

    );

}


export default Navbar;
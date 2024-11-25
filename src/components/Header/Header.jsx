import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import "./Header.css";
function Header() {
  const { user, session, signOut } = useAuth();
  return (
    <>
      <h1 className="restaurant-title">Black Beards Grill</h1>
      <nav className="nav-bar">
        <h2 className="nav-item">Place holder company name</h2>

        <NavLink className="nav-item" to="/my-restaurants">
          My Restaurants
        </NavLink>
        <NavLink className="nav-item" to="/tables">
          Tables
        </NavLink>
        <NavLink className="heading-button" to="/profile">
          Manage Profile
        </NavLink>
        <NavLink className="nav-item" to="/test2">
          Go Live
        </NavLink>
        {session ? (
          <>
            <p>Welcome, {user?.email}!</p>
            <button onClick={signOut} className="nav-item">
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/sign-in" className="nav-item">
            Sign In
          </NavLink>
        )}
      </nav>
    </>
  );
}

export default Header;

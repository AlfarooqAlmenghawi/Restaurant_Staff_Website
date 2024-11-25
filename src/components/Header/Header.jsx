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

        <NavLink className="@apply custButton" to="/my-restaurants">
          My Restaurants
        </NavLink>
        <NavLink className="@apply custButton" to="/tables">
          Tables
        </NavLink>
        <NavLink className="@apply custButton" to="/restaurant-new">
          Create New Restaurant
        </NavLink>
        <NavLink className="@apply custButton" to="/go-live">
          Go Live
        </NavLink>
        {session ? (
          <>
            <p>Welcome, {user?.email}!</p>
            <button onClick={signOut} className="@apply custButton">
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/sign-in" className="@apply custButton">
            Sign In
          </NavLink>
        )}
      </nav>
    </>
  );
}

export default Header;

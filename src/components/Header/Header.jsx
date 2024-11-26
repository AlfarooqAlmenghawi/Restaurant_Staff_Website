import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import "./Header.css";
import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";

function Header() {
  const { user, session, signOut } = useAuth();
  const RestaurantID = Number(session?.restaurant_id);
  const [currentRestaurantID, setCurrentRestaurantID] = useState(null);

  const [currentRestaurant, setCurrentRestaurant] = useState("");

  useEffect(() => {
    setCurrentRestaurantID(Number(session?.restaurant_id));
    supabase
      .from("restaurants")
      .select("*, restaurant_cuisines(*)")
      .eq("restaurant_id", RestaurantID)
      .then(({ data, error }) => {
        console.log(data || error);
        setCurrentRestaurant(data[0].restaurant_name);
      });
  }, []);

  return (
    <>
      {currentRestaurant ? (
        <h1 className="restaurant-title">{currentRestaurant}</h1>
      ) : (
        <h1 className="restaurant-title">No Restaurant Selected</h1>
      )}

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

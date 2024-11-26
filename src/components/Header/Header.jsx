import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import "./Header.css";
import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import Logo from "../../svgs/logo.svg?react";

function Header() {
  const { user, session, signOut } = useAuth();
  useEffect(() => {
    session?.restaurant_id &&
      supabase
        .from("restaurants")
        .select("*, restaurant_cuisines(*)")
        .eq("restaurant_id", session?.restaurant_id)
        .then(({ data, error }) => {
          console.log(data || error);
          setCurrentRestaurant(data[0].restaurant_name);
        });
  }, []);

  return (
    <>
      <Logo />
      {session?.restaurant_id && (
        <h1 className="restaurant-title">{currentRestaurant}</h1>
      )}

      <nav className="flex">
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

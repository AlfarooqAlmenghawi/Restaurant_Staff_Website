import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import "./Header.css";
import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import Logo from "../../svgs/logo.svg?react";

function Header() {
  const { user, session, signOut } = useAuth();
  const [currentRestaurant, setCurrentRestaurant] = useState("");
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
  }, [session]);

  return (
    <div className="border-b-4 border-secondary">
      <div className="flex items-end px-[20vw] sm:max-xl:w-[768px] sm:max-xl:px-0 sm:max-xl:mx-auto">
        <Logo className="mt-4 w-20 aspect-auto" />
        <div className="flex flex-col ml-auto items-end">
          {session?.restaurant_id && (
            <h1 className="inline">Selected Restaurant: {currentRestaurant}</h1>
          )}
          <nav className="flex justify-end">
            <NavLink className="navLink" to="/my-restaurants">
              My Restaurants
            </NavLink>
            <NavLink className="navLink" to="/tables">
              Tables
            </NavLink>
            <NavLink className="navLink" to="/restaurant-new">
              Create New Restaurant
            </NavLink>

            <NavLink className="navLink" to="/settings">
              Restaurant Settings
            </NavLink>
            {session?.user ? (
              <>
                <button onClick={signOut} className="navLink">
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink to="/sign-in" className="navLink">
                Sign In
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;

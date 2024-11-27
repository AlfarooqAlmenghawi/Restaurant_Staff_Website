import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { RestaurantCard } from "./RestaurantCard";
import { toast } from "react-toastify";
import BarLoader from "react-spinners/BarLoader";

function MyRestaurants() {
  const navigate = useNavigate();

  const [restaurantsOfStaff, setRestaurantsOfStaff] = useState([]);
  const hasRedirected = useLocation().state?.hasRedirected;
  const {
    user,
    session: { restaurant_id },
  } = useAuth();

  function newRestaurantHandler() {
    console.log("click");
    navigate("/restaurant-new");
  }

  useEffect(() => {
    hasRedirected &&
      toast.error("Sorry, you need to select a restaurant first");
    supabase
      .from("staff_restaurant")
      .select("restaurant_id, restaurants(*)")
      .eq("user_id", user?.id)
      .then(({ data }) => {
        setRestaurantsOfStaff(data);
      });
  }, []);

  return (
    <>
      <h3 className="pageTitle">Your Restaurants</h3>
      {restaurantsOfStaff.length ? (
        <div className="flex bg flex-wrap gap-4 mt-6">
          {restaurantsOfStaff?.map(({ restaurants }) => (
            <RestaurantCard
              key={restaurants.restaurant_id}
              {...restaurants}
              isSelected={restaurant_id === restaurants.restaurant_id}
            />
          ))}
          <button
            className="border-4 transition-colors hover:border-tertiary flex p-2 size-[10.5rem] bg-quinary justify-center items-center rounded-lg"
            onClick={newRestaurantHandler}
          >
            <FaPlus className="size-20" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-20">
          <BarLoader />
        </div>
      )}
    </>
  );
}

export default MyRestaurants;

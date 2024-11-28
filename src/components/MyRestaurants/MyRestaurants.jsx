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
  const [loading, setLoading] = useState(true);
  const hasRedirected = useLocation().state?.hasRedirected;
  const {
    user,
    session: { restaurant_id },
  } = useAuth();

  function newRestaurantHandler() {
    navigate("/restaurant-new");
  }

  useEffect(() => {
    setLoading(true);
    hasRedirected &&
      toast.error("Sorry, you need to select a restaurant first");
    supabase
      .from("staff_restaurant")
      .select("restaurant_id, restaurants(*)")
      .eq("user_id", user?.id)
      .then(({ data }) => {
        setRestaurantsOfStaff(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h3 className="pageTitle">Your Restaurants</h3>
      {!loading ? (
        <div className="flex bg flex-wrap gap-4 mt-6">
          {restaurantsOfStaff?.map(({ restaurants }) => (
            <RestaurantCard
              key={restaurants.restaurant_id}
              {...restaurants}
              isSelected={restaurant_id === restaurants.restaurant_id}
            />
          ))}
          <button
            className="boxStyle flex flex-col transition-all h-[19.75rem] w-44 justify-center items-center hover:shadow-2xl hover:scale-105"
            onClick={newRestaurantHandler}
          >
            <FaPlus className="size-20 mb-12" />
            <p className="w-20">Add new restaurant</p>
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

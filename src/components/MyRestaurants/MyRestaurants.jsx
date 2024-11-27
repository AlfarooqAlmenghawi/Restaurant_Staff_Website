import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { RestaurantCard } from "./RestaurantCard";

function MyRestaurants() {
  const [restaurantsOfStaff, setRestaurantsOfStaff] = useState([]);
  const {
    user,
    session: { restaurant_id },
  } = useAuth();

  function newRestaurantHandler() {
    navigate("/restaurant-new");
  }

  useEffect(() => {
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
      <h3 className="font-bold text-2xl border-y-4 px-4">Your Restaurants</h3>
      <div className="flex bg flex-wrap gap-4 mt-6">
        {restaurantsOfStaff?.map(({ restaurants }) => (
          <RestaurantCard
            {...restaurants}
            isSelected={restaurant_id === restaurants.restaurant_id}
          />
        ))}
        <button
          className="border-4 hover:border-tertiary flex p-2 size-[10.5rem] bg-quinary justify-center items-center rounded-lg"
          onClick={newRestaurantHandler}
        >
          <FaPlus className="size-20" />
        </button>
      </div>
    </>
  );
}

export default MyRestaurants;

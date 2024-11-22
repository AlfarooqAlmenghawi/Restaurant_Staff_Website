import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { Link, useNavigate } from "react-router-dom";

function MyRestaurants() {
  const [restaurantsOfStaff, setRestaurantsOfStaff] = useState([]);
  const { user, updateRestaurant } = useAuth();
  const navigate = useNavigate();

  function handleClick(event) {
    updateRestaurant(event.target.id);
    navigate("/profile");
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
      <h1>Your Restaurants:</h1>
      <div className="restaurants-of-staff">
        {restaurantsOfStaff.map((restaurant) => {
          console.log(restaurant.restaurants.restaurant_name);
          return (
            <>
              <p>{restaurant.restaurants.restaurant_name}</p>
              <button
                id={restaurant.restaurants.restaurant_id}
                onClick={handleClick}
              >
                Go to {restaurant.restaurants.restaurant_name}
              </button>
            </>
          );
        })}
      </div>
    </>
  );
}

export default MyRestaurants;

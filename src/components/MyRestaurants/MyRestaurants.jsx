import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { NavLink } from "react-router-dom";

function MyRestaurants() {
  const [restaurantsOfStaff, setRestaurantsOfStaff] = useState([]);
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    supabase
      .from("staff_restaurant")
      .select("restaurant_id, restaurants(*)")
      .eq("user_id", user?.id)
      .then(({ data }) => {
        console.log(data);
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
              <NavLink>go to restaurant</NavLink>
            </>
          );
        })}
      </div>
    </>
  );
}

export default MyRestaurants;

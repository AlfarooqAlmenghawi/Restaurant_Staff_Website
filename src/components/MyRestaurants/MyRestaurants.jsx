import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";


function MyRestaurants() {
  const [restaurantsOfStaff, setRestaurantsOfStaff] = useState([]);
  const {
    user,
    updateRestaurant,
    session: { restaurant_id },
  } = useAuth();
  const navigate = useNavigate();

  function handleSelectRestaurant(event) {
    updateRestaurant(event.target.id);
    navigate("/tables");
  }

  function handleEdit(event) {
    updateRestaurant(event.target.id);
    navigate("/profile");
  }

  function newRestaurantHandler(event) {
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
      <div className="flex bg">
        {restaurantsOfStaff?.map((restaurant) => {
          return (
            <div
              className={
                Number(restaurant_id) ===
                Number(restaurant.restaurants.restaurant_id)
                  ? "border-4 border-quaternary hover:border-tertiary flex m-4 p-2 w-80px/4 bg-quinary rounded-lg"
                  : "border-4 hover:border-tertiary flex m-4 p-2 w-1/4 bg-quinary rounded-lg"
              }
            >
              <img
                className="size-32"
                src={restaurant.restaurants.restaurant_img}
              />
              <div className="p-2 flex flex-col">
                <h4 className="font-semibold">
                  {restaurant.restaurants.restaurant_name}
                </h4>
                <button
                  className="@apply custButton mr-2"
                  id={restaurant.restaurants.restaurant_id}
                  onClick={handleSelectRestaurant}
                >
                  See Tables
                </button>
                <button
                  className="@apply custButton"
                  onClick={handleEdit}
                  id={restaurant.restaurants.restaurant_id}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          );
        })}
        <button className="border-4 hover:border-tertiary flex m-4 p-2 w-1/4 bg-quinary justify-center items-center rounded-lg" onClick={newRestaurantHandler}>
        <FaPlus className="size-20" /></button>
      </div>
    </>
  );
}

export default MyRestaurants;

import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { useNavigate } from "react-router-dom";

function GoLive() {
  const { user, session } = useAuth();
  const RestaurantID = session.restaurant_id;

  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const goLive = () => {
    supabase
      .from("restaurants")
      .update({ is_listed: true })
      .eq("restaurant_id", RestaurantID)
      .then(({ data, error }) => {});
  };

  useEffect(() => {
    supabase
      .from("restaurants")
      .select()
      .eq("restaurant_id", RestaurantID)
      .then(({ data, error }) => {
        setCurrentRestaurant(data[0]);
        console.log(data[0]);
      });
  }, []);

  return (
    <>
      {currentRestaurant ? (
        <>
          <p>{currentRestaurant.restaurant_name}</p>
          <button onClick={goLive}>Go Live</button>
        </>
      ) : (
        <p>NO RESTAURANT</p>
      )}
    </>
  );
}

export default GoLive;

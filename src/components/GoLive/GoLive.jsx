import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import BarLoader from "react-spinners/BarLoader";
import { FaInfoCircle } from "react-icons/fa";


function GoLive() {
  const { user, session } = useAuth();
  const RestaurantID = session.restaurant_id;

  const [loading, setLoading] = useState(true);

  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const goLive = () => {
    setLoading(true);
    supabase
      .from("restaurants")
      .update({ is_listed: !currentRestaurant.is_listed })
      .eq("restaurant_id", RestaurantID)
      .select()
      .then(({ data, error }) => {
        data && setCurrentRestaurant(data[0]);
        error && console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    supabase
      .from("restaurants")
      .select()
      .eq("restaurant_id", RestaurantID)
      .then(({ data, error }) => {
        data && setCurrentRestaurant(data[0]);
        error && console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h3 className="pageTitle">Go Live</h3>
      <div className="flex flex-col mt-10 items-center boxStyle">
        {currentRestaurant ? (
          <>
            <h4 className="text-4xl mb-4 font-bold">
              {currentRestaurant.restaurant_name}
            </h4>
            <h5 className="text-2xl">
              Currently:{" "}
              <b
                className={`${
                  currentRestaurant.is_listed
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {currentRestaurant.is_listed ? "Live" : "Unlisted"}
              </b>
            </h5>
            {loading ? (
              <BarLoader width={200} className="my-[36px]" />
            ) : (
              <button
                className={
                  currentRestaurant.is_listed
                    ? "w-1/2 text-6xl bg-green-600 hover:bg-red-600 py-2"
                    : "w-1/2 text-6xl bg-red-600 hover:bg-green-600 py-2"
                }
                onClick={goLive}
              >
                {currentRestaurant.is_listed ? "Unlist" : "Go Live"}
              </button>
            )}

            <div className={`w-full flex items-stretch p-2 mt-8 `}>
              <div
                className={`w-14 box-border bg-blue-600 flex items-center justify-center `}
              >
                <FaInfoCircle className="text-white" />
              </div>
              <p
                className={`px-3 py-1 bg-blue-200`}
              >
                By clicking go live you allow app users to see your restaurant
              profile and book tables. Unlisting will prevent app users from
              seeing it and booking but will not affect bookings that have
              already been made.
              </p>
            </div>
          </>
        ) : (
          <BeatLoader />
        )}
      </div>
    </div>
  );
}



export default GoLive;

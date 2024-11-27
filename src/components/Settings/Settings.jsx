import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const RestaurantID = session.restaurant_id;

  const [deleteStatus, setDeleteStatus] = useState(false);

  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const [tablesOfTheCurrentRestaurant, setTablesOfTheCurrentRestaurant] =
    useState([]);

  const [currentRestaurantSettings, setCurrentRestaurantSettings] = useState(
    {}
  );

  const [showTheTableAdder, toggleShowingTheTableAdder] = useState(false);

  const [newTableInfo, setNewTableInfo] = useState({});

  const [old, setOld] = useState({ restaurant_cuisines: [] });

  const changeCurr = (e) => {
    const newCurrent = { ...currentRestaurantSettings };
    if (e.target.value) {
      newCurrent[e.target.id] = e.target.value;
    } else {
      newCurrent[e.target.id] = old[e.target.id];
    }
    setCurrentRestaurantSettings(newCurrent);
    console.log(newCurrent);
  };

  const updateRestaurantSettings = () => {
    const sendData = { ...currentRestaurantSettings };
    supabase
      .from("restaurants")
      .update([sendData])
      .eq("restaurant_id", RestaurantID)
      .select()
      .then((data) => {
        console.log(data);
      });
    supabase
      .from("tables")
      .insert({
        restaurant_id: RestaurantID,
        size: newTableInfo.size,
        table_name: newTableInfo.table_name,
      })
      .select()
      .then(({ data, error }) => {
        setTablesOfTheCurrentRestaurant([
          ...tablesOfTheCurrentRestaurant,
          data[0],
        ]);
      });
  };

  const showTableAdder = () => {
    toggleShowingTheTableAdder(!showTheTableAdder);
  };

  const handleNewTableChange = (e) => {
    const newCurrent = { ...newTableInfo };
    if (e.target.value) {
      newCurrent[e.target.id] = e.target.value;
    } else {
      delete newCurrent[e.target.id];
    }
    setNewTableInfo(newCurrent);
    console.log(newCurrent);
  };

  const deleteTable = (e) => {
    console.log(e.target.id);
    supabase
      .from("tables")
      .delete()
      .eq("table_id", e.target.id)
      .then((data) => {
        console.log(data);
        supabase
          .from("tables")
          .select("*, bookings(*)")
          .eq("restaurant_id", RestaurantID)
          .then(({ data }) => {
            console.log(data);
            setTablesOfTheCurrentRestaurant(data);
          });
      });
  };

  const deleteRestaurant = () => {
    supabase
      .from("restaurants")
      .delete()
      .eq("restaurant_id", RestaurantID)
      .select()
      .then(({ data }) => {
        console.log(data);
        navigate("/my-restaurants");
      });
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
    supabase
      .from("tables")
      .select("*, bookings(*)")
      .eq("restaurant_id", RestaurantID)
      .then(({ data }) => {
        console.log(data);
        setTablesOfTheCurrentRestaurant(data);
      });
    console.log(deleteStatus);
  }, []);

  return (
    <>
      {currentRestaurant ? (
        <>
          <div>
            <h2 className="underline font-bold text-3xl">
              You are modifying the settings for:{" "}
              {currentRestaurant.restaurant_name}
            </h2>
            <div className="m-0 text-center">
              <p>Modify Default Booking Duration (in minutes)</p>
              <input
                className="m-0 text-center"
                id="default_booking_duration"
                placeholder={currentRestaurant.default_booking_duration}
                onChange={changeCurr}
              />
            </div>
            <br></br>
            {tablesOfTheCurrentRestaurant.map((table) => {
              return (
                <>
                  <p className="bg-red-50 w-100">
                    TableID: {table.table_id} | Table Name: {table.table_name} |
                    Seats Available: {table.size}{" "}
                    <button
                      className="bg-red-400 hover:bg-red-300 focus:bg-red-200"
                      id={table.table_id}
                      onClick={deleteTable}
                    >
                      Delete This Table
                    </button>
                  </p>{" "}
                  <br></br>
                </>
              );
            })}
            {showTheTableAdder ? (
              <>
                <input
                  id="table_name"
                  placeholder="Table Name"
                  onChange={handleNewTableChange}
                />
                <input
                  id="size"
                  placeholder="Seats Available"
                  onChange={handleNewTableChange}
                />
              </>
            ) : null}
            <br></br>
            <button onClick={showTableAdder}>➕ Add New Table</button>
            <br></br>
            <button onClick={updateRestaurantSettings}>Confirm Changes</button>
            <br></br>
            <button
              className="delete-restaurant-button"
              onClick={deleteRestaurant}
            >
              DELETE THIS RESTAURANT
            </button>
          </div>
        </>
      ) : (
        <p>NO RESTAURANT SELECTED</p>
      )}
    </>
  );
}

export default Settings;

import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";

function Settings() {
  const { user, session } = useAuth();

  const RestaurantID = session.restaurant_id;

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
  }, []);

  return (
    <>
      {currentRestaurant ? (
        <div>
          <h2>
            You are modifying the settings for:{" "}
            {currentRestaurant.restaurant_name}
          </h2>
          <p>Modify Default Booking Duration (in minutes)</p>
          <input
            id="default_booking_duration"
            placeholder={currentRestaurant.default_booking_duration}
            onChange={changeCurr}
          />
          <br></br>
          {tablesOfTheCurrentRestaurant.map((table) => {
            return (
              <>
                <word>
                  TableID: {table.table_id} | Table Name: {table.table_name} |
                  Seats Available: {table.size}
                </word>{" "}
                <button id={table.table_id} onClick={deleteTable}>
                  X
                </button>
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
        </div>
      ) : (
        <p>NO RESTAURANT SELECTED</p>
      )}
    </>
  );
}

export default Settings;

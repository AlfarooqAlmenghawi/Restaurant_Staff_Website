import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

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

  const [newTableName, setNewTableName] = useState("");

  const [newTableSize, setNewTableSize] = useState(0);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
  };

  const showTableAdder = () => {
    toggleShowingTheTableAdder(!showTheTableAdder);
  };

  const handleNameChange = (e) => {
    setNewTableName(e.target.value);
  };

  const handleSizeChange = (e) => {
    setNewTableSize(e.target.value);
  };

  const handleAddTable = async (e) => {
    const { data, error } = await supabase
      .from("tables")
      .insert({
        restaurant_id: RestaurantID,
        size: newTableSize,
        table_name: newTableName,
      })
      .select();
    setNewTableName("");
    setNewTableSize(0);
  };

  const deleteTable = (e) => {
    console.log(e.target.id);
    supabase
      .from("tables")
      .delete()
      .eq("table_id", e.target.id)
      .then((data) => {
        console.log(data);
      });
  };

  const handleShowConfirmDelete = () => {
    setShowConfirmDelete(!showConfirmDelete);
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
    const tablesSubscription = supabase
      .channel("tables-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tables" },
        ({ new: newRecord, old }) => {
          if (newRecord?.restaurant_id === RestaurantID) {
            setTablesOfTheCurrentRestaurant((currTables) => [
              ...currTables,
              newRecord,
            ]);
          }
          setTablesOfTheCurrentRestaurant((currTables) =>
            currTables.filter(({ table_id }) => table_id !== old.table_id)
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(tablesSubscription);
    };
  }, []);

  return (
    <>
      {currentRestaurant ? (
        <>
          <div>
            <h2 className="pageTitle">Restaurant Settings</h2>
            <div className="my-6">
              <label htmlFor="defaultBookingTime">
                Modify Default Booking Duration
              </label>
              <input
                className="ml-4 my-0 bg-zinc-100 border-b-2 border-secondary px-2 py-0.5 w-20"
                name="defaultBookingTime"
                id="default_booking_duration"
                placeholder={currentRestaurant.default_booking_duration}
                onChange={changeCurr}
              />
              <span className="bg-zinc-100 border-b-2 border-secondary p-[5px]">
                minutes
              </span>
            </div>
            <h3 className="text-2xl border-b-4 border-secondary inline-block mb-6">
              Edit Tables
            </h3>
            <button
              className="flex gap-2 items-center transition-colors bg-secondary hover:brightness-90 text-white px-4 py-2 mb-6"
              onClick={showTableAdder}
            >
              <FaPlus /> Add New Table
            </button>
            {showTheTableAdder ? (
              <div className="boxStyle w-fit h-fit mb-4">
                <input
                  id="table_name"
                  className="authInput"
                  style={{ width: "200px" }}
                  placeholder="Table Name"
                  value={newTableName}
                  onChange={handleNameChange}
                />
                <input
                  id="size"
                  className="authInput ml-4"
                  style={{ width: "200px" }}
                  placeholder="Seats Available"
                  value={newTableSize}
                  onChange={handleSizeChange}
                />
                <button
                  className="flex gap-2 items-center transition-colors bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4"
                  onClick={handleAddTable}
                >
                  Add Table
                </button>
              </div>
            ) : null}
            <table>
              <thead>
                <tr className="boxStyle">
                  <th className="px-8 py-4">Table Name</th>
                  <th className="px-8 py-4">Seat Count</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tablesOfTheCurrentRestaurant.map((table) => {
                  return (
                    <tr className="odd:bg-slate-100 even:bg-zinc-200">
                      <td className="px-8 py-4 text-center border-r-[1px] border-slate-700">
                        {table.table_name}
                      </td>
                      <td className="px-8 py-4 text-center">{table.size}</td>
                      <td className="px-8 py-4 text-center border-l-[1px] border-slate-700">
                        <button
                          className="bg-red-500 text-white px-4 py-2 hover:bg-red-300 focus:bg-red-200"
                          id={table.table_id}
                          onClick={deleteTable}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br></br>
            <br></br>
            <button
              className="flex gap-2 items-center transition-colors bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4"
              onClick={updateRestaurantSettings}
            >
              Confirm Changes
            </button>
            <br></br>
            <button
              className="delete-restaurant-button"
              onClick={handleShowConfirmDelete}
            >
              DELETE THIS RESTAURANT
            </button>
            {/* <div className=><div class><FaX /></div></div> */}
          </div>
        </>
      ) : (
        <p>NO RESTAURANT SELECTED</p>
      )}
    </>
  );
}

export default Settings;

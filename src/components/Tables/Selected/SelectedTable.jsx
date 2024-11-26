import moment from "moment";
import { useAuth } from "../../../hooks/Auth";
import supabase from "../../../../supabaseClient";


function SelectedTable({ selectedTable, setSelectedTable, setUpdater }) {
  const {
    user,
    session: { restaurant_id },
  } = useAuth();

  const freeTableHandler = () => {
    supabase
      .rpc("update_end_time", {
        this_booking_id: selectedTable.bookingStatus,
      })
      .then((data, error) => {
        const newUpdate = selectedTable.table_id;
        setUpdater(newUpdate);
      });
  };

  const occupyTableHandler = () => {
    supabase
      .rpc("create_booking", {
        customer_id: user.id,
        chosen_table_id: selectedTable.table_id,
        customer_info: "toggled in",
        group_size: 2,
        booking_type: 1,
        booking_time: moment().format("YYYY-MM-DD HH:mm:ss+00"),
        chosen_restaurant_id: restaurant_id,
      })
      .then(({ data, error }) => {
        setUpdater(selectedTable.bookingStatus);
        console.error(error);
      });
  };

  return (
    <div className="@apply selectBox">
      <p className="font-bold">{selectedTable.table_name}</p>
      <p>Seats {selectedTable.size}</p>
      {selectedTable.bookingStatus ? (
        <>
          <p className="text-red-600 font-bold">Currently Occupied</p>
          <button
            className="bg-red-600 p-2 hover:bg-green-600"
            onClick={freeTableHandler}
          >
            Toggle Availability
          </button>
        </>
      ) : (
        <>
          <p className="text-green-600 font-bold">Currently Free</p>
          <button
            className="bg-green-600 p-2 hover:bg-red-600"
            onClick={occupyTableHandler}
          >
            Toggle Availability
          </button>
        </>
      )}
    </div>
  );
}

export default SelectedTable;

import moment from "moment";
import { useAuth } from "../../../hooks/Auth";
import supabase from "../../../../supabaseClient";

function SelectedTable({ selectedTable, setSelectedTable }) {
  const { user } = useAuth();

  const freeTableHandler = () => {
    supabase
      .rpc("update_end_time", {
        this_booking_id: selectedTable.bookingStatus,
      })
      .then((data, error) => {
        selectedTable.bookingStatus = 0;
        console.log(data);
        console.log(error);
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
        chosen_restaurant_id: 1,
      })
      .then(({ data, error }) => {
        console.error(error);
      });
  };

  return (
    <div>
      <p>Table: {selectedTable.table_name}</p>
      <p>This table is a table for {selectedTable.size} people.</p>
      {selectedTable.bookingStatus ? (
        <button onClick={freeTableHandler}>Table Free</button>
      ) : (
        <button onClick={occupyTableHandler}>Table Occupied</button>
      )}
    </div>
  );
}

export default SelectedTable;

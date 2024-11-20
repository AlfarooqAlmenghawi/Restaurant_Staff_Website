import { TimeInput } from "@nextui-org/date-input";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient.js";

function BookingForm({ tables, selectedTable }) {
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [newBookingInfo, setNewBookingInfo] = useState({});

  const changeValue = (e) => {
    const newInfo = { ...newBookingInfo };
    newInfo[e.target.id] = e.target.value;
    setNewBookingInfo(newInfo);
    console.log(newInfo);
  };

  const changeStartTime = (value) => {
    console.log("value:", value);
    setStartTime(`2024-11-20 ${value.hour}:${value.minute}:00+00`);
  };

  const changeEndTime = (value) => {
    console.log("value:", value);
    setEndTime(`2024-11-20 ${value.hour}:${value.minute}:00+00`);
  };

  const sendBooking = () => {
    console.log(newBookingInfo);
    supabase
      .from("bookings")
      .insert([
        {
          user_id: "da7f48cd-072c-4d34-b3c2-6f3147d725fc",
          table_id: newBookingInfo.table_id,
          extra_info: newBookingInfo.extra_info,
          party_size: newBookingInfo.party_size,
          duration: `[${startTime}, ${endTime})`,
        },
      ])
      .select()
      .then(({ data }) => {
        console.log(data);
      });
  };

  useEffect(() => {
    const changedBookingInfo = { ...newBookingInfo };
    changedBookingInfo.table_id = selectedTable.table_id;
    setNewBookingInfo(changedBookingInfo);
  }, [selectedTable]);

  return (
    <>
      {" "}
      <p>New booking (restraunt side)</p>
      <form>
        <label>
          Start Time
          <TimeInput onChange={changeStartTime} />
        </label>
        <br></br>
        <label>
          End Time
          <TimeInput onChange={changeEndTime} />
        </label>
        <br></br>
        <label>
          Party size
          <input id="party_size" onChange={changeValue}></input>
        </label>
        <br></br>
        <label>
          Table
          <select
            value={newBookingInfo.table_id}
            id="table_id"
            onChange={changeValue}
          >
            {tables.map((table) => {
              return (
                <option
                  value={table.table_id}
                  id={table.table_id}
                  className="individual_table"
                >
                  {table.table_name}
                </option>
              );
            })}
          </select>
        </label>
        <br></br>
        <label>
          Message
          <input id="extra_info" onChange={changeValue}></input>
        </label>
        <br></br>
      </form>
      <button onClick={sendBooking}>Submit booking</button>
    </>
  );
}

export default BookingForm;

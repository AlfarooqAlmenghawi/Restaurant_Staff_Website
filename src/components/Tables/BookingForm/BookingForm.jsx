import { TimeInput } from "@nextui-org/date-input";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient.js";

function BookingForm({ tables, selectedTable }) {
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [reservationType, setReservationType] = useState(null);

  const [newBookingInfo, setNewBookingInfo] = useState({});

  // useEffect(() => {
  //   console.log(tables);
  //   const defaultTable = { ...newBookingInfo };
  //   defaultTable.table_id = tables[0].table_id;
  //   setNewBookingInfo(defaultTable);
  // }, [tables]);

  const changeValue = (e) => {
    const newInfo = { ...newBookingInfo };
    newInfo[e.target.id] = e.target.value;
    setNewBookingInfo(newInfo);
    console.log(newInfo);
  };

  const changeReservationValue = (e) => {
    console.log(e.target.value);
    if (e.target.value === "walkin") {
      console.log(1);
      setReservationType(1);
    } else if (e.target.value === "phone") {
      console.log(2);
      setReservationType(2);
    }
  };

  const changeStartTime = (value) => {
    setStartTime(value);
  };

  const changeEndTime = (value) => {
    setEndTime(value);
  };

  const sendBooking = () => {
    if (
      startTime.hour > endTime.hour ||
      (startTime.hour === endTime.hour && startTime.minute > endTime.minute)
    ) {
      console.log("Invalid time interval");
    } else {
      supabase
        .from("bookings")
        .insert([
          {
            user_id: "da7f48cd-072c-4d34-b3c2-6f3147d725fc",
            table_id: newBookingInfo.table_id,
            extra_info: newBookingInfo.extra_info,
            party_size: newBookingInfo.party_size,
            type: reservationType,
            duration: `[2024-11-20 ${startTime.hour}:${startTime.minute}:00+00,2024-11-20 ${endTime.hour}:${endTime.minute}:00+00)`,
          },
        ])
        .select()
        .then(({ data }) => {})
        .catch(({ data, error }) => {
          console.log(error);
        });
    }
  };

  const addTest = () => {
    supabase
      .from("bookings")
      .insert([
        {
          user_id: "da7f48cd-072c-4d34-b3c2-6f3147d725fc",
          table_id: 2,
          extra_info: "The frick this idiot swore at me on the phone",
          party_size: 5,
          type: 2,
          duration: `[2024-11-20 20:15:00+00,2024-11-20 23:25:00+00)`,
        },
      ])
      .select()
      .then(({ data }) => {})
      .catch(({ data, error }) => {
        console.log(error);
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
      <button onClick={addTest}>Add raw data</button>
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
        <label>
          Reservation Type
          <select id="reservation" onChange={changeReservationValue}>
            <option>Select Here</option>
            <option value="walkin" className="reservation-type">
              Walk-In Reservation
            </option>
            <option value="phone" className="reservation-type">
              Phone Call Reservation
            </option>
          </select>
        </label>
        <br></br>
        <label>
          Party size
          <input id="party_size" onChange={changeValue}></input>
        </label>
        <br></br>
        <label>
          Message
          <input id="extra_info" onChange={changeValue}></input>
        </label>
        <br></br>
      </form>
      <button onClick={sendBooking}>Submit Booking</button>
    </>
  );
}

export default BookingForm;

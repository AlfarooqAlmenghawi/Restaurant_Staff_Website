import { TimeInput } from "@nextui-org/date-input";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient.js";
import { useAuth } from "../../../hooks/Auth.jsx";
import moment from "moment";

function BookingForm({ tables, selectedTable }) {
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [reservationType, setReservationType] = useState(1);

  const [newBookingInfo, setNewBookingInfo] = useState({});

  const { user } = useAuth();

  const [bookingTableSize, setBookingTableSize] = useState(0);

  const [failed, setFailed] = useState(false);

  const [failedMsg, setFailedMSg] = useState("");

  const [bookingDate, setBookingDate] = useState(moment().format("YYYY-MM-DD"))

  useEffect(() => {
    if (tables.length) {
      const defaultTable = { ...newBookingInfo };
      defaultTable.table_id = tables[0].table_id;
      setNewBookingInfo(defaultTable);
    }
  }, [tables]);

  const changeValue = (e) => {
    const newInfo = { ...newBookingInfo };
    newInfo[e.target.id] = e.target.value;
    setNewBookingInfo(newInfo);
  };

  const changeReservationValue = (e) => {
    if (e.target.value === "walkin") {
      setReservationType(1);
    } else if (e.target.value === "phone") {
      setReservationType(2);
    }
  };

  const changeStartTime = (value) => {
    setStartTime(value);
  };

  const changeEndTime = (value) => {
    setEndTime(value);
  };

  const changeDate = (value) => {

  }

  const sendBooking = () => {
    let fullEndTime = null;
    if (endTime !== "") {
      fullEndTime = `2024-11-22 ${endTime.hour}:${endTime.minute}:00+00)`;
    }
    if (
      startTime.hour > endTime.hour ||
      (startTime.hour === endTime.hour && startTime.minute > endTime.minute)
    ) {
      setFailed(true);
      setFailedMSg("End time cannot be before start time!");
    } else if (!newBookingInfo.party_size) {
      setFailed(true);
      setFailedMSg("Need a group size!");
    } else if (newBookingInfo.party_size > bookingTableSize) {
      setFailed(true);
      setFailedMSg("Group size is too big for the table!");
    } else {
      supabase
        .rpc("create_booking", {
          customer_id: user.id,
          chosen_table_id: newBookingInfo.table_id,
          customer_info: newBookingInfo.extra_info,
          group_size: newBookingInfo.party_size,
          booking_type: reservationType,
          booking_time: `2024-11-22 ${startTime.hour}:${startTime.minute}:00+00`,
          end_booking_time: fullEndTime,
          chosen_restaurant_id: 1,
        })
        .then(({ data, error }) => {
          console.error(error);
        });
    }
  };
  // duration: `[2024-11-22 ${startTime.hour}:${startTime.minute}:00+00 , 2024-11-22 ${endTime.hour}:${endTime.minute}:00+00)`,

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
        console.error(error);
      });
  };

  useEffect(() => {
    let tableSize = 0;
    if (newBookingInfo.table_id) {
      tables.forEach((table) => {
        if (Number(table.table_id) === Number(newBookingInfo.table_id)) {
          tableSize = table.size;
        }
      });
    }
    setBookingTableSize(tableSize);
  }, [newBookingInfo]);

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
      {failed ? <p>{failedMsg}</p> : null}
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
          Date:
          <input type="date" onChange={(e)=>{console.log(e.target.value)}}min={moment().format("YYYY-MM-DD")} />
        </label>
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

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

  const {
    user,
    session: { restaurant_id },
  } = useAuth();

  const [bookingTableSize, setBookingTableSize] = useState(0);

  const [failed, setFailed] = useState(false);

  const [failedMsg, setFailedMSg] = useState("");

  const [bookingDate, setBookingDate] = useState(moment().format("YYYY-MM-DD"));

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

  const changeDateHandler = (e) => {
    setBookingDate(e.target.value);
  };

  const sendBooking = (e) => {
    e.preventDefault();
    let fullEndTime = null;
    if (endTime !== "") {
      fullEndTime = `${bookingDate} ${endTime.hour}:${endTime.minute}:00+00)`;
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
          booking_time: `${bookingDate} ${startTime.hour}:${startTime.minute}:00+00`,
          end_booking_time: fullEndTime,
          chosen_restaurant_id: restaurant_id,
        })
        .then(({ data, error }) => {
          console.error(error);
        });
    }
  };
  // duration: `[2024-11-22 ${startTime.hour}:${startTime.minute}:00+00 , 2024-11-22 ${endTime.hour}:${endTime.minute}:00+00)`,

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
      <div className="mt-6 boxStyle">
        <h3 className="font-bold text-lg">New Booking</h3>
        <form className="grid grid-cols-3 gap-2">
          <label className="flex flex-col font-bold">
            Start Time *
            <TimeInput
              hourCycle={24}
              className="flex"
              onChange={changeStartTime}
            />
          </label>
          <label className="flex flex-col font-bold">
            End Time
            <TimeInput
              className="font-normal"
              hourCycle={24}
              onChange={changeEndTime}
            />
          </label>
          <label className="flex flex-col font-bold">
            <b>Date:</b>
            <input
              type="date"
              onChange={changeDateHandler}
              min={moment().format("YYYY-MM-DD")}
            />
          </label>
          <label className="flex flex-col font-semibold">
            Table *
            <select
              className="font-normal"
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
          <label className="flex flex-col font-semibold">
            Reservation Type
            <select
              id="reservation"
              onChange={changeReservationValue}
              className="font-normal"
            >
              <option value="phone" className="font-normal">
                Phone
              </option>
              <option value="walkin" className="font-normal">
                Walk-In
              </option>
            </select>
          </label>
          <br></br>
          <label className="flex flex-col font-semibold">
            Party size *
            <input
              value={newBookingInfo.party_size}
              type="number"
              className="border-[1px]"
              id="party_size"
              onChange={changeValue}
            ></input>
          </label>
          <label className="flex flex-col font-semibold col-span-2">
            Message
            <textarea
              className="border-[1px] font-normal"
              id="extra_info"
              onChange={changeValue}
            ></textarea>
          </label>
          <button className="@apply custButton" onClick={sendBooking}>
            Submit Booking
          </button>
          {failed ? (
            <p className="text-red-600 font-bold">{failedMsg}</p>
          ) : null}
        </form>
      </div>
    </>
  );
}

export default BookingForm;

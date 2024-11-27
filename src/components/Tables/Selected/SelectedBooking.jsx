import moment from "moment";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient.js";
import { FaPhoneAlt, FaCrown, FaWalking, FaClock } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import Icon from "../../../svgs/icon.svg?react";

function SelectedBooking({ selectedBooking, selectedTable, setTypeSelected, setTables }) {
  const [bookingType, setBookingType] = useState("");

  const [typeIcon, setTypeIcon] = useState(<FaPhoneAlt />);

  function deleteBooking() {
    supabase
      .from("bookings")
      .delete()
      .eq("booking_id", selectedBooking.booking_id)
      .then(({ data, error }) => {
        console.error("Delete Error: ", error);
        setTypeSelected(0);
      })
      .catch((error) => {
        console.error("Delete Failed: ", error);
      });
  }

  useEffect(() => {
    if (selectedBooking.type === 0) {
      setBookingType("Booked on App");
      setTypeIcon(<Icon className="size-6" />);
    } else if (selectedBooking.type === 1) {
      setBookingType("Walk In");
      setTypeIcon(<FaWalking className="mr-1" />);
    } else {
      setBookingType("Phone Booking");
      setTypeIcon(<FaPhoneAlt className="mr-1" />);
    }
  }, [selectedBooking]);
  return (
    <>
      <div id="selected-booking" className="boxStyle mt-4">
        <p>
          <b>{selectedTable.table_name}</b>
        </p>
        <p className="flex">
          <FaClock className="mr-1" /> <b> Time:</b>{" "}
          {moment(selectedBooking.duration.slice(2, 24)).calendar()} until{" "}
          {moment(selectedBooking.duration.slice(27, 49)).format("LT")}
        </p>

        <p className="flex">
          <FaPeopleGroup className="mr-1" />
          <b>Party Size:</b> {selectedBooking.party_size}
        </p>
        {selectedBooking.extra_info !== null ? (
          <p>
            <b>Message:</b> {selectedBooking.extra_info}
          </p>
        ) : null}
        <p className="flex">
          {typeIcon}
          {"  "}
          {bookingType}
        </p>
        <button className="@apply custButton" onClick={deleteBooking}>
          Cancel Booking
        </button>
      </div>
    </>
  );
}

export default SelectedBooking;

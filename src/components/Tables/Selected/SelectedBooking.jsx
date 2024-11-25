import moment from "moment";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient.js";

function SelectedBooking({ selectedBooking, selectedTable, setTypeSelected }) {
  const [bookingExistence, setBookingExistence] = useState(true);

  const [bookingType, setBookingType] = useState("");

  function deleteBooking() {
    supabase
      .from("bookings")
      .delete()
      .eq("booking_id", selectedBooking.booking_id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Delete Error: ", error);
        } else {
          setBookingExistence(false);
        }
        setTypeSelected(0);
      })
      .catch((error) => {
        console.error("Delete Failed: ", error);
      });
  }

  useEffect(() => {
    if (selectedBooking.type === 0) {
      setBookingType("Booked on App");
    } else if (selectedBooking.type === 1) {
      setBookingType("Walk-In");
    } else {
      setBookingType("Phone Booking");
    }
  }, [selectedBooking]);

  return (
    <>
      <div id="selected-booking">
        <p>Booking: Table - {selectedTable.table_name}</p>
        <p>
          Time: From {moment(selectedBooking.duration.slice(2, 24)).calendar()}{" "}
          till {moment(selectedBooking.duration.slice(27, 49)).calendar()}
        </p>
        <p>Guest Size: {selectedBooking.party_size}</p>
        <p>Booking Type: {bookingType}</p>
        {selectedBooking.extra_info ? (
          <p>Extra Information from Customer: {selectedBooking.extra_info}</p>
        ) : null}
        <button className="cancel-button" onClick={deleteBooking}>
          Cancel Booking
        </button>
      </div>
    </>
  );
}

export default SelectedBooking;

import moment from "moment";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient.js";

function SelectedBooking({ selectedBooking, selectedTable }) {
  const [bookingExistence, setBookingExistence] = useState(true);

  function deleteBooking() {
    console.log(selectedBooking.booking_id);
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
      })
      .catch((error) => {
        console.error("Delete Failed: ", error);
      });
  }

  useEffect(() => {
    setBookingExistence(true);
    supabase
      .from("bookings")
      .select()
      .eq("booking_id", selectedBooking.booking_id)
      .then(({ data, error }) => {
        if (data.length === 0) {
          console.log(data);
          console.log(selectedBooking.booking_id);
          setBookingExistence(false);
        } else {
          console.log(data);
          console.log(selectedBooking.booking_id);
          setBookingExistence(true);
        }
      })
      .catch((error) => {
        console.error("Delete Failed: ", error);
      });
  }, [selectedBooking]);

  return (
    <>
      {bookingExistence ? (
        <div id="selected-booking">
          <p>Booking: Table - {selectedTable.table_name}</p>
          <p>
            Time: From{" "}
            {moment(selectedBooking.duration.slice(2, 24)).calendar()} till{" "}
            {moment(selectedBooking.duration.slice(27, 49)).calendar()}
          </p>
          <p>Guest Size: {selectedBooking.party_size}</p>
          <p>Extra Information from Customer: "{selectedBooking.extra_info}"</p>
          <button className="cancel-button" onClick={deleteBooking}>
            Cancel Booking
          </button>
        </div>
      ) : null}
    </>
  );
}

export default SelectedBooking;

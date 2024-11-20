import moment from "moment";

function SelectedBooking({ selectedBooking }) {
  return (
    <div id="selected-booking">
      <p>
        Selected booking: {"username"}, table: {selectedBooking.table_id}, from{" "}
        {moment(selectedBooking.duration.slice(2, 24)).calendar()} to{" "}
        {moment(selectedBooking.duration.slice(27, 49)).calendar()} party size:{" "}
        {selectedBooking.party_size}
      </p>
    </div>
  );
}

export default SelectedBooking;

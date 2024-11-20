import moment from "moment";

function SelectedBooking({ selectedBooking, selectedTable }) {
  return (
    <div id="selected-booking">
      <p>
        Selected booking: table: {selectedTable.table_name}, from{" "}
        {moment(selectedBooking.duration.slice(2, 24)).calendar()} to{" "}
        {moment(selectedBooking.duration.slice(27, 49)).calendar()} party size:{" "}
        {selectedBooking.party_size} Extra information:{" "}
        {selectedBooking.extra_info}
      </p>
    </div>
  );
}

export default SelectedBooking;

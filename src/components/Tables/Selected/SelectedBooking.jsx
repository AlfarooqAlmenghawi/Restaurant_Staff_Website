import moment from "moment";

function SelectedBooking({selectedBooking}) {
  return (
    <div id="selected-booking">
      <p>
        Selected booking: {selectedBooking.username}, table:{" "}
        {selectedBooking.table}, from{" "}
        {moment(selectedBooking.start_time).calendar()} to{" "}
        {moment(selectedBooking.end_time).calendar()}
      </p>
    </div>
  );
}

export default SelectedBooking;

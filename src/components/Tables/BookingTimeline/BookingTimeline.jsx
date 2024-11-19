import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { useEffect, useState } from "react";
import SelectedBooking from "../Selected/SelectedBooking";
import SelectedTable from "../Selected/SelectedTable";

const BookingTimeline = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      table: 1,
      username: "colins",
      start_time: moment(),
      end_time: moment().add(1, "hour"),
    },
    {
      id: 2,
      table: 2,
      username: "Johnson",
      start_time: moment().add(-0.5, "hour"),
      end_time: moment().add(0.5, "hour"),
    },
    {
      id: 3,
      table: 1,
      username: "jefferson",
      start_time: moment().add(2, "hour"),
      end_time: moment().add(3, "hour"),
    },
    {
      id: 4,
      table: 2,
      username: "hooba",
      start_time: new Date("2024-12-14T14:29:16"),
      end_time: moment(new Date("2024-12-14T14:29:16")).add(1, "hour"),
    },
  ]);
  const [typeSelected, setTypeSelected] = useState(0);

  const [selectedBooking, setSelectedBooking] = useState({});

  const [selectedTable, setSelectedTable] = useState({});

  const tables = [
    { table_id: 1, table_label: "table 1" },
    { table_id: 2, table_label: "table 2" },
    { table_id: 3, table_label: "table 3" },
  ];

  const [timelineEntries, setTimelineEntries] = useState([]);

  useEffect(() => {
    const bookingArr = items.map((booking) => {
      return {
        id: booking.id,
        group: booking.table,
        title: booking.username,
        start_time: booking.start_time,
        end_time: booking.end_time,
        canMove: false,
        canResize: false,
      };
    });
    setTimelineEntries(bookingArr);
  }, [items]);

  const newBooking = () => {
    const newItems = [...items];
    newItems.push({
      id: 7,
      table: 3,
      username: "om",
      start_time: moment().add(1, "hour"),
      end_time: moment().add(2, "hour"),
    });
    setItems(newItems);
  };

  //type selected value refers to the type of selected item. 0=nothing(default), 1=booking item, 2=table

  const selectBookingHandler = (itemId, e, time, items) => {
    const currentEntry = items.filter((entry) => {
      return entry.id === itemId;
    });
    
    setSelectedBooking(currentEntry[0]);
    setTypeSelected(1);
  };

  const selectTableHandler = (e, tables) => {
    console.log(tables)
    console.log(e.target.value)
    const currentTable = tables.filter((table) => {
      return table.table_id === e.target.value ;
    });
    console.log(currentTable)
    setSelectedTable(currentTable[0]);
    setTypeSelected(2);
  };

  const changeValue = (e) => {
    const newInfo = { ...bookingInfo };
    newInfo[e.target.id] = e.target.value;
    setBookingInfo(newInfo);
  };

  const sendBooking = () => {
    const newItems = [...items];
    newItems.push({
      id: 0,
      table: Number(bookingInfo.table),
      username: bookingInfo.name,
      start_time: moment(bookingInfo.time),
      end_time: moment(bookingInfo.time).add(1, "hour"),
    });
    setItems(newItems);
  };

  return (
    <div>
      Bookings:
      <button onClick={newBooking}>Add new</button>
      <Timeline
        groups={tables.map((table) => {
          return {
            id: table.table_id,
            title: (
              <button
                onClick={(e) => {
                  selectTableHandler(e, tables);
                }}
                value={table.table_id}
              >
                {table.table_label}
              </button>
            ),
          };
        })}
        items={timelineEntries}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
        minZoom={60 * 60 * 1000}
        maxZoom={365.24 * 86400 * 1000}
        onItemSelect={(itemId, e, time) => {
          selectBookingHandler(itemId, e, time, items);
        }}
      />
      <div>
        {typeSelected === 1 ? (
          <SelectedBooking selectedBooking={selectedBooking} />
        ) : typeSelected === 2 ? (
          <SelectedTable selectedTable={selectedTable} />
        ) : null}
      </div>
      <p>New booking (restraunt side)</p>
      <form>
        <label>
          Name
          <input id="name" onChange={changeValue}></input>
        </label>
        <label>
          Time
          <input id="time" onChange={changeValue}></input>
        </label>
        <label>
          Party size
          <input id="size" onChange={changeValue}></input>
        </label>
        <label>
          Table
          <input id="table" onChange={changeValue}></input>
        </label>
      </form>
      <button onClick={sendBooking}>Submit booking</button>
    </div>
  );
};

export default BookingTimeline;

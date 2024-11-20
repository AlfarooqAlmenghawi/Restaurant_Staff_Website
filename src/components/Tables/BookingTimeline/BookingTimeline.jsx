import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { useEffect, useState } from "react";
import SelectedBooking from "../Selected/SelectedBooking";
import SelectedTable from "../Selected/SelectedTable";
import supabase from "../../../../supabaseClient";

const BookingTimeline = () => {
  const [groups, setGroups] = useState([]);

  const [tables, setTables] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [typeSelected, setTypeSelected] = useState(0);

  const [selectedBooking, setSelectedBooking] = useState({});

  const [selectedTable, setSelectedTable] = useState({});

  const [timelineEntries, setTimelineEntries] = useState([]);

  useEffect(() => {
    supabase
      .from("tables")
      .select("*, bookings(*)")
      .eq("restaurant_id", "1")
      .then(({ data }) => {
        return Promise.all(data);
      })
      .then((data) => {
        setTables(data);
        let totalBookingsOfRestaurant = [];
        for (let i = 0; i < data.length; i++) {
          totalBookingsOfRestaurant = totalBookingsOfRestaurant.concat(
            data[i].bookings
          );
        }
        const allTables = data.map((table) => {
          return {
            id: table.table_id,
            title: (
              <button
                onClick={(e) => {
                  selectTableHandler(e, data);
                }}
                value={table.table_id}
              >
                {table.table_name}
              </button>
            ),
          };
        });
        return [totalBookingsOfRestaurant, allTables];
      })
      .then(([bookings, allTables]) => {
        const bookingArr = bookings.map((booking) => {
          return {
            id: booking.booking_id,
            group: booking.table_id,
            title: "booking",
            start_time: moment(booking.duration.slice(2, 24)),
            end_time: moment(booking.duration.slice(27, 49)),
            canMove: false,
            canResize: false,
          };
        });
        setBookings(bookings);
        return Promise.all([bookingArr, setGroups(allTables)]);
      })
      .then(([bookingArr]) => {
        return setTimelineEntries(bookingArr);
      });
  }, []);

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

  const selectBookingHandler = (itemId, e, time, bookings, tables) => {
    const currentEntry = bookings.filter((entry) => {
      return Number(entry.booking_id) === Number(itemId);
    });
    const currentTable = tables.filter((table) => {
      return Number(table.table_id) === currentEntry[0].table_id;
    });
    Promise.all([
      setSelectedTable(currentTable[0]),
      setSelectedBooking(currentEntry[0]),
    ]);
    setTypeSelected(1);
  };

  const selectTableHandler = (e, groups) => {
    const currentTable = groups.filter((table) => {
      return Number(table.table_id) === Number(e.target.value);
    });

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
      {groups.length && timelineEntries.length && (
        <Timeline
          groups={groups}
          items={timelineEntries}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
          minZoom={60 * 60 * 1000}
          maxZoom={365.24 * 86400 * 1000}
          onItemSelect={(itemId, e, time) => {
            selectBookingHandler(itemId, e, time, bookings, tables);
          }}
        />
      )}
      <div>
        {typeSelected === 1 ? (
          <SelectedBooking
            selectedBooking={selectedBooking}
            selectedTable={selectedTable}
          />
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

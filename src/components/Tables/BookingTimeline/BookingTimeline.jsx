import Timeline, {
  CursorMarker,
  TimelineMarkers,
  TodayMarker,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import { useEffect, useState } from "react";
import SelectedBooking from "../Selected/SelectedBooking";
import SelectedTable from "../Selected/SelectedTable";
import BookingForm from "../BookingForm/BookingForm.jsx";
import supabase from "../../../../supabaseClient.js";

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

    console.log("Supabase client:", supabase);
    const commentsSubscription = supabase
      .channel("bookings-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Booking change received!", payload);
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
                    <button onClick={selectTableHandler} value={table.table_id}>
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
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    // Clean up subscription when the component unmounts
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, []);

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

  const selectTableHandler = (e, tables) => {
    const currentTable = tables.filter((table) => {
      return Number(table.table_id) === Number(e.target.value);
    })[0];
    let bookingStatus = 0;
    currentTable.bookings.forEach(({ duration, booking_id }) => {
      const start_time = moment(duration.slice(2, 24));
      const end_time = moment(duration.slice(27, 49));
      if (start_time.isBefore(moment()) && end_time.isAfter(moment())) {
        bookingStatus = booking_id;
      }
    });
    console.log({ ...currentTable, bookingStatus });
    setSelectedTable({ ...currentTable, bookingStatus });
    setTypeSelected(2);
  };

  return (
    <div>
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
        >
          <TimelineMarkers>
            <TodayMarker />
            <CursorMarker />
          </TimelineMarkers>
        </Timeline>
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
      <BookingForm tables={tables} selectedTable={selectedTable} />
    </div>
  );
};

export default BookingTimeline;

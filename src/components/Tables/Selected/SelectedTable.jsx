function SelectedTable({ selectedTable }) {
  return (
    <div>
      <p>Table: {selectedTable.table_name}</p>
      <p>This table is a table for {selectedTable.size} people.</p>
      <p>{selectedTable.bookingStatus}</p>
    </div>
  );
}

export default SelectedTable;

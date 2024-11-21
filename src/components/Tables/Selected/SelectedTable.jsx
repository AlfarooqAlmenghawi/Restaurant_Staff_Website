function SelectedTable({ selectedTable }) {
  return (
    <div>
      <p>Table: {selectedTable.table_name}</p>
      <p>This table is a table for {selectedTable.size} people.</p>
      {/* <button>Toggle Status</button> */}
    </div>
  );
}

export default SelectedTable;

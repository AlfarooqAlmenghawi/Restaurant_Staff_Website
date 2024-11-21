function SelectedTable({ selectedTable }) {
  return (
    <div>
      <p>Table: {selectedTable.table_name}</p>
      <p>Table Number: {selectedTable.table_id}</p>
      <button>Toggle Status</button>
    </div>
  );
}

export default SelectedTable;

function SelectedTable({ selectedTable }) {
  console.log(selectedTable);
  return (
    <div>
      <p>table: {selectedTable.table_name}</p>
    </div>
  );
}

export default SelectedTable;

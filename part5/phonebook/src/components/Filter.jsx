const Filter = ({ filterName, handleFilterChange }) => {
  return (
    <>
      <h2>filter shown with:</h2>
      <input
        value={filterName}
        onChange={handleFilterChange}
      />
    </>
  )
}

export default Filter
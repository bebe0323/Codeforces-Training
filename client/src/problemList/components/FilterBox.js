export function FilterBox({
  handleFilter, lower, upper, handleLower, handleUpper,
}) {
  return (
    <form className="filter-box" onSubmit={handleFilter}>
      <p className="filter-text">→ Filter Problems</p>
      <div className="filter-input">
        <p className="difficulty-text">Difficulty:</p>
        <input value={lower} onChange={handleLower} className="difficulty-input" required />
        -
        <input value={upper} onChange={handleUpper} className="difficulty-input" required />
      </div>
      <div className="apply-button-div">
        <button className="apply-button">
          Apply
        </button>
      </div>
    </form>
  );
}

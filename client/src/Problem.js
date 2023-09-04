
export default function Problem() {

  return (
    <div>
        <form className="problemSubmit">
          <input
            className="problemTitle"
            placeholder="Problem title"
            type="text"
            value="1a"
          />
          <select
            value="easy"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button>Update</button>
        </form>
      </div>
  )
}


export default function Post() {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{width: '3.75em', }}>#</th>
            <th style={{textAlign: 'center'}}>Name</th>
            <th style={{width: '2.5em'}}>Difficulty</th>
            <th>Date added</th>
            <th>Date solved</th>
            <th>Solved Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://codeforces.com/problemset/problem/1851/A">4a</a></td>
            <td>Watermelon</td>
            <td>800</td>
            <td>2023.09.05</td>
            <td>2023.10.01</td>
            <td>120:15</td>
            <td>
              <button>Remove</button>
            </td>
          </tr>

          <tr className="active-row">
            <td>71A</td>
            <td>Way Too Long Words</td>
            <td>1000</td>
            <td>2023.09.05</td>
            <td>2023.10.01</td>
            <td>120:15</td>
            <td>
              <button>Remove</button>
            </td>
          </tr>

          <tr>
            <td>4a</td>
            <td>Watermelon</td>
            <td>800</td>
            <td>2023.09.05</td>
            <td>2023.10.01</td>
            <td>120:15</td>
            <td>
              <button>Remove</button>
            </td>
          </tr>

          <tr className="active-row">
            <td>71A</td>
            <td>Way Too Long Words</td>
            <td>1000</td>
            <td>2023.09.05</td>
            <td>2023.10.01</td>
            <td>120:15</td>
            <td>
              <button>Remove</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}
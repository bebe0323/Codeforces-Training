import { useState} from "react";

export default function AddProblemPage() {
  const [link, setLink] = useState('');
  async function handleAddProblem(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/addProblem', {
      method: 'POST',
      body: JSON.stringify({ link }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      alert('successfully added');
      setLink('');
    } else {
      response.json()
        .then(data => alert(data))
    }
  }

  return (
    <div>
      <form onSubmit={handleAddProblem}>
        <input
          placeholder="Problem link"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
        <button>Add</button>
      </form>
    </div>
  )
}

import { useState} from "react";

export default function AddProblemPage() {
  const [link, setLink] = useState('');
  async function handleProblemAdd(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/problemAdd', {
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
      <form onSubmit={handleProblemAdd}>
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

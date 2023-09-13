import { useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function AddProblemPage() {
  const [link, setLink] = useState('');
  async function handleProblemAdd(e) {
    e.preventDefault();
    const response = await fetch('https://cp-training-backend.onrender.com/problemAdd', {
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
      <InputGroup className="mb-3" style={{width: "50%"}}>
        <Form.Control
          type="text"
          placeholder="Problem link"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
        <Button onClick={handleProblemAdd} variant="warning">Add</Button>
      </InputGroup>
    </div>
  )
}

import { useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';

export default function AddProblemPage() {
  const [link, setLink] = useState('');
  async function handleProblemAdd(e) {
    e.preventDefault();
    try {
      await axios.post('/problemAdd', { link });
      alert('successfully added');
      setLink('');
    } catch(error) {
      alert(error.response.data);
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

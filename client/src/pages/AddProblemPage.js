import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { FaCopy } from "react-icons/fa6";

export default function AddProblemPage() {
  const [link, setLink] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [copyMessage, setCopyMessage] = useState('Copy');

  useEffect(() => {
    // Function to handle clicks outside the button
    const handleDocumentClick = (e) => {
      if (isClicked) {
        const button = document.getElementById('copy-button');
        if (button && !button.contains(e.target)) {
          setIsClicked(false);
          setCopyMessage('Copy');
        }
      }
    };
    document.addEventListener('click', handleDocumentClick);
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isClicked]);

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

  function handleCopyButton() {
    setIsClicked(true);
    setCopyMessage('Copied!');
    navigator.clipboard.writeText('https://codeforces.com/problemset/problem/4/A');
  }

  function handleMouseEnter() {
    setIsHovered(true);
  };

  function handleMouseLeave() {
    setIsHovered(false);
  };

  return (
    <div>
      <form className="problem-add">

        <FloatingLabel
          controlId="floatingInput"
          label="problem link"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="problem link"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
          />
        </FloatingLabel>
        <Button onClick={handleProblemAdd} className="add-button" variant="warning">
          Add
        </Button>
      </form>
      <div className="example-link-area">
        <p className="info-example-link">Example link: </p>
        <a className="example-link" href="https://codeforces.com/problemset/problem/4/A" target="_blank" rel="noopener noreferrer">
          https://codeforces.com/problemset/problem/4/A
        </a>
        <button
          id="copy-button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={isClicked ? 'clicked-button copy-button' : 'copy-button'}
          onClick={handleCopyButton}
        >
          <FaCopy />
        </button>
        {isHovered &&
          <div className="copy-hovered">
            {copyMessage}
          </div>
        }
      </div>
    </div>
  )
}

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import { Navigate } from "react-router-dom";
import { useContext, useState } from "react";

import problemSolving from './problemadd.png';
import solvedGraph from './solved_graph.png';
import solvedList from './SolvedList.png';
import solving from './solving.png';
import problemAdd from './problemAdd2.png';


export default function IndexPage() {
  const [redirect, setRedirect] = useState('');
  function handleAddProblem() {
    setRedirect('/problem/add');
  }
  function handleSolving() {
    setRedirect('/problem/solving');
  }
  function handleSolvedList() {
    setRedirect('/list/solved');
  }
  function handleSolvedChart() {
    setRedirect('/list/solved');
  }
  

  if (redirect !== '') {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <h2>Codeforces Training Tracker</h2>
      <p>The purpose of the website is to track the training on codeforces.com.</p>
      <div style={{marginBottom: "30px"}} className="d-flex justify-content-around">
        <Card style={{ width: '26rem' }}>
          <Card.Img variant="top" src={problemAdd} />
          <Card.Body>
            <Card.Title>Adding problem</Card.Title>
            <Card.Text>
              By passing valid codeforces problem link, the problem would be added to <i>todo list.</i>
            </Card.Text>
            <Button variant="primary" onClick={ handleAddProblem }>Go to Add Problem</Button>
          </Card.Body>
        </Card>
        <Card style={{ width: '26rem' }}>
          <Card.Img variant="top" src={ solving } />
          <Card.Body>
            <Card.Title>Solving</Card.Title>
            <Card.Text>
              As you are solving the problem, you can write some notes
              and see the duration of how long you have been solving.
            </Card.Text>
            <Button variant="primary" onClick={ handleSolving }>Go to solving page</Button>
          </Card.Body>
        </Card>
      </div>

      <div className="d-flex justify-content-around">
        <Card style={{ width: '26rem' }}>
          <Card.Img variant="top" src={ solvedList } />
          <Card.Body>
            <Card.Title>Solved List</Card.Title>
            <Card.Text>
            The list of solved problems with solved duration and notes.
            </Card.Text>
            <Button variant="primary" onClick={ handleSolvedList }>Go to Solved List</Button>
          </Card.Body>
        </Card>
        <Card style={{ width: '26rem' }}>
          <Card.Img variant="top" src={ solvedGraph } />
          <Card.Body>
            <Card.Title>Solved List Chart</Card.Title>
            <Card.Text>
              Each solved problem with solved duration to track the progress.
            </Card.Text>
            <Button variant="primary" onClick={ handleSolvedChart }>Go to Solved List Chart</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
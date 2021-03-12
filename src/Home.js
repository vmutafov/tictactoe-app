import React, { Component, useState } from 'react';
import './App.css';
import { boardFieldState, boardIdState } from './state'
import { Button, Container, Row, Col, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Home = (props) => {

  const {
    authenticated,
    navbar,
    user,
    history,
    api
  } = props;
  const [modal, setModal] = useState(false);
  const [cellsCount, setCellsCount] = useState(3);

  if (authenticated === null) {
    return <p>Loading...</p>;
  }

  const toggle = () => setModal(!modal);

  const onStartGame = () => {
    api.createGame(cellsCount).then(async boardResponse => {
      const board = await boardResponse.json()
      boardFieldState.next(board.field);
      boardIdState.next(board.id);

      history.push({
        pathname: "game",
        search: `?cellsCount=${cellsCount}`
      });
    })
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    setCellsCount(value);
  }

  return (
    <div className="app">
      {navbar}
      <Container fluid>
        {authenticated ?
          <div>
            <p>Welcome, {user.name}</p>
            <Button color="secondary" onClick={toggle}>
              Start a game
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Configure game</ModalHeader>
              <ModalBody>
                <span>Number of cells per dimension:</span>
                <Input className="tictactoe-cells-count-input" onChange={handleChange} type="number" name="cells" id="cells" value={cellsCount} autoComplete="cells" min="3" max="4" />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={onStartGame}>
                  Go!
                {/* <Link className="app-link" to={{pathname: `/game`, query: {cellsCount}}}>Go!</Link> */}
                </Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </div> :
          <div>
            <p>Please log in to start a game.</p>
            <Button color="secondary" disabled={true}>
              Start a game
              </Button>
          </div>
        }
      </Container>
    </div>
  );
}

export default Home;
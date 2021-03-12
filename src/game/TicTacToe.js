import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import * as queryString from 'query-string';
import { boardFieldState, boardIdState } from '../state'
import './TicTacToe.css';

class TicTacToe extends Component {
    constructor(props) {
        super(props);

        const initialBoardField = [];
        for (let i = 0; i < 3; i++) {
            initialBoardField[i] = [];
            for (let j = 0; j < 3; j++) {
                initialBoardField[i][j] = [];
                for (let k = 0; k < 3; k++) {
                    initialBoardField[i][j][k] = '-';
                }
            }
        }

        this.state = { boardField: initialBoardField, gameEnded: false, pendingResponse: false };
    }

    onCellClick = (cellKey) => {
        if (this.state.gameEnded === false && this.state.pendingResponse === false) {
            this.state.pendingResponse = true;
            const layer = parseInt(cellKey[0]);
            const row = parseInt(cellKey[1]);
            const col = parseInt(cellKey[2]);
            this.props.api.makeMove(boardIdState.value, layer, row, col).then(async boardResponse => {
                const board = await boardResponse.json()
                if (board.isAIWin) {
                    alert("AI wins! You can start a new game.")
                    this.state.gameEnded = true;
                    this.props.history.goBack();
                } else if (board.isPlayerWin) {
                    alert("Player wins! You can start a new game.");
                    this.state.gameEnded = true;
                    this.props.history.goBack();
                }

                boardFieldState.next(board.field);
                this.state.pendingResponse = false;
            });
        }
    }

    componentDidMount() {
        boardFieldState.subscribe(updatedBoardField => {
            this.setState({
                boardField: updatedBoardField
            });
        });
    }

    render() {
        const params = queryString.parse(this.props.location.search, { parseNumbers: true });
        const cellsCount = params.cellsCount;

        const layers = [];
        for (let t = 0; t < cellsCount; t++) {
            const rows = [];
            let ctr = 0;

            for (let i = 0; i < cellsCount; i++) {
                const cols = [];

                for (let j = 0; j < cellsCount; j++) {
                    ctr += 1;
                    const cellKey = `${t}${i}${j}`
                    cols.push(<td key={cellKey} className="bordered game-cell" onClick={() => this.onCellClick(cellKey)}>{this.state.boardField[t][i][j]}</td>)
                }

                rows.push(<tr key={'row' + i} className="bordered">{cols}</tr>)
            }

            layers.push(<table key={'table' + t} className="bordered game-board">
                <tbody>
                    {rows}
                </tbody>
            </table>);
        }


        const calculatePerspective = () => `${(cellsCount - 2) * 1000}px`;


        return <div>
            {this.props.navbar}
            <Container className="game-container" style={{ perspective: calculatePerspective() }}>
                <Row>
                    <Col>
                        {layers}
                    </Col>
                </Row>
            </Container>
        </div>
    }
}

export default withRouter(TicTacToe);
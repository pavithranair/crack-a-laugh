import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  
	static defaultProps = {
    nrows : 4, 
    ncols : 9, 
    chanceLightStartsOn : 0.5
	};
	constructor (props) {

		super(props);
		this.state = {
			hasWon : false,
			  board  : this.createBoard(),
			  tries : 20
		};
  }
	  
    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
	createBoard () {
		let board = [];
		for (let y = 0; y < this.props.nrows; y++) {
			let row = [];
			for (let x = 0; x < this.props.ncols; x++) {
				row.push(Math.random() > 0.5);
			}
			board.push(row);
		}
		return board;
	}

	viewBoard () {
		let board = this.state.board; 
		let board2 = [];
		for (let y = 0; y < this.props.nrows; y++) {
			let row = [];
			for (let x = 0; x < this.props.ncols; x++) {
				let coord = `${y}-${x}`;
				let cell = (
					<Cell key={coord} isLit={board[y][x]} flipCellsAroundMe={() => this.flipCellsAround(coord)} />
				);
				row.push(cell);
			}
			board2.push(<tr key={y}>{row}</tr>);
		}
		return board2;
	}

	/** handle changing a cell: update board & determine if winner */
	flipCellsAround (coord) {
		let { ncols, nrows } = this.props;
		let board = this.state.board;
		let tries = this.state.tries;
		let [ y, x ] = coord.split('-').map(Number);

		// TODO: flip this cell and the cells around it
		function flipCell (y, x){
			// if this coord is actually on board, flip it
			if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
				board[y][x] = !board[y][x];
			}
		}
		flipCell(y, x);
		flipCell(y, x - 1);
		flipCell(y, x + 1);
		flipCell(y - 1, x);
		flipCell(y + 1, x);

		// win when every cell is turned off
		// TODO: determine is the game has been won
		this.setState({
			board  : board,
			hasWon : board.every((row) => row.every((cell) => !cell)),
			tries : tries - 1
    });
	}

	render () {
		if (this.state.hasWon) {
			return (
				<div className='Board-title'>
					<div className='winner'>
						<span className='orange-glow'>YOU</span>
						<span className='blue-glow'>WON</span>
					</div>
				</div>
			);
		} else if(this.state.tries > 0){
			return (
				<div>
					<div className='Lights-Out'>
						<span className='orange-glow'>Lights </span>
						<span className='blue-glow'>Out</span>
					</div>
					<table className='Board'>
						<tbody>{this.viewBoard()}</tbody>
					</table>
          <div>
          <span className='blue-glow'>Tries Left: {this.state.tries}</span>
          </div>
				</div>
			);
		}
		else{
			return(<span className='blue-glow'>You Lost</span>);
		}
	}
}

export default Board;
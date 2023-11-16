import { useEffect, useState } from 'react';

function App() {
	return <Game />;
}

function Game() {
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [xIsNext, setXIsNext] = useState(true);
	const [isWinner, setIsWinner] = useState(false);

	function handlePlay(squares) {
		setSquares(squares);
		setXIsNext(!xIsNext);
	}

	function restartGame() {
		setSquares(Array(9).fill(null));
		setXIsNext(true);
		setIsWinner(false);
	}

	useEffect(() => {
		if (calculateWinner(squares)) {
			setTimeout(() => {
				setIsWinner(true);
			}, 1000);
		} else if (!xIsNext) {
			setTimeout(() => {
				const bestMove = getBestMove(squares);
				const newSquares = squares.slice();
				newSquares[bestMove] = 'O';
				handlePlay(newSquares);
			}, 1000);
		}
	}, [squares, xIsNext]);

	return (
		<div className='game'>
			<div className='leftside-wrapper'>
				<h1>
					Let's play the <br />
					tic-tac-toe <br />
					game?
				</h1>
				<NewGame handleClick={restartGame} />
			</div>
			<Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} isWinner={isWinner} />
		</div>
	);
}

function Winner({ winner }) {
	const winSymbol = winner();
	let text = 'win!';

	if (winSymbol === 'Tie') {
		text = null;
	}
	return (
		<div className='winner-window'>
			<h2 className='winner-text'>
				{winSymbol}
				{text}
			</h2>
		</div>
	);
}

function NewGame({ handleClick }) {
	return (
		<button className='new-game' onClick={handleClick}>
			Start A New Game
		</button>
	);
}

function Board({ squares, xIsNext, onPlay, isWinner }) {
	function handleClick(i) {
		if (squares[i] || calculateWinner(squares) || !xIsNext) {
			return null;
		}

		const nextSquares = squares.slice();

		if (xIsNext) {
			nextSquares[i] = 'X';
		} else {
			nextSquares[i] = 'O';
		}

		onPlay(nextSquares);
	}

	return (
		<div className='board-wrapper-wrapper'>
			{isWinner && <Winner winner={() => symbolToComponent(calculateWinner(squares))}></Winner>}
			<div className='board-wrapper'>
				<Square value={squares[0]} onSquareClick={() => handleClick(0)}></Square>
				<Square value={squares[1]} onSquareClick={() => handleClick(1)}></Square>
				<Square value={squares[2]} onSquareClick={() => handleClick(2)}></Square>
				<Square value={squares[3]} onSquareClick={() => handleClick(3)}></Square>
				<Square value={squares[4]} onSquareClick={() => handleClick(4)}></Square>
				<Square value={squares[5]} onSquareClick={() => handleClick(5)}></Square>
				<Square value={squares[6]} onSquareClick={() => handleClick(6)}></Square>
				<Square value={squares[7]} onSquareClick={() => handleClick(7)}></Square>
				<Square value={squares[8]} onSquareClick={() => handleClick(8)}></Square>
			</div>
		</div>
	);
}

function Cross() {
	return (
		<div className='icon cross'>
			<svg height='100' width='100' viewBox='0 0 100 100'>
				<line className='first' x1='15' y1='15' x2='85' y2='85' stroke='#FFB6C1' strokeWidth='10' strokeLinecap='round' />
				<line className='second' x1='15' y1='85' x2='85' y2='15' stroke='#FFB6C1' strokeWidth='10' strokeLinecap='round' />
			</svg>
		</div>
	);
}

function Circle() {
	return (
		<div className='icon circle'>
			<svg height='100' width='100' viewBox='0 0 100 100'>
				<circle r='38' cx='50' cy='50' stroke='#748ce1' strokeWidth='10' fill='transparent' strokeLinecap='round' />
			</svg>
		</div>
	);
}

function symbolToComponent(value) {
	if (value === 'X') {
		return <Cross></Cross>;
	} else if (value === 'O') {
		return <Circle></Circle>;
	} else if (value === 'tie') {
		return 'Tie';
	} else {
		return null;
	}
}

function Square({ value, onSquareClick }) {
	let Symbol = symbolToComponent(value);
	return (
		<button className='square' onClick={onSquareClick}>
			{Symbol}
		</button>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	if (squares.filter((i) => i != null).length === 9) {
		return 'tie';
	} else {
		return null;
	}
}

function getBestMove(board) {
	let bestScore = -Infinity;
	let bestMove = null;

	for (let i = 0; i < board.length; i++) {
		if (board[i] === null) {
			board[i] = 'O';
			const score = minimax(board, 0, false, 2);
			board[i] = null;

			if (score > bestScore) {
				bestScore = score;
				bestMove = i;
			}
		}
	}

	return bestMove;
}

function minimax(board, depth, isMaximizing, maxDepth) {
	const winner = calculateWinner(board);
	if (winner !== null || depth === maxDepth) {
		return winner === 'O' ? 1 : winner === 'X' ? -1 : 0;
	}

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let i = 0; i < board.length; i++) {
			if (board[i] === null) {
				board[i] = 'O';
				const score = minimax(board, depth + 1, false, maxDepth);
				board[i] = null;
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < board.length; i++) {
			if (board[i] === null) {
				board[i] = 'X';
				const score = minimax(board, depth + 1, true, maxDepth);
				board[i] = null;
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}

export default App;

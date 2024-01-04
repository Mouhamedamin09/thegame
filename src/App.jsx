import React, { useState, useEffect } from 'react';
import Board from "./components/Board";
import Scoreboard from './components/Scoreboard';
import Button from './components/Button';
import './App.css';

function App() {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const [xPlaying, setXPlaying] = useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [easymode, setEasymode] = useState(true);

  // Computer ("O" player) makes a move
  useEffect(() => {
    let timeout;
    if (!xPlaying && !gameOver) {
      timeout = setTimeout(() => {
        const computerMoveIndex = easymode ?  getRandomNullIndex(board) :bestMove(board) ;
        console.log(computerMoveIndex)
        if (computerMoveIndex !== -1) {
          handleBoxClick(computerMoveIndex);
        }
      }, 1000); // Wait for 1 second (1000 milliseconds)
    }

    return () => clearTimeout(timeout); // Clear the timeout if the component unmounts
  }, [xPlaying, board, gameOver]);

  const handleBoxClick = (boxIdx) => {
    if (board[boxIdx] !== null || gameOver) {
      return;
    }

    const updatedBoard = board.map((value, idx) => idx === boxIdx ? (xPlaying ? "X" : "O") : value);

    const winner = checkWinner(updatedBoard);
    if (winner) {
      updateScores(winner);
      setGameOver(true);
    } else if (!updatedBoard.includes(null)) {
      setGameOver(true); // It's a draw
    }

    setBoard(updatedBoard);
    console.log(board)
    setXPlaying(!xPlaying); // Toggle the turn
  };

  function getRandomNullIndex(board) {
    const nullIndices = board
      .map((value, index) => value === null ? index : null)
      .filter(index => index !== null);

    if (nullIndices.length === 0) {
      return -1;
    }

    return nullIndices[Math.floor(Math.random() * nullIndices.length)];
  }

  function checkWinner(board) {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [a, b, c] = WIN_CONDITIONS[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // 'X' or 'O'
      }
    }
    return null;
  }

  function updateScores(winner) {
    if (winner === 'X') {
      setScores({ ...scores, xScore: scores.xScore + 1 });
    } else if (winner === 'O') {
      setScores({ ...scores, oScore: scores.oScore + 1 });
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setXPlaying(true);
  }

  function bestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O"; // Simulate the move on a copy of the board
        let score = minimax(board, 0, false);
        board[i] = null; // Undo the move
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  const AlgoScores = {
    'X': -1,
    'O': 1,
    'tie': 0
  };

  function changeMode(){
      setEasymode(!easymode)
  }
  
  function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    if (result !== null) {
      return AlgoScores[result];
    } else if (!board.includes(null)) {
      return AlgoScores['tie'];
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  return (
    <div className="App">
      <Scoreboard scores={scores} xPlaying={xPlaying} />
      <Board board={board} onClick={handleBoxClick} />
      
        {gameOver &&<>  <div className='button-container'>
                        <Button onClick={resetGame} >Reset Game</Button>
                          </div>
                        <div className='button-container'>
                          <h1 className='question'>Want a Difficult mode?</h1>
                            </div>
                        <div className='button-container'>
                          <button onClick={changeMode} className={`mode ${easymode ? null :"click"}`} >change Mode</button>
                           </div>
        
        </> 
                     
        }
      
    </div>
  );
}

export default App;

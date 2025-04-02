import React, { useState, useEffect } from 'react';

// Styles as JavaScript objects
const gameContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '2rem 0',
};

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
  maxWidth: '300px',
  width: '100%',
};

const squareStyle = {
  aspectRatio: '1/1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  border: '2px solid #ccc',
  borderRadius: '8px',
  transition: 'all 0.2s',
};

const buttonStyle = {
  marginTop: '1.5rem',
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  borderRadius: '4px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
};

const statusStyle = {
  marginTop: '1rem',
  marginBottom: '1rem',
  fontSize: '1.25rem',
  fontWeight: 'bold',
};

export default function TicTacToe() {
  // State for the game board, current player, winner, and game status
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState('Next player: X');

  // Function to handle a square click
  const handleClick = (index) => {
    // Return early if square is filled or game is won
    if (board[index] || winner) {
      return;
    }

    // Create a copy of the board
    const newBoard = [...board];
    // Set the value of the clicked square
    newBoard[index] = isXNext ? 'X' : 'O';
    
    // Update the board state
    setBoard(newBoard);
    // Toggle player
    setIsXNext(!isXNext);
  };

  // Function to reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  // Check for a winner
  useEffect(() => {
    const calculateWinner = (squares) => {
      const lines = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal
        [2, 4, 6], // diagonal
      ];

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };

    const winner = calculateWinner(board);

    if (winner) {
      setWinner(winner);
      setStatus(`Winner: ${winner}`);
    } else if (board.every(square => square !== null)) {
      setStatus('Game ended in a draw');
    } else {
      setStatus(`Next player: ${isXNext ? 'X' : 'O'}`);
    }
  }, [board, isXNext]);

  return (
    <div style={gameContainerStyle}>
      <div style={statusStyle}>{status}</div>
      
      <div style={boardStyle}>
        {board.map((value, index) => (
          <div
            key={index}
            style={{
              ...squareStyle,
              backgroundColor: value ? (value === 'X' ? '#e6f7ff' : '#fff1e6') : '#f0f0f0',
              color: value === 'X' ? '#0070f3' : '#ff6b00',
            }}
            onClick={() => handleClick(index)}
          >
            {value}
          </div>
        ))}
      </div>

      <button 
        style={buttonStyle}
        onClick={resetGame}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
      >
        Reset Game
      </button>
    </div>
  );
} 
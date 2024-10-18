import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const createEmptyBoard = (rows, cols) => {
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        surroundingMines: 0,
      });
    }
    board.push(row);
  }
  return board;
};

const calculateMinesCount = (rows, cols) => {
  return Math.max(Math.floor(rows * cols * 0.15), 10);
};

const darkenColor = (hex, amount) => {
  let color = parseInt(hex.slice(1), 16);
  let r = (color >> 16) - amount * 255;
  let g = ((color >> 8) & 0x00FF) - amount * 255;
  let b = (color & 0x0000FF) - amount * 255;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

const App = ({ navigation }) => {
  const [boardSize, setBoardSize] = useState({ rows: 10, cols: 10 });
  const [minesCount, setMinesCount] = useState(calculateMinesCount(10, 10));
  const [board, setBoard] = useState(createEmptyBoard(10, 10));
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const timerRef = useRef(null);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const placeMines = (board, rows, cols, initialX, initialY) => {
    let minesToPlace = minesCount;

    const isInSafeZone = (x, y) => {
      return (
        x >= initialX - 1 && x <= initialX + 1 &&
        y >= initialY - 1 && y <= initialY + 1
      );
    };

    while (minesToPlace > 0) {
      const x = Math.floor(Math.random() * rows);
      const y = Math.floor(Math.random() * cols);

      if (!isInSafeZone(x, y) && !board[x][y].isMine) {
        board[x][y].isMine = true;
        minesToPlace--;
      }
    }
    return board;
  };

  const calculateSurroundingMines = (board, rows, cols) => {
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        if (!board[x][y].isMine) {
          let minesCount = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newX = x + i;
              const newY = y + j;
              if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && board[newX][newY].isMine) {
                minesCount++;
              }
            }
          }
          board[x][y].surroundingMines = minesCount;
        }
      }
    }
    return board;
  };

  const revealArea = (board, x, y, rows, cols) => {
    if (board[x][y].isRevealed || board[x][y].isFlagged) return board;
    board[x][y].isRevealed = true;

    if (board[x][y].isMine) {
      setIsGameOver(true);
      stopTimer();
      return board;
    }

    if (board[x][y].surroundingMines === 0 && !board[x][y].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newX = x + i;
          const newY = y + j;
          if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
            if (!board[newX][newY].isRevealed) {
              board = revealArea(board, newX, newY, rows, cols);
            }
          }
        }
      }
    }
    return board;
  };

  const handlePress = (x, y) => {
    if (board[x][y].isFlagged || isGameOver || isVictory) return;

    if (!gameStarted) {
      let newBoard = JSON.parse(JSON.stringify(board));

      newBoard = placeMines(newBoard, boardSize.rows, boardSize.cols, x, y);
      newBoard = calculateSurroundingMines(newBoard, boardSize.rows, boardSize.cols);
      newBoard = revealArea(newBoard, x, y, boardSize.rows, boardSize.cols);

      setBoard(newBoard);
      setGameStarted(true);
      startTimer();
    } else {
      setBoard(revealArea([...board], x, y, boardSize.rows, boardSize.cols));
    }
  };

  const handleFlag = (x, y) => {
    if (isGameOver || isVictory) return;

    const newBoard = [...board];

    if (!newBoard[x][y].isRevealed) {
      newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
      setBoard(newBoard);
    }
  };

  const handleBoardSizeChange = (newSize) => {
    const [newRows, newCols] = newSize.split('x').map(Number);
    const newMinesCount = calculateMinesCount(newRows, newCols);
    setBoardSize({ rows: newRows, cols: newCols });
    setMinesCount(newMinesCount);
    setBoard(createEmptyBoard(newRows, newCols));
    setGameStarted(false);
    setTimer(0);
    setTimerStarted(false);
    stopTimer();
    setIsGameOver(false);
    setIsVictory(false);
  };

  const resetGame = () => {
    setBoard(createEmptyBoard(boardSize.rows, boardSize.cols));
    setGameStarted(false);
    setTimer(0);
    setTimerStarted(false);
    stopTimer();
    setIsGameOver(false);
    setIsVictory(false);
  };

  const maxBoardWidth = screenWidth * 0.9;
  const maxBoardHeight = screenHeight * 0.7;
  const cellSize = Math.min(
    Math.floor(maxBoardWidth / boardSize.cols),
    Math.floor(maxBoardHeight / boardSize.rows)
  );

  const unrevealedColors = ['#6A0DAD', '#5A0BAA', '#4A0AA7', '#3A09A4', '#2A08A1', '#1A079E', '#0A069B'];
  const revealedColors = unrevealedColors.map(color => darkenColor(color, 0.2));

  const getUnrevealedColor = (rowIndex, boardSize) => {
    const step = Math.floor(rowIndex / (boardSize.rows / unrevealedColors.length));
    return unrevealedColors[step] || unrevealedColors[unrevealedColors.length - 1];
  };

  const getRevealedColor = (rowIndex, boardSize) => {
    const step = Math.floor(rowIndex / (boardSize.rows / revealedColors.length));
    return revealedColors[step] || revealedColors[revealedColors.length - 1];
  };

  useEffect(() => {
    if (!isGameOver && gameStarted) {
      const allNonMinesRevealed = board.every(row =>
        row.every(cell => (cell.isMine || cell.isRevealed))
      );
      if (allNonMinesRevealed) {
        setIsVictory(true);
        stopTimer();
      }
    }
  }, [board, gameStarted, isGameOver]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Picker
          selectedValue={`${boardSize.rows}x${boardSize.cols}`}
          onValueChange={handleBoardSizeChange}
          style={styles.picker}>
          <Picker.Item label="8x8" value="8x8" />
          <Picker.Item label="10x10" value="10x10" />
          <Picker.Item label="20x10" value="20x10" />
          <Picker.Item label="25x15" value="25x15" />
        </Picker>
        <Text style={styles.timerText}>Tiempo: {timer}s</Text>
      </View>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row' }}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell.isRevealed
                      ? getRevealedColor(rowIndex, boardSize)
                      : getUnrevealedColor(rowIndex, boardSize),
                    width: cellSize,
                    height: cellSize,
                  }
                ]}
                onPress={() => handlePress(rowIndex, colIndex)}
                onLongPress={() => handleFlag(rowIndex, colIndex)}
                delayLongPress={200}>
                {cell.isRevealed && !cell.isMine && (
                  <Text style={styles.cellText}>{cell.surroundingMines || ''}</Text>
                )}
                {cell.isFlagged && !cell.isRevealed && (
                  <Text style={styles.flagText}>🚩</Text>
                )}
                {cell.isRevealed && cell.isMine && (
                  <Text style={styles.mineText}>💣</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {isGameOver && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isGameOver}>
          <View style={styles.gameOverContainer}>
            <View style={styles.gameOverModal}>
              <Text style={styles.gameOverText}>¡Derrota!</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={resetGame}>
                  <Text style={styles.buttonText}>Jugar de nuevo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setIsGameOver(false);
                    navigation.navigate('Home');
                  }}>
                  <Text style={styles.buttonText}>Volver a Casa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {isVictory && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVictory}>
          <View style={styles.gameOverContainer}>
            <View style={styles.gameOverModal}>
              <Text style={styles.gameOverText}>¡Victoria!</Text>
              <Text style={styles.gameOverText2}>Tiempo: {timer}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={resetGame}>
                  <Text style={styles.buttonText}>Jugar de nuevo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setIsVictory(false);
                    navigation.navigate('Home');
                  }}>
                  <Text style={styles.buttonText}>Volver a Casa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: 200,
  },
  board: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  flagText: {
    fontSize: 20,
    color: 'red',
  },
  mineText: {
    fontSize: 20,
    color: 'black',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gameOverModal: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  gameOverText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameOverText2: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '80%',
  marginTop: 20,
  marginRight: 45,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PanResponder, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const BOARD_WIDTH = width * 0.9;
const BOARD_HEIGHT = BOARD_WIDTH * 1.45;
const GRID_SIZE_X = 25;
const GRID_SIZE_Y = Math.floor(GRID_SIZE_X * 1.5);
const CELL_SIZE = Math.floor(BOARD_WIDTH / GRID_SIZE_X);

const getRandomPosition = (snake) => {
  let position;
  do {
    position = { 
      x: Math.floor(Math.random() * GRID_SIZE_X), 
      y: Math.floor(Math.random() * GRID_SIZE_Y) 
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
};

const Snake = ({ navigation }) => { 
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(getRandomPosition(snake));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false); 
  const directionRef = useRef(direction);
  directionRef.current = direction;
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    loadMaxScore();
  }, []);

  const saveMaxScore = async (score) => {
    try {
      await AsyncStorage.setItem('@max_score', score.toString());
    } catch (e) {
      console.error();
    }
  };

  const loadMaxScore = async () => {
    try {
      const savedMaxScore = await AsyncStorage.getItem('@max_score');
      if (savedMaxScore !== null) {
        setMaxScore(parseInt(savedMaxScore, 10));
      }
    } catch (e) {
      console.error();
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !isGameOver && !isPaused,
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
        else if (dx < 0 && directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
      } else {
        if (dy > 0 && directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
        else if (dy < 0 && directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
      }
    },
  });

  const checkCollision = useCallback((head) => {
    if (head.x < 0 || head.x >= GRID_SIZE_X || head.y < 0 || head.y >= GRID_SIZE_Y) return true;
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (checkCollision(newHead)) {
      setIsGameOver(true);
      setShowGameOverPopup(true); 
      if (score > maxScore) {
        setMaxScore(score);
        saveMaxScore(score);
      }
      return;
    }

    const newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 1);
      setFood(getRandomPosition(newSnake));
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, checkCollision, score, maxScore, isPaused]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(getRandomPosition([{ x: 5, y: 5 }]));
    setDirection({ x: 1, y: 0 });
    setIsGameOver(false);
    setScore(0);
    setShowGameOverPopup(false); 
  };

  const startGame = () => {
    setIsPopupVisible(false);
    setIsPaused(false);
    resetGame();
  };

  return (
    <View style={styles.container} {...(!isGameOver && !isPaused ? panResponder.panHandlers : {})}>
{isPopupVisible && (
  <View style={styles.popupOverlay}>
    <View style={styles.popup}>
      <Text style={styles.popupText}>Puntuacion maxima: {maxScore}</Text>
      <TouchableOpacity onPress={startGame} style={styles.playButton}>
        <Icon name="play" size={50} color="#FFF" />
      </TouchableOpacity>
    </View>
  </View>
)}



      {isPopupVisible && <View style={styles.overlay} />}

      <View style={styles.board}>
        {snake.map((segment, index) => (
          <View 
            key={index} 
            style={[styles.snakeSegment, { 
              left: segment.x * CELL_SIZE, 
              top: segment.y * CELL_SIZE, 
              backgroundColor: index === 0 ? '#3DB5F5' : '#5468C1'
            }]} 
          />
        ))}

        <Icon 
          name="apple" 
          size={CELL_SIZE} 
          color="#ff6b6b" 
          style={[styles.food, { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }]} 
        />
        
        {showGameOverPopup && ( 
          <View style={styles.gameOverContainer}>
            <Text style={styles.scoreText}>Puntuacion final: {score}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.restartButton} onPress={resetGame} activeOpacity={0.7}>
                <Icon name="restart" size={30} color="#FFF" />
                <Text style={styles.restartText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')} activeOpacity={0.7}>
                <Icon name="home" size={30} color="#FFF" />
                <Text style={styles.homeText}>Inicio</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B699E2',
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#DDDDDD',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  snakeSegment: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'absolute',
    borderRadius: 5,
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#ff6b6b',
    position: 'absolute',
    borderRadius: CELL_SIZE / 2,
  },
  gameOverContainer: {
    position: 'absolute',
    top: '35%', 
    left: '10%',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignSelf: 'center',
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  restartButton: {
    backgroundColor: '#42a5f5',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginRight: 10,
  },
  restartText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  homeButton: {
    backgroundColor: '#42a5f5',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  homeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  popup: {
  width: '80%',
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#42a5f5',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  popupOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default Snake;

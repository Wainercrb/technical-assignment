/* eslint-disable react/no-array-index-key */
import { useCallback, useEffect, useState } from 'react';
import WordleBox from '../WordleBox';
import { Board } from '../../types';

const WORDLE_API_URL = 'https://api.frontendexpert.io/api/fe/wordle-words';

type TGameState = 'WIN' | 'LOSE' | 'LOADING' | 'READY' | 'ERROR' | 'NONE';

export interface KeyDownAction {
  [key: string]: () => void;
}

const buildBoard = (wordSize = 5, rowMin = 2, rowMax = 5): Board => {
  const rowLength = Math.floor(rowMin + Math.random() * (rowMax - rowMin + 1));
  const column = Array(wordSize).fill('');
  const row = Array(rowLength).fill('');

  return row.map(() =>
    column.map((item) => ({
      value: item as string,
      state: 'NONE',
    }))
  );
};

function WordleBoard(): JSX.Element {
  const [board, setBoard] = useState<Board>(buildBoard());
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const [guess, setGuess] = useState('');
  const [gameState, setGameState] = useState<TGameState>('NONE');

  useEffect(() => {
    const updateRowValues = (key: string) => {
      // prevent add item after column length
      if (!board[currentRow][currentColumn]) {
        return;
      }

      // prevent invalid characters
      if (!(key.length === 1 && key.match(/[a-z]/i))) {
        return;
      }

      const clonedBoard = [...board.map((row) => [...row])];
      clonedBoard[currentRow][currentColumn] = {
        value: key,
        state: 'NONE',
      };

      setBoard(clonedBoard);
      setCurrentColumn(currentColumn + 1);
    };

    const onBackspace = () => {
      // prevent remove item before position 0
      if (currentColumn - 1 < 0) {
        return;
      }
      const clonedBoard = [...board.map((row) => [...row])];
      clonedBoard[currentRow][currentColumn - 1].value = '';

      setBoard(clonedBoard);
      setCurrentColumn(currentColumn - 1);
    };

    const onEnter = () => {
      // Prevent enter if the row is not filled
      if (board[currentRow][currentColumn]) {
        return;
      }

      const clonedBoard = [...board.map((row) => [...row])];
      let userWin = true;

      for (let index = 0; index < clonedBoard[currentRow].length; index += 1) {
        const element = clonedBoard[currentRow][index];
        const isOnThePosition = element.value === guess[index];
        const isOnTheRow = guess.includes(element.value);

        if (userWin && !isOnThePosition) {
          userWin = false;
        }

        if (isOnThePosition) {
          clonedBoard[currentRow][index].state = 'ON-POSITION';
        } else if (isOnTheRow) {
          clonedBoard[currentRow][index].state = 'ON-ROW';
        }
      }

      if (userWin) {
        setGameState('WIN');
        return;
      }

      // check if the last row
      if (currentRow + 1 >= board.length) {
        setGameState('LOSE');
        return;
      }

      // prepare game for the next row
      setCurrentRow(currentRow + 1);
      setCurrentColumn(0);
      setBoard(clonedBoard);
    };

    const keyActions: KeyDownAction = {
      enter: onEnter,
      backspace: onBackspace,
    };

    const listener = ({ key }: KeyboardEvent) => {
      const actionName = key.toLocaleLowerCase();
      const actionFunction = keyActions[actionName];

      if (typeof actionFunction === 'function') {
        actionFunction();
        return;
      }

      updateRowValues(actionName);
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [currentColumn, currentRow, board, guess]);

  const getRandomWord = async () => {
    const data = await fetch(WORDLE_API_URL);
    const json = (await data.json()) as string[];

    if (!json || !json.length) {
      throw Error('Error getting the word list');
    }

    return json[Math.floor(Math.random() * json.length)].toLocaleLowerCase();
  };

  const initializeGame = useCallback(async () => {
    try {
      setGameState('LOADING');

      const gameWord = await getRandomWord();
      const gameBoard = buildBoard(gameWord.length);

      setBoard(gameBoard);
      setGuess(gameWord);
      setGameState('NONE');
      setCurrentRow(0);
      setCurrentColumn(0);
    } catch (error) {
      setGameState('ERROR');
      console.error(error);
    } finally {
      setGameState('READY');
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="board">
      <h3>Wordle</h3>
      <div className="wordle-header">
        {import.meta.env.VITE_WORDLE_DEV_ENV && (
          <div>
            <span>Your word is: {guess}</span>
          </div>
        )}
        {gameState === 'LOADING' && (
          <div>
            <span className="loading">Loading....</span>
          </div>
        )}
        {gameState === 'LOSE' ||
          (gameState === 'WIN' && (
            <button type="button" onClick={initializeGame}>
              Restart
            </button>
          ))}
      </div>

      {board.map((row, rowIdx) => (
        <div key={rowIdx} className="board-row">
          {row.map((column, columnIdx) => (
            <WordleBox key={`${rowIdx}-${columnIdx}`} item={column} />
          ))}
        </div>
      ))}

      <div className="wordle-footer">
        <span>{gameState === 'WIN' ? 'You Win :)' : ''}</span>
        <span>{gameState === 'LOSE' ? 'You Lose' : ''}</span>
      </div>
    </div>
  );
}

export default WordleBoard;

import { useEffect, useState } from 'react';
import WordleBox from '../WordleBox';
import { Board, INITIALIZE_ARRAY, BOARD_CONFIG } from '.';

export function WordleBoard(): JSX.Element {
  const [board, setBoard] = useState<Board>(INITIALIZE_ARRAY);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);

  useEffect(() => {
    const updateRowValues = (key: string) => {
      if (currentColumn >= BOARD_CONFIG.column) {
        return;
      }

      const clonedBoard = [...board.map((row) => [...row])];
      clonedBoard[currentRow][currentColumn] = key;

      console.log(clonedBoard);

      setBoard(clonedBoard);
      setCurrentColumn(currentColumn + 1);
    };

    const deleteColumn = () => {
      const clonedBoard = [...board.map((row) => [...row])];
      clonedBoard[currentRow][currentColumn] = '';

      setBoard(clonedBoard);
      setCurrentColumn(currentColumn - 1);
    };

    const listener = ({ key }: KeyboardEvent) => {
      if (key !== 'Enter') {
        updateRowValues(key);
        return;
      }

      if (key === 'Backspace') {
        deleteColumn();
        return;
      }

      setCurrentRow(currentRow + 1);
      setCurrentColumn(0);
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [currentColumn, currentRow, board]);

  return (
    <div className="board">
      <div>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="board-row">
            {row.map((column, columnIdx) => (
              <WordleBox key={`${rowIdx}-${columnIdx}`} char={column} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

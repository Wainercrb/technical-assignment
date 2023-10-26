import { BoardItem } from '../types';

interface Props {
  item: BoardItem;
}

function WordleBox({ item }: Props): JSX.Element {
  const filledClass = item.value ? 'wordle-box-active' : '';
  const stateClass = `wordle-box-${item.state}`;

  return (
    <div className={`wordle-box ${stateClass} ${filledClass}`}>
      {item.value}
    </div>
  );
}

export default WordleBox;

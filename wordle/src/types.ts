export type BoardItemState = 'ON-POSITION' | 'ON-ROW' | 'NONE';

export interface BoardItem {
  value: string;
  state: BoardItemState;
}

export type Board = BoardItem[][];

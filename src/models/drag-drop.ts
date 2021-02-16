export const kDataTextFormat = 'text/plain';

export interface Draggable {
  dragStartHandler: (event: DragEvent) => void;
  dragEndHandler: (event: DragEvent) => void;
}

export interface DropOnable {
  dragOverHandler: (event: DragEvent) => void;
  dragLeaveHandler: (event: DragEvent) => void;
  dropHandler: (event: DragEvent) => void;
}

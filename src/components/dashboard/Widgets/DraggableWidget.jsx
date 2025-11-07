import React from "react";
import { useDrag, useDrop } from "react-dnd";

/**
 * DraggableWidget
 * Props:
 *  - id
 *  - onMove(fromId, toId)
 *  - children
 */
const DraggableWidget = ({ id, children, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "widget",
    hover(item) {
      if (item.id !== id) {
        onMove(item.id, id);
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-[#0A0A0A] rounded-lg p-4 border border-white/10 backdrop-blur-md ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
};

export default DraggableWidget;

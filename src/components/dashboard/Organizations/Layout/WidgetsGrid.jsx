import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableWidget from "../../Widgets/DraggableWidget";

/**
 * WidgetsGrid
 * Props:
 *  - widgets: array
 *  - onMove(fromId, toId)
 *  - children components mapping by widget.type passed as render prop or used inside map
 * Usage:
 *  <WidgetsGrid widgets={widgets} onMove={handleMove}>
 *    {(widget) => (
 *      // render content for widget
 *    )}
 *  </WidgetsGrid>
 */
const WidgetsGrid = ({ widgets = [], onMove = () => {}, children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {widgets.map((widget) => (
          <DraggableWidget key={widget.id} id={widget.id} onMove={onMove}>
            <div className="h-64">
              <h3 className="text-lg font-thin mb-4 border-b border-white/10 pb-2">
                {widget.title}
              </h3>
              {/* delegate rendering to children function */}
              {typeof children === "function" ? children(widget) : null}
            </div>
          </DraggableWidget>
        ))}
      </div>
    </DndProvider>
  );
};

export default WidgetsGrid;

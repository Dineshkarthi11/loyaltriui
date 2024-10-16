import React from "react";
import { useDrag } from "react-dnd";

const CalendarEvent = ({ event }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CALENDAR_EVENT",
    item: { id: event.id, type: "CALENDAR_EVENT" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        border: "1px solid #000",
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: isDragging ? "#d3d3d3" : "white", // Change the background color during drag
      }}
    >
      {event.title}
    </div>
  );
};

export default CalendarEvent;

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

export default function Window({
  title = "Window",
  width = "300px",
  posX: initialPosX = 0,
  posY: initialPosY = 0,
  height = null,
  children,
}) {
  // Keep track of the old and new positions throughout the lifecycle of
  // component in order to position the window accurately.
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [posX, setPosX] = useState(initialPosX);
  const [posY, setPosY] = useState(initialPosY);
  const [dragStartPosX, setDragStartPosX] = useState(0);
  const dragOffsetX = useRef(0);
  const dragOffsetY = useRef(0);
  const [dragStartPosY, setDragStartPosY] = useState(0);
  const windowElement = useRef(null);

  function handleDragDown(ev) {
    ev.preventDefault();

    const { clientX, clientY } = ev;

    const rect = windowElement.current?.getBoundingClientRect();
    const dragOriginDelta = { x: rect.x - clientX, y: rect.y - clientY };

    // Otherwise, start dragging.
    // Subtract the drag co-ordinates from the origin of the Window, to account for the offset between the cursor
    // and the windows' origin when calculating the new position for a drag.
    dragOffsetX.current = dragOriginDelta.x;
    dragOffsetY.current = dragOriginDelta.y;
    setDragStartPosX(clientX + dragOffsetX.current);
    setDragStartPosY(clientY + dragOffsetY.current);
    setIsDragging(true);

    // (1) Set the drag-up event on the window instead of the title bar, in order
    // to ensure it always gets fired even if the mouse is outside the title
    // bar somehow during mouse-up.
    window.addEventListener("mouseup", handleDragUp);

    // (2) Add global mousemove event listener to track where to move the
    // dragged window to.
    window.addEventListener("mousemove", handleDrag);
  }

  function handleDrag(ev) {
    ev.preventDefault();

    let offsetX = dragOffsetX.current;
    let offsetY = dragOffsetY.current;

    console.log({ offsetX, offsetY, posX, posY });

    // On mouse drag, set the new window position to the new mouse origin,
    // taking into account the mouse delta from the window origin at drag start.
    setPosX(ev.clientX + offsetX);
    setPosY(ev.clientY + offsetY);
  }

  function handleDragUp(ev) {
    ev.preventDefault();

    // Resets the drag state to default values.
    setIsDragging(false);
    setDragStartPosX(0);
    setDragStartPosY(0);
    dragOffsetX.current = 0;
    dragOffsetY.current = 0;

    // Finally, remove the global event listeners.
    window.removeEventListener("mouseup", handleDragUp);
    window.removeEventListener("mousemove", handleDrag);
  }

  function handleClose(ev) {
    ev.preventDefault();
    setIsOpen(false);
  }

  return (
    isOpen && (
      <div
        className="window"
        ref={windowElement}
        style={{
          position: "absolute",
          width,
          height,
          transform: `translate(${posX}px, ${posY}px)`,
        }}
      >
        <div
          className="title-bar"
          onMouseDown={handleDragDown}
          // onMouseUp={handleDragUp} see (1)
          // onMouseMove={handleDrag} see (2)
        >
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onClick={handleClose}></button>
          </div>
        </div>

        <div className="window-body">{children}</div>
      </div>
    )
  );
}

Window.propTypes = {
  title: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  marginTop: PropTypes.number,
  marginLeft: PropTypes.number,
};

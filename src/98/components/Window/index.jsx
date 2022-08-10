import React, { useState, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./index.css";

const Window = forwardRef(
  (
    {
      id,
      title = "Window",
      width = "300px",
      height = null,
      x = 0,
      y = 0,
      focused = false,
      children,
      className,
    },
    ref // Used to allow the WindowManager access to the Window DOM element.
  ) => {
    // Keep track of the old and new positions throughout the lifecycle of
    // component in order to position the window accurately.
    const [isMinimized, setIsMinimized] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [posX, setPosX] = useState(x);
    const [posY, setPosY] = useState(y);
    const dragOffsetX = useRef(0);
    const dragOffsetY = useRef(0);

    function handleDragDown(ev) {
      ev.preventDefault();
      if (isMinimized) return;

      const { clientX, clientY } = ev;

      /**
       * ? At this point, we're needing to also set the focus of all other windows to false. How can we move the drag handlers
       * ? up to, say, the WindowManager level, in order to allow it to be responsible for updating focus on drag of a new window and pass down a new
       * ? focused prop? Maybe we should just have the WindowManager set up an event handler for every Window on useEffect() for mousedown, mousemove, mouseup?
       * ? And use the ev.target for detecting the hit-point of the click on the window? (eg: to prevent the window from being draggable by the content).
       */
      // setIsFocused(true);

      // Grab the bounds of the window.
      const rect = windowElement.current.getBoundingClientRect();

      // Otherwise, start dragging.
      // Subtract the drag co-ordinates from the origin of the Window, to account for the offset between the cursor
      // and the windows' origin when calculating the new position for a drag.
      dragOffsetX.current = rect.x - clientX;
      dragOffsetY.current = rect.y - clientY;

      // (1) Set the drag-up event on the window instead of the title bar, in order
      // to ensure it always gets fired even if the mouse is outside the title
      // bar somehow during mouse-up.
      // window.addEventListener("mouseup", handleDragUp);

      // (2) Add global mousemove event listener to track where to move the
      // dragged window to.
      // window.addEventListener("mousemove", handleDrag);
    }

    function handleDrag(ev) {
      ev.preventDefault();

      if (isMinimized) return;

      let offsetX = dragOffsetX.current;
      let offsetY = dragOffsetY.current;

      // On mouse drag, set the new window position to the new mouse origin,
      // taking into account the mouse delta from the window origin at drag start.
      setPosX(ev.clientX + dragOffsetX.current);
      setPosY(ev.clientY + dragOffsetY.current);
    }

    function handleDragUp(ev) {
      ev.preventDefault();
      if (isMinimized) return;

      // Resets the drag state to default values.
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

    function handleMinimize(ev) {
      ev.preventDefault();
      setIsMinimized(!isMinimized);
    }

    let windowStyles = {
      position: "absolute",
      overflow: "hidden",
      width,
      height: isMinimized ? 21 : height,
      zIndex: focused ? 10 : 0,
    };

    let finalX = posX;
    let finalY = posY;
    if (isMinimized) {
      finalX = 0;
      finalY = 0;
      windowStyles = {
        ...windowStyles,
        bottom: 0,
      };
    }

    windowStyles = {
      ...windowStyles,
      transform: `translate(${finalX}px, ${finalY}px)`,
    };

    return (
      isOpen && (
        <div
          id={id}
          className={cx("window", className)}
          ref={ref}
          style={windowStyles}
        >
          <div className={cx("title-bar", !focused && "inactive")}>
            <div className="title-bar-text">{title}</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>

          <div className="window-body">{children}</div>
        </div>
      )
    );
  }
);

Window.propTypes = {
  title: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  marginTop: PropTypes.number,
  marginLeft: PropTypes.number,
};

export const WindowType = {
  DEFAULT: "default",
  PROFILE: "profile",
  LASTFM: "lastfm",
};

export default Window;

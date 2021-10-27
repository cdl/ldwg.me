import React from "react";

export default function Window({
  title = "Window",
  width = "300px",
  height = null,
  marginTop = null,
  marginLeft = null,
  children,
}) {
  return (
    <div
      className="window"
      draggable={true}
      style={{ width, height, marginTop, marginLeft }}
    >
      <div className="title-bar">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>

      <div className="window-body">{children}</div>
    </div>
  );
}

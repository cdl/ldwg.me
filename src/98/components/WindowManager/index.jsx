import React, { useEffect, useState, useRef, Component } from "react";
import { v4 } from "uuid";
import { useDesktop, DesktopContext } from "../../context/desktop";
import Window, { WindowType } from "../Window";

import Profile from "../../windows/Profile";
import Lastfm from "../../windows/Lastfm";

export default function WindowManager() {
  const state = useDesktop();

  // Used to keep track of DOM elements for each window rendered. We then use these to determine whether things like
  // clicks/drags/etc fall within the focused window.
  const windowsRef = useRef([]);

  const [isDragging, setIsDragging] = useState(state.isDragging);
  const [focused, setFocused] = useState(state.focused);

  function handleDragDown(ev) {
    if (
      !ev.target.classList.contains("title-bar") &&
      !ev.target.parentElement?.classList.contains("title-bar")
    ) {
      return;
    }

    // Parent is not a valid window, return early.
    const parent = ev.target.parentElement;
    const windowId = parent.id;
    if (!parent || !parent.id) return;

    ev.preventDefault();

    if (windowId) {
      setFocused(parseInt(windowId));
    }
  }

  function handleDrag(ev) {
    ev.preventDefault();
  }

  function handleDragUp(ev) {
    ev.preventDefault();
  }

  // Set up global event handlers for mousedown, mousemove, and mouseup.
  // Used for click & drag interactions with Window components.
  useEffect(() => {
    window.addEventListener("mousedown", handleDragDown);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("touch", handleDrag);
    window.addEventListener("mouseup", handleDragUp);

    return function () {
      window.removeEventListener("mousedown", handleDragDown);
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragUp);
    };
  });

  /**
   * Return the JSX object for a given window type and object.
   *
   * @param {WindowType} type
   * @param {Object} w
   * @param {string} w.id
   * @param {string} w.title
   * @param {React.ReactElement} w.content
   * @returns
   */
  function getWindowForType(type, w) {
    switch (type) {
      case WindowType.PROFILE:
        return <Profile id={w.id} focused={focused === w.id} key="profile" />;
      case WindowType.LASTFM:
        return <Lastfm id={w.id} focused={focused === w.id} key="lastfm" />;
      default:
        return (
          <Window
            id={w.id}
            title={w.title}
            focused={focused === w.id}
            key={w.id}
          >
            {w.content}
          </Window>
        );
    }
  }

  // Map through currently open windows, rendering each of them.
  const windows = Object.values(state.windows)
    .map((w) => {
      return () => getWindowForType(w.type, w);
    })
    .map((ArbitraryWindow, i) => {
      return (
        <ArbitraryWindow ref={(el) => (windowsRef.current[i] = el)} key={i} />
      );
    });

  return <>{windows}</>;
}

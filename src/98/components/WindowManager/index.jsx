import React, { useEffect, useState } from "react";
import { useDesktop } from "../../context/desktop";
import Window, { WindowType } from "../Window";
import ErrorBoundary from "../ErrorBoundary";

import Profile from "../../windows/Profile";
import Lastfm from "../../windows/Lastfm";

export default function WindowManager() {
  const state = useDesktop();
  const [focused, setFocused] = useState(state.focused);

  function handleDragDown(ev) {
    // TODO: We should also handle clicks of the window to focus it without dragging.
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
        return (
          <ErrorBoundary key="profile" fallbackMessage="Failed to load profile">
            <Profile id={w.id} focused={focused === w.id} />
          </ErrorBoundary>
        );
      case WindowType.LASTFM:
        return (
          <ErrorBoundary key="lastfm" fallbackMessage="Failed to load Last.fm data">
            <Lastfm id={w.id} focused={focused === w.id} />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary key={w.id} fallbackMessage="Window failed to load">
            <Window
              id={w.id}
              title={w.title}
              focused={focused === w.id}
            >
              {w.content}
            </Window>
          </ErrorBoundary>
        );
    }
  }

  const windows = Object.values(state.windows).map((w) =>
    getWindowForType(w.type, w),
  );

  return <>{windows}</>;
}

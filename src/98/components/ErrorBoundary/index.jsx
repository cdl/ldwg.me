import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import styles from "./index.module.css";

function DefaultFallback({ error, resetErrorBoundary }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3>Something went wrong</h3>
      <pre>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

const ErrorBoundary = ({ children, fallback, onError, onReset }) => (
  <ReactErrorBoundary
    FallbackComponent={fallback || DefaultFallback}
    onError={onError}
    onReset={onReset}
  >
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;

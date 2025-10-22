import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  /**
   * Updates the state so the next render will show the fallback UI.
   *
   * @param {Error} error - The error that was thrown.
   * @returns {State} The new state.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Logs the error to an error reporting service.
   *
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - An object with a `componentStack` key containing information about which component threw the error.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  /**
   * Renders the fallback UI if an error has occurred, otherwise renders the children.
   *
   * @returns {React.ReactNode} The rendered component.
   */
  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong.</h1>
                <p className="text-gray-300 mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
                <details className="text-left bg-gray-700 p-2 rounded text-sm text-gray-400">
                    <summary>Error Details</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.error?.toString()}
                    </pre>
                </details>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from "react";

interface State {
  hasError: boolean;
}

export default class ErrorBoundary
extends React.Component<
  React.PropsWithChildren,
  State
> {

  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {

    return {
      hasError: true,
    };

  }

  componentDidCatch(
    error: Error,
    info: React.ErrorInfo
  ) {

    console.error(
      error,
      info
    );

  }

  render() {

    if (
      this.state.hasError
    ) {

      return (
        <div className="p-4 text-red-400">
          Renderer failed.
        </div>
      );

    }

    return this.props.children;

  }
}
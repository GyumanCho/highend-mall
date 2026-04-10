// React Error Boundary — 런타임 크래시를 친절한 에러 화면으로 폴백.
import { Component, type ReactNode } from "react";
import { ErrorState } from "./error-state";

interface Props {
  readonly children: ReactNode;
  readonly onReset?: () => void;
}

interface State {
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
    // TODO Phase 5: Sentry / Bugsnag 연동
  }

  reset = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <ErrorState
          title="Unexpected error"
          message={this.state.error.message || "An unknown error occurred."}
          onRetry={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

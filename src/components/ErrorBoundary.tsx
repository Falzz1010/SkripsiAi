import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            icon={<RefreshCw className="w-5 h-5" />}
          >
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

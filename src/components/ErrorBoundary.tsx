import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Only log errors in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#0a0b0d',
          padding: '16px'
        }}>
          <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>Oops!</h1>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f9fafb', marginBottom: '8px' }}>Something went wrong</h2>
              <p style={{ color: '#9ca3af' }}>
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: '#0a0b0d',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1f2937',
                  color: '#f9fafb',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                Go to Home
              </button>
            </div>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginTop: '24px', textAlign: 'left', backgroundColor: '#1f2937', padding: '16px', borderRadius: '8px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', color: '#9ca3af' }}>
                  Error Details (Dev Only)
                </summary>
                <pre style={{ marginTop: '8px', fontSize: '0.75rem', overflow: 'auto', color: '#ef4444' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

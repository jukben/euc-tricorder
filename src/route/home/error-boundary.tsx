import React from 'react';
import { Text } from 'react-native';

const initState = { hasError: false };

export class ErrorBoundary extends React.Component<React.FC, typeof initState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}

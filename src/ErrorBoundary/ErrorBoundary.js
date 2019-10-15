import React from 'react'
import './ErrorBoundary.css'


export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true}
  }

  render() {
    if (this.state.hasError) {      
      return (
        <div className="errorPage">
          <h2 className="errorMessage">Something went wrong. Please try again later.</h2>
        </div>
      );
    }
    return this.props.children;
  }  
}

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

class App extends Component {
    
  async componentWillMount() {
  }
  
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <p>
        Main app
        </p>
      </div>
    ); 
  }
}

export default withRouter(App);
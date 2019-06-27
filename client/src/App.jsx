import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import QueueForm from './QueueForm.jsx';

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
        <QueueForm></QueueForm>
      </div>
    ); 
  }
}

export default withRouter(App);
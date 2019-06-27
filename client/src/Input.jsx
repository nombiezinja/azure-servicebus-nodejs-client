import React, {Component} from 'react';

class Input extends Component {
  
  constructor(props){
    super(props);
    this.state = {
    };
  }
  
  render(){    
    return (
      <div>
        <input onChange={this.props.handler}></input> 
      </div>
    );
  }
}

export default Input;
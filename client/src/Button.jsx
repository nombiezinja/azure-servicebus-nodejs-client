import React, {Component} from 'react';

class Button extends Component {
  
  constructor(props){
    super(props);
    this.state = {
    };
  }

  handleInput = (input) => {
    console.log(event.target.value)
    this.setState({QueueName:event.target.value});
  }

  
  render(){    
    return (
      <div>
        <button onClick={this.props.handler}>Submit</button>
      </div>
    );
  }
}

export default Button;
import React, {Component} from 'react';
import Input from './Input.jsx';
import Button from './Button.jsx';

class QueueForm extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      QueueName: "Default"
    };
    this.handleClickButton = this.handleClickButton.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleClickButton = () => {
  }

  handleInput = (event) => {
    console.log("hanlde input runs")
    this.setState({QueueName:event.target.value});
  }

  render(){    
    return (
      <div>
        Enter Azure Service Bus Queue Name:
        <Input handler = {this.handleInput}/>
      </div>
    );
  }
}

export default QueueForm;
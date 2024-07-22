// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';

function noop() {}

interface InputUrlProps {
  value?: string;
  onChange?: (string) => void;
}

export default class InputUrl extends Component<InputUrlProps> {
  static defaultProps = {
    onChange: noop,
    value: ''
  };

  state = {
    websiteUrl: "",
    isValid: true
  };


  validateWebsiteUrl = (urlString) => {
    try { 
      return Boolean(new URL(urlString)); 
    }
    catch(e){ 
      return false; 
    }
  };

  changeUrl = (e) => {
    const { value } = e.target;
    const isValid = !value || this.validateWebsiteUrl(value);

    this.setState({
      websiteUrl: value,
      isValid,
    });

    if(this.props.onChange && isValid){
        this.props.onChange(value);
    }
  };


  render() {
    return (
        <form>
          <input
            type="text"
            value={this.props.value}
            onChange={this.changeUrl}
          />
          {!this.state.isValid && (
            <div style={{ color: "red" }}>URL is invalid</div>
          )}
        </form>
    );
  }
}

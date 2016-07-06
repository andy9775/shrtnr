/*
 URL input form
 */

import React from 'react';
import styles from './style';
import axios from 'axios';
import NotificationSystem from 'react-notification-system';

export default class URLForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: 'Submit',
      url: '',
      shortUrl: ''
    };

    this.handleInputFormChange = this.handleInputFormChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  render() {
    return (
      <div style={ styles.container }>
        <NotificationSystem ref="notify"/>
        <div style={ styles.infoContainer }>
          <div style={ styles.textContainer }>
            Submit a link to shorten
          </div>
        </div>
        <form onSubmit={ this.submitForm }>
          <div style={ styles.textInputContainer }>
            <input ref="urlInput"
                   type="text"
                   placeholder={ 'Paste a link to shorten it' }
                   style={ styles.textInput }
                   onChange={ this.handleInputFormChange }/>
            <button style={ styles.submitButton }>
              { this.state.buttonText }
            </button>
          </div>
        </form>
      </div>
    );
  }

  handleInputFormChange(e) {
    let buttonText = this.state.buttonText;
    if (buttonText == 'Copy') {
      buttonText = 'Submit';
    }
    this.setState({
      url: e.target.value,
      buttonText: buttonText
    });
  }

  submitForm(e) {
    e.preventDefault();
    let buttonText = this.state.buttonText;
    if (buttonText == 'Submit') {
      axios.post('/api/v1/urls', {longUrl: this.state.url})
        .then(response => {
          this.refs.urlInput.value = response.data.shortUrl;
          // TODO check if copy is supported in the current browser
          this.setState({buttonText: 'Copy', shortUrl: response.data.shortUrl});
        })
        .catch(response => {
          this.refs.notify.addNotification({
            title: 'Error: ' + (JSON.parse(response.data).errorMessage || ''),
            message: 'An error occurred submitting the request. Please try again',
            level: 'error',
            position: 'tl'
          });
        });
    } else if (buttonText == 'Copy') {
      this.refs.urlInput.select();
      document.execCommand('copy');
    }
  }

}

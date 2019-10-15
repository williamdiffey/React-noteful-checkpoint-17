import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import { withRouter } from 'react-router-dom'
import './AddFolder.css'
import config from '../config'
import AppContext from '../Context/AppContext'
import ValidationError from '../ValidationError'


class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameValid: false,
      formValid: false,
      validationMessages: {
        name: ""
      }
    }
  }

  updateFolderName = (name) => {
    this.setState({name}, () => {this.validateName(name)});
  }

  validateName = (fieldValue) => {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.name = 'Name must be at least 3 characters long';
        hasError = true;
      } else {
        fieldErrors.name = '';
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.validateForm );

  }

  validateForm = () => {
    this.setState({
      formValid: this.state.nameValid
    });
  }

  addFolderRequest = (callback) => {
    const folder = {
      name: this.state.name}

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
        throw error
        })
      }
      return res.json()
    })
    .then(newFolder => {
      callback(newFolder)
    })
    .catch(error => alert(error))
  };

  render() {
    return (
      <AppContext.Consumer>
        {(context) => ( 
          <section className='AddFolder'>
            <h2>Create a folder</h2>
            <NotefulForm onSubmit={(e) => {
              e.preventDefault();
              this.addFolderRequest(context.addFolder);
              this.props.history.push('/')
            }}>
              <div className='field'>
                <label htmlFor='folder-name-input'>
                  Name
                </label>
                <input type='text' id='folder-name-input' onChange={e => this.updateFolderName(e.target.value)} />
                <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
              </div>
              <div className='buttons'>
                  <button type='submit' disabled={!this.state.formValid}>
                    Add Folder
                  </button>
              </div>
            </NotefulForm>
          </section>
      )}
      </AppContext.Consumer>
    )
  }
}

export default withRouter(AddFolder);

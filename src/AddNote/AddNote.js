import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import NotefulForm from '../NotefulForm/NotefulForm'
import ValidationError from '../ValidationError'
import AppContext from '../Context/AppContext'
import config from '../config'
import './AddNote.css'


class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      content: "",
      folderId: null,
      nameValid: false,
      folderIdValid: false,
      formValid: false,
      validationMessages: {
        name: '',
        folderId: ''
      }
    }
  }

  updateName(name) {
    this.setState({name}, () => {this.validateName(name)});
  }

  updateContent(content) {
    this.setState({content})
  }

  updateFolderId(folderId) {
    this.setState({folderId}, () => {this.validateFolderId(folderId)});
  }

  validateName(fieldValue) {
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
    }, this.formValid );

  }

  validateFolderId(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue === "..." || fieldValue === null) {
      fieldErrors.folderId = 'Folder choice is required';
      hasError = true;
    } else {
        fieldErrors.folderId = '';
        hasError = false;
      }

    this.setState({
      validationMessages: fieldErrors,
      folderIdValid: !hasError
    }, this.formValid );

  }


  formValid() {
    this.setState({
      formValid: this.state.nameValid && this.state.folderIdValid 
    });
  }


  addNoteRequest = (callback) => {
    const newNote = {
      name: this.state.name,
      content: this.state.content,
      folderId: this.state.folderId,
      modified: new Date(),
    }

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
        throw error
        })
      }
      return res.json()
    })
    .then(addedNote => {
      callback(addedNote);
    })
    .catch(error => alert(error))

  }

  render() {
    return (
      <AppContext.Consumer>
        {(context) => ( 
          <section className='AddNote'>
            <h2>Create a note</h2>
            <NotefulForm onSubmit={e => {
              e.preventDefault();
              this.addNoteRequest(context.addNote)
              this.props.history.push(`/folder/${this.state.folderId}`)
            }}>
              <div className='field'>
                <label htmlFor='note-name-input'>
                  Name
                </label>
                <input type='text' id='note-name-input' onChange={e => this.updateName(e.target.value)} />
                <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
              </div>
              <div className='field'>
                <label htmlFor='note-content-input'>
                  Content
                </label>
                <textarea id='note-content-input' onChange={e => 
                this.updateContent(e.target.value)}/>
              </div>
              <div className='field'>
                <label htmlFor='note-folder-select'>
                  Folder
                </label>
                <select id='note-folder-select' onChange={e => 
                this.updateFolderId(e.target.value)}>
                  <option value={null}>...</option>
                  {context.folders.map(folder =>
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  )}
                </select>
                <ValidationError hasError={!this.state.folderIdValid} message={this.state.validationMessages.folderId}/>
              </div>
              <div className='buttons'>
                <button type='submit' disabled={!this.state.formValid}>
                  Add note
                </button>
              </div>
            </NotefulForm>
          </section>
        )}
      </AppContext.Consumer>
    )
  }
}

export default withRouter(AddNote);

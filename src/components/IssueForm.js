import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Form } from 'semantic-ui-react'
import useFormFields from '../hooks/useFormFields';
import { ADD_ISSUE, ADD_ISSUE_INDEX, UPDATE_USER, UPDATE_TITLE, UPDATE_BODY, SET_KEY_HOLDER } from '../store/type';
import '../resources/IssueForm.css';
import { withRouter } from 'react-router-dom';

const IssueForm = props => {

  const dispatch = useDispatch()
  const instructionTitle = "Be very descriptive with the title of your question."
  const instructionPost = "Share your issue with others here.\nWhen you post a code snippet please add the special characters ``` before and after your code snippet.\nThis way the code can be displayed on the proper format of the language of your choice:\n```\n const sample = () => {\n    console.log('Issue me this?')\n }\n\n ``` \nThank you for sharing!"
  const currentUser = useSelector(state => state.user.keyHolder)

  const [ alertHeader, setAlertHeader ] = useState("")
  const [ alertStatus, setAlertStatus ] = useState(false)
  const [ message, setMessage ] = useState([])

  const [ fields, handleFieldChange ] = useFormFields({
    formTitle: "",
    formBody: ""
  })
  
  const updateFields = () => {
    if (fields.formTitle === "") {
      fields.formTitle = props.dataTitle
    } 
    if (fields.formBody === "") {
      fields.formBody = props.dataBody
    } 

    dispatch({ type: UPDATE_TITLE, payload: fields.formTitle })
    dispatch({ type: UPDATE_BODY, payload: fields.formBody })
  }

  props.isUpdateForm && updateFields()
    
  const addIssue = event => {
    event.preventDefault()
    
    const newIssue = {
      title: fields.formTitle,
      issue_body: fields.formBody,
      syntax: 'javascript'
    }

    fetch("http://localhost:3000/api/v1/issues/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({issue: newIssue, id: currentUser.id})
    })
      .then(r => r.json())
      .then(data => {
        if (data.errorStatus) {
          handleMessages(data)
        } else {
          const { issue, user } = data

          dispatch({ type: ADD_ISSUE, payload: issue })
          dispatch({ type: ADD_ISSUE_INDEX, payload: issue })
          dispatch({ type: UPDATE_USER, payload: user })
          dispatch({ type: SET_KEY_HOLDER, payload: user })
          props.history.push(`/issues`)
        }
      })
  }

  const handleMessages = data => {
    setAlertHeader(data.header)
    setAlertStatus(true)
    handleDismissCountDown()
    setMessage(data.error)
  }

  const renderAlertMessage = () => {
    return message.map(message => <li className="content">{message}</li> )
  }

  const handleDismissOnClick = () => {
    setAlertStatus(false)
  }

  const handleDismissCountDown = () => {
    setTimeout(() => {
      setAlertStatus(false)
    }, 4000)
  }

  return (
    <div id="IssueForm-Container">
      <Grid>
        <Grid.Row>
          <Grid.Column width={12} className="IssueForm-Grid-Wrapper">
            <Form onSubmit={props.displayContent ? addIssue : null}>
              {
                props.dataTitle || props.newIssueForm ? 
                <Form.Group widths='equal'>
                  <Form.Input 
                    fluid 
                    name="formTitle" 
                    defaultValue={props.dataTitle} 
                    placeholder={instructionTitle} 
                    onChange={handleFieldChange}
                  />
                </Form.Group> : null
              }
              <Form.TextArea 
                name="formBody" 
                style={{height: "350px"}}
                onChange={handleFieldChange}
                defaultValue={props.dataBody ? props.dataBody : undefined}
                placeholder={instructionPost} />
              { 
                props.displayContent &&
                <Form.Button positive>Post Issue</Form.Button>
              }
              {
                (alertStatus && !!message) && 
                  <div className="ui negative message">
                    <i className="close icon" onClick={handleDismissOnClick}></i>
                    <div className="header">
                      {alertHeader}
                    </div>
                    <ul className="list">
                      {message.length !== 0 ? renderAlertMessage() : null}
                    </ul>
                  </div>
              }
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default withRouter(IssueForm);
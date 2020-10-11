import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import useFormFields from '../hooks/useFormFields';
import { SET_KEY_HOLDER } from '../store/type';
import '../resources/Login.css';

const Login = props => {

  const dispatch = useDispatch()
  const [ fields, handleFieldChange ] = useFormFields({
    email: "",
    password: ""
  })
  const [ alertHeader, setAlertHeader ] = useState("")
  const [ alertStatus, setAlertStatus ] = useState(false)
  const [ message, setMessage ] = useState([])

  const handleMessages = data => {
    setAlertHeader(data.header)
    setAlertStatus(true)
    handleDismissCountDown()
    setMessage(data.message)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const loginUser = {
      email: fields.email.toLowerCase(),
      password: fields.password
    }

    // make a fetch request to request to login the user - the fetch will be to the custom route "/login"
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginUser)
    })
    .then(r => r.json())
    .then(data => {
      if (data.type === "negative") {
        handleMessages(data)
      } else {
        // A) deconstruct assignment - user and token
        // B) set the key holder in the store
        // C) set localStorage to token
        // D) send logged in user to the issues page
        const { user, token } = data
        dispatch({ type: SET_KEY_HOLDER, payload: user })
        localStorage.token = token
        props.history.push('/issues')
      }
    })
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
    <div className="ui container Login-container" onSubmit={handleSubmit}>
        <div className="ui grid">
          <form className="ui form six wide column centered raised segment Login-form">
            <h1 className="ui center aligned header">Login</h1>
            <div className="field">
              <label>Email</label>
              <input name="email" placeholder="email" onChange={handleFieldChange} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" autoComplete="current-password" placeholder="Password" onChange={handleFieldChange} />
            </div>
            <button type="submit" className="ui button green">Login</button>
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
          </form>
        </div>
    </div>
  );
}

export default withRouter(Login);

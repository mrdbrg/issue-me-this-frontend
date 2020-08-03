import React, { Component } from 'react';
// import './NewIssueForm.css';

class NewIssueForm extends Component {

  state = {
    title: "",
    issueBody: ""
  }

  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  addIssue = (event) => {
    event.preventDefault()
    
    const data = {
      title: this.state.title,
      issue_body: this.state.issueBody
    }

    console.log("DATA:", data)

    fetch("http://localhost:3000/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({issue: data, id: this.props.currentUser.id})
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          this.props.handleMessages(data)
        } else {
          this.props.handleNewIssue(data)
          this.props.history.push(`/issues`)
        }
      })
  }

  render() {
    console.log("NEW ISSUE FORM:", this.state)
    return (
      <div className="ui container">
        <h1 className="ui center aligned header">New Issue</h1>
        <form className="ui large form" onSubmit={this.addIssue}>
          <div className="equal width fields">
            <div className="field">
              <label>Title</label>
              <input
                name="title" placeholder="Issue title"
                onChange={this.handleOnChange}
                value={this.state.title}
              />
            </div>
          </div>
          <div className="five field">
            <label>Issue</label>
            <textarea
              placeholder="Share your issue and let others in our community help you find a solution"
              name="issueBody"
              rows="10"
              onChange={this.handleOnChange}
              value={this.state.issueBody}
            />
          </div>
          <button type="submit" className="ui button">Submit Issue</button>
          <div className="ui hidden divider"></div>
        </form>
      </div>
    );
  }
}

export default NewIssueForm;
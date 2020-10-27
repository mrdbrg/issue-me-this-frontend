import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Icon, Button, Card, Image, Divider, Modal } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import { DELETE_ISSUE, UPDATE_ISSUE, UPDATE_TITLE, UPDATE_BODY, SET_KEY_HOLDER, UPDATE_LIKES } from '../store/type';
import IssueForm from './IssueForm';
import CreateHighlight from '../helpers/CreateHighlight';
import '../resources/Issue.css';

const Issue = props => {
  
  const dispatch = useDispatch() 
  const [ open, setOpen ] = useState(false)
  const [ displayLikeStatus, setDislayLikeStatus ] = useState(false)
  const [ thumbsUpOrDown, setThumbsUpOrDown ] = useState(false)

  const likeStore = useSelector(state => state.like.likes)

  const currentUser = useSelector(state => state.user.keyHolder)
  const issueTitle = useSelector(state => state.issue.issueTitle)
  const issueBody = useSelector(state => state.issue.issueBody)

  const { id, title, comments, issue_body, syntax, user } = props.issue
  const totalComments = comments.length
  const imgUrl = `https://semantic-ui.com/images/avatar/small/${user.avatar}.jpg`


  useEffect(() => {
    setDislayLikeStatus(currentUser && currentUser.like_issues.some(issue => issue.issue_id === id))
    setThumbsUpOrDown(likeStore && likeStore.some(like => like.issue.id === id && like.is_like === true))

  }, [currentUser, id, likeStore])

  console.log("ThumbsUpOrDown BY USER --->", thumbsUpOrDown)
  console.log("displayLikeStatus --->", displayLikeStatus)
  console.log("THE CURRENT USER: ---->", currentUser && currentUser)
  
  // console.log("ISSUE STORE --->", likeStore)
  // console.log("FOUND THIS ISSUE LIKE --->", currentUser.like_issues.some(like => like.issue_id === id))
  // console.log("THIS ISSUE ID --->", id)
  // console.log("THE CURRENT USER'S LIKE: ---->", currentUser && currentUser.like_issues)

  const deleteIssue = () => {
    fetch(`http://localhost:3000/issues/${id}`, {
      method: "DELETE"
    })
    .then(r => r.json())
    .then(issue => {
      dispatch({ type: DELETE_ISSUE, payload: issue })
      props.match.path === "/issues/:id" && props.history.push('/issues')
    })
  }

  const updateIssue = () => {
    const data = {
      title: issueTitle,
      issue_body: issueBody
      // syntax: "javascript"
    }
    
    fetch(`http://localhost:3000/issues/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(data => {
      console.log("UPDATED ISSUE -->", data.issue)
      if (data.errorStatus) {
        console.log("ERROR --->", data.error)
      } else {
        dispatch({ type: UPDATE_ISSUE , payload: data.issue })
        dispatch({ type: UPDATE_TITLE , payload: "" })
        dispatch({ type: UPDATE_BODY , payload: "" })
      }
    })  
    setOpen(false)
  }

  const unlike = () => {
    console.log("UNLIKE")
    // delete association from the database
    fetch(`http://localhost:3000/like_issues/${id}/user/${currentUser.id}`, {
      method: "DELETE"
    })
    .then(r => r.json())
    .then(data => {
      console.log("DELETE UNLIKE FETCH ------>", data)
      // console.log("LIKE STORE FROM FETCH ->", likeStore)
      // const issueId = id
      // const like = data.like
      dispatch({ type: SET_KEY_HOLDER, payload: data.user })
      
      dispatch({ type: UPDATE_LIKES, payload: data.like })
      dispatch({ type: UPDATE_ISSUE, payload: data.issue })
      setDislayLikeStatus(!displayLikeStatus)
    })
  }

  const likeBtn = () => {
    console.log("LIKE")
    // set up an association between the currentUser and the issue clicked
  }

  const dislikeBtn = () => {
    console.log("DISLIKE")

  }

  const favoriteBtn = () => {
    console.log("FAVORITE")
    // set up an association between the currentUser and the issue clicked
  }

  return (
      <Grid.Row>
        <Grid.Column className="Issue-Inner-Wrap" width={12}>
            <Card fluid raised>
              <Card.Content className="Issue-Content">
                <Card.Header>

                </Card.Header>
                <Card.Meta className="Issue-Item-Wrapper">
                  <Card.Meta className="Issue-Icon-Title">
                    <Link to={`/issues/${id}`}>
                      {title}
                    </Link>
                  </Card.Meta>
                  <Card.Meta className="Issue-Icon-Avatar" textAlign='right'>
                    <Image
                      as={Link}
                      to={`/users/${user.id}`}
                      className="Image"
                      size='big'
                      avatar
                      alt={`${user.first_name} ${user.last_name}`}
                      src={imgUrl}
                    />
                  </Card.Meta>
                </Card.Meta>
                { props.displayBody &&
                  <Card.Description className="ShowIssue-Issue-Body">
                    {
                      <CreateHighlight dataString={issue_body} syntax={syntax} />
                    }
                  </Card.Description>
                }
                <Divider clearing />
                <Card.Meta className="Issue-Item-Wrapper">
                  <Card.Meta className="Issue-Item-Extra">
                    <Icon name='comment alternate' size="large" />
                    <span className="Issue-Comment">{totalComments} Comments</span>
                  </Card.Meta>
                  <Card.Content extra className="Issue-Item-Extra">
                    { 
                      displayLikeStatus ? // has the user liked or disliked this issue? (true or false) - 
                      // if you find an association between the user and this issue set a 
                      // variable to true and false if no association is found
                      <Button circular color="teal" icon={ thumbsUpOrDown ? "thumbs up" : "thumbs down"} size="large" onClick={unlike} />
                      // if is_like column for this issue's association is true set icon thumbs up else set icon thumbs down
                      :
                      <React.Fragment>
                        <Button circular color="teal" icon='thumbs up outline' size="large" onClick={likeBtn} />
                        <Button circular color="teal" icon='thumbs down outline' size="large" onClick={dislikeBtn} />
                      </React.Fragment>
                    }
                    <Button circular color="teal" icon='star outline' size="large" onClick={favoriteBtn} />
                  </Card.Content>
                </Card.Meta>
              </Card.Content>
              {
                currentUser && currentUser.id === user.id &&
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Modal
                      onClose={() => setOpen(false)}
                      onOpen={() => setOpen(true)}
                      open={open}
                      trigger={<Button inverted color='green'> Edit </Button>}
                    >
                      <Modal.Header>Update Issue</Modal.Header>
                      <Modal.Content>
                        <IssueForm displayContent={false} isUpdateForm={true} issueData={props.issue} />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button onClick={() => setOpen(false)} color='teal'>Cancel</Button>
                        <Button onClick={updateIssue} positive>Update</Button>
                      </Modal.Actions>
                    </Modal>
                    <Button inverted color='red' onClick={deleteIssue}>
                      Delete
                    </Button>
                  </div>
                </Card.Content>
              }
            </Card>
        </Grid.Column>
      </Grid.Row>
  );
} 

export default withRouter(Issue);
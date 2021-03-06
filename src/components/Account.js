import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Card, Image, Segment, Grid, Header, Icon, List, Button, Divider } from 'semantic-ui-react'
import Loading from './Loading';
import MissingTemplate from './MissingTemplate';
import accountOptions from '../Library/accountOptions';
import '../resources/Account.css';

const Account = props => {

  const users = useSelector(state => state.user.users)
  const currentUser = useSelector(state => state.user.keyHolder)
  const userId = parseInt(props.match.params.id)
  const [ userProfile, setUserProfile ] = useState(null)
  const [ popularIssues, setPopularIssues ] = useState([])
  const [ issueCount, setIssueCount ] = useState([])

  const issueThumbsUp = issueLikes => issueLikes.filter(issue => issue.is_like === true)

  const findPopularIssues = useCallback((issues) => {
    setPopularIssues(issues.filter(issue => issueThumbsUp(issue.like_issues).length >= 4))
  }, [])
  
  useEffect(() => {
    if (currentUser.id === userId) {
      setUserProfile(currentUser)
      if (currentUser) {
        findPopularIssues(currentUser.issues)
        setIssueCount(currentUser.issues.length)
      }
    } else {
      const user = users.find(user => user.id === userId)
      setUserProfile(user)
    }
  }, [users, userId, currentUser, findPopularIssues])

  const renderSkills = () => {
    return userProfile.skills.map(skill => (
      <Grid.Column key={`${skill.text}-${skill.id}`} className="Account-Skill">
        <Segment textAlign="center" key={`${skill.key}`} color={`${skill.color}`}>{skill.text}</Segment> 
      </Grid.Column>
    ))
  }
  
  const renderIssues = () => {
      if (popularIssues.length !== 0) {
        return popularIssues.map(issue => (
          <Grid.Column width={6} key={`${issue.title}-${issue.id}`}>
              <Card raised className="Card-Size">
                <Card.Content>
                  <Card.Header as={Link} to={`/issues/${issue.id}`}>{issue.title}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Grid columns={2} padded>
                    <Grid.Column>
                      <Grid.Row>
                        <Icon name='thumbs up'/>{issueThumbsUp(issue.like_issues).length} Likes
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                      <Grid.Row>
                        <Icon name='comment'/>{issue.comments.length} {issue.comments.length < 1 ? "Comment" : "Comments" }
                      </Grid.Row>
                    </Grid.Column>
                  </Grid>
                </Card.Content>
              </Card>
          </Grid.Column>
        ))
      } else {
         return <MissingTemplate center={true} header={`${issueCount > 0 ? "Your issues are not that popular yet" : "No issues posted"}`} />
      }
  }

  return (
    userProfile ?
    <div id="Account-Container">
        <Header as='h1' textAlign="center" color="blue" className="Account-Header">{(currentUser && currentUser.id === userId) ? `Hello, ${userProfile.first_name}! ` : `${userProfile.first_name} ${userProfile.last_name} Profile` }</Header>
        <Divider />
        <Grid stackable columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <Grid divided>
                <Grid.Row stretched>
                  <Grid.Column>
                    <div className="Account-Image-Alignment Circular">
                      <Image className="Circular-Image" src={userProfile.profile_picture && userProfile.profile_picture.image_url} size='small' circular />
                    </div>
                    <Card className="Account-Card">
                      <Card.Content>
                        <Card.Header textAlign="center">{userProfile.first_name} {userProfile.last_name}</Card.Header>
                        <Card.Description>
                          <div className="description">Profession: {userProfile.job_title} </div>
                          <div className="description">Date of Birth: {userProfile.birthday} </div>
                          { currentUser && <div className="description"><span className="date">Email: {userProfile.email}</span></div> }
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra as={Link} to={`/user-issues/${userId}`}>
                          <Icon name='list alternate outline' size="large" />
                          {userProfile.issues.length} {userProfile.issues.length > 1 || userProfile.issues.length === 0 ? "Issues" : "Issue"}
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid stackable columns='equal' className={`Account-Options-Wrapper ${(currentUser && currentUser.id === userId) ? "" : "Account-Not-Loggedin-User"}`}>
                <Grid.Row stretched>
                  {
                    accountOptions.map(option => (
                      <Grid.Column key={option.iconName}>
                        <Button circular as={Link} to={option.iconName === "boxes" ? `/user-issues/${userId}` : option.link} color="blue" className="Account-Button-Options" >
                          <List.Item>
                            <List.Content>
                              <Icon name={option.iconName} size="big"/>
                              <List.Header className="Account-Item-Name">{option.listHeader}</List.Header>
                            </List.Content>
                          </List.Item>
                        </Button>     
                      </Grid.Column>
                    ))
                  }
                </Grid.Row>
              </Grid>
              <Divider />
              <Header as='h1' color="blue" textAlign="center">Top skills</Header>
              <Grid stackable columns='equal' className="Top-Skills-Wrapper">
                <Grid.Row>
                  {renderSkills()}
                </Grid.Row>
              </Grid>
              { 
                (currentUser && currentUser.id === userId) &&
                <>
                  <Divider />
                  <Header as='h1' color="blue" textAlign="center" className="Issue-Header">Your popular issues</Header>
                  <Grid stackable columns='equal' className={`${currentUser ? "Popular-Issues-Wrapper" : "Account-Not-Loggedin-User"}`}>
                    <Grid.Row>
                      {renderIssues()}
                    </Grid.Row>
                  </Grid> 
                </>
              }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div> : <Loading loadingClass={true} /> 
    );
}

export default withRouter(Account);
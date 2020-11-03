import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header, Grid } from 'semantic-ui-react'
import Issue from './Issue';
import SearchField from './SearchField';
import Loading from './Loading';
import { findIds, findIssues } from '../Library/Helpers';
import '../resources/FavoriteIssues.css';

const IssuesLiked = props => {
  
  const searchTerm = useSelector(state => state.term.searchTerm)
  const pathname = props.location.pathname.split("-")[0]
  const issues = useSelector(state => state.issue.issues)
  const currentUser = useSelector(state => state.user.keyHolder)
  const [ issueIds, setIssueIds ] = useState([])

  useEffect(() => {
    const thumbsUp = currentUser && currentUser.like_issues.filter(like => like.is_like)
    const ids = currentUser && findIds(thumbsUp, pathname)
    setIssueIds(ids)

  }, [currentUser, pathname])

  const renderIssues = () => {
    const filteredIssues = findIssues(issues, issueIds).filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()))
  
    return filteredIssues.map(issue => (
      <Issue key={issue.id} issue={issue} displayBody={false} />
    ))
  }

  return (
    <div id="FavoriteIssue-Container">
      {
        issues ?
        <React.Fragment>
          <Header as='h1' textAlign="center" color="grey" className="FavoriteIssue-Header">Issues You Like</Header>
          <SearchField />
          <Grid columns={1} divided id="Issue">
            {renderIssues()}
          </Grid> 
        </React.Fragment> : <Loading />
      }
    </div>
  )
}

export default IssuesLiked;
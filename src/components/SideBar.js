import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Icon, Menu, Sidebar } from 'semantic-ui-react'
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import IssueContainer from './IssueContainer';
import UserContainer from './UserContainer';
import NewIssueForm from './NewIssueForm';
import ShowIssue from './ShowIssue';
import UserProfile from './UserProfile';
import '../resources/SideBar.css';
import { SET_KEY_HOLDER } from '../store/type';

const SideBar = props => {

  const currentUser = useSelector(state => state.user.keyHolder)
  const [ visible, setVisible ] = useState(false)
  // const [ toggle, setToggle ] = useState(false)  
  const dispatch = useDispatch()


  const handleLogout = () => {
    // remove token from localStorage
    localStorage.removeItem("token")
    // set currentUser state back to null
    dispatch({ type: SET_KEY_HOLDER, payload: null })
  }

  const toggleMenu = () => {
    setVisibilityStatus()
  }

  const setVisibilityStatus = () => {
    setVisible(!visible)
  }

  const closeOnClick = () => {
    visible && setVisibilityStatus()
  }

  console.log("TOOGLE STATUS --->", currentUser && currentUser.id)
  return (
      <Grid columns={1}>
        <Grid.Column>
          <Sidebar.Pushable>
            <Sidebar
              color="teal"
              as={Menu}
              animation='overlay'
              inverted
              onHide={() => closeOnClick(false)}
              vertical
              visible={visible}
              width='wide'
            >
              <Menu.Item as={Link} to="/home">
                <Icon name='home' size="large" />
                Home
              </Menu.Item>
              <Menu.Item as={Link} to="/users">
                <Icon name='users icon' size="large" />
                Users
              </Menu.Item>
              { currentUser ?
                <>
                  <Menu.Item as={Link} to={`/users/${currentUser.id}`}>
                    <Icon name='id badge' size="large" />
                    Account
                  </Menu.Item>
                  <Menu.Item as={Link} to="/issues/new">
                    <Icon name='pen square icon' size="large" />
                    New Issue
                  </Menu.Item>
                  <Menu.Item onClick={handleLogout}>
                    <Icon name='sign-out alternate icon' size="large" />
                    Log out
                  </Menu.Item>
                </> 
                :
                <>
                  <Menu.Item as={Link} to="/signup">
                    <Icon name='write square icon' size="large" />
                    Sign up
                  </Menu.Item>
                  <Menu.Item as={Link} to="/login">
                    <Icon name='sign-in alternate icon' size="large" />
                    Sign in
                  </Menu.Item>
                </>
              }
            </Sidebar>
            <Sidebar.Pusher dimmed={visible}>
              <Header onToggleMenu={toggleMenu} />
                <Switch>  
                  <Route path="/login" render={routeProps => <Login {...routeProps} />} />
                  <Route path="/signup" render={routeProps => <SignUp {...routeProps} />} />
                  <Route exact path="/issues" render={() => ( <IssueContainer /> )} />
                  <Route path="/users/:id" render={() => <UserProfile />} />
                  <Route path="/issues/new" render={routeProps => <NewIssueForm {...routeProps} />} />
                  <Route path="/issues/:id" render={() => <ShowIssue />} />
                  <Route exact path="/users" render={() => ( <UserContainer /> )} />
                  <Route exact path="/home" render={routeProps => <Home {...routeProps} />} />
                </Switch>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid.Column>
      </Grid>
  );
}

export default withRouter(SideBar);
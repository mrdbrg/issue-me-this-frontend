import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Grid, Divider } from 'semantic-ui-react';
import UserCard from './UserCard';
import SearchField from './SearchField';
import Loading from './Loading'; 
import '../resources/UserContainer.css';

const UserContainer = props => {

  const users = useSelector(state => state.user.users)

  const renderUsers = () => {
    return users.map(user => (
        <Grid.Column key={user.id}>
          <UserCard id={user.id} user={user} />
        </Grid.Column>
      ))
  }

  return (
      <div id="Users-Container">
        <Header as='h1' textAlign="center" color="blue" className="Users-Header">Users</Header>
        <Divider />
        <SearchField />
        <Grid padded>
          {
          users ?
            <Grid.Row columns={5}>
              {renderUsers()}
            </Grid.Row> : <Loading loadingClass={true} /> 
          }
        </Grid>
      </div>
  );
}

export default UserContainer;
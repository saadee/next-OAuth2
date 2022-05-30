import * as React from 'react';
import { UserContext } from '../Context/AuthContext';
// import { gapi } from 'gapi-script';

const Professional = () => {
  const {
    setUser,
    user,
    logout,
    activeTab,
    setActiveTab,
    selectedTab,
    handleListItemClick,
  } = React.useContext(UserContext);

  return (
    <div>
      <div>
        <b>Name: </b>
        {user.name}
        <br />
        <b>Email: </b>
        {user.email}
        <br />
        <b>Admin: </b>
        {user.isAdmin === true ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default Professional;

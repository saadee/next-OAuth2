import * as React from 'react';
import { removeCookies } from 'cookies-next';
import { useRouter } from 'next/router';

export const UserContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUserValue] = React.useState({});
  const [selectedTab, setSelectedTab] = React.useState('');
  const [activeTab, setActiveTab] = React.useState();

  const logout = () => {
    removeCookies('token');
    removeCookies('tokens');
    removeCookies('client');
    router.replace('/');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    setUserValue({});
  };

  const setUser = (user) => {
    setUserValue(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const setToken = (tokenInfo) => {
    localStorage.setItem(tokenInfo.type, tokenInfo.token);
  };

  const handleListItemClick = (event, index) => {
    setSelectedTab(index);
    setActiveTab(index);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setToken,
        logout,
        handleListItemClick,
        selectedTab,
        setSelectedTab,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

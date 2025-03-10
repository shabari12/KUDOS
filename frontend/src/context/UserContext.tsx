import React, { createContext, useState } from 'react';

export const UserDataContext = createContext({
  user: {
    email: '',
    username: '',
  },
  setUser: (user: any) => {}
});

const UserContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    username: '',
  });


  console.log('UserContext user:', user);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
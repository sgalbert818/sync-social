import React from "react";

export const AuthContext = React.createContext();

export const AuthProvider = function({children}) {
    const [auth, setAuth] = React.useState(null);
    //console.log(auth);

    React.useEffect(() => {
      // check for token in local storage upon mount
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setAuth(user);
      }
    }, [])

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
          {children}
        </AuthContext.Provider>
      );
}
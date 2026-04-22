import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext(null);
const BASE_URL = "http://localhost:3000";


export function AuthProvider({children}) {
  const [auth, setAuth] = useState(null);
  const [userID, setUserID] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
      async function loadUser() {
        if(userID === null) {
            return;
        }
   
        const res = await fetch(`${BASE_URL}/accounts/${userID}`);
        const data = await res.json()   ;   
  
        setAccountInfo(data);

      }
  
      loadUser();
    }, [userID, auth]);


  return (
    <AuthContext.Provider value={{ auth, setAuth, setUserID, accountInfo}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
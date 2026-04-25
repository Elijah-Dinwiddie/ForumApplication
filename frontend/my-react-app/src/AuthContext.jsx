import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext(null);
const BASE_URL = "http://localhost:3000";


export function AuthProvider({children}) {
  const [auth, setAuth] = useState(null);
  const [userID, setUserID] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [reloadInfo, setReloadInfo] = useState(true);
  
  // On page refresh use refesh token to get auth token
  useEffect(() => {
    console.log("refresh effect running");
    if (auth == null) {
        async function tryRefresh() {
            try {
                const res = await fetch(`${BASE_URL}/accounts/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await res.json();
                setAuth(data.accessToken);
                setUserID(data.returnID);
            } catch (error) {
                console.log("Refresh token is old")
            }
        }
        tryRefresh();
    }
  }, []);

  //Get userInformation on app start up or when userID or authtoken is changed
  useEffect(() => {
      async function loadUser() {
        if(userID === null) {
          setAccountInfo(null);
          return;
        }
   
        const res = await fetch(`${BASE_URL}/accounts/${userID}`);
        const data = await res.json()   ;   
  
        setAccountInfo(data);

      }
      loadUser();
      setReloadInfo(false)
  }, [userID, auth, reloadInfo]);


  return (
    <AuthContext.Provider value={{ auth, setAuth, setUserID, accountInfo, setReloadInfo}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
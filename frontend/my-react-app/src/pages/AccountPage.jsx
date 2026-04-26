import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import {useState} from "react"
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

export default function AccountPage() {
    const { accountInfo, auth, setAuth, setUserID, setReloadInfo} = useAuth();
    const [profileImg, setprofileImg] = useState("");
    const navigate = useNavigate();

    async function signOut() {
        try {
            setAuth(null);
            setUserID(null);

            await fetch(`${BASE_URL}/accounts/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            navigate('/login')
        } catch (error) {
            console.log('Error signing out', error);
        }
    }

    async function updateImage(token=auth) {
        try {
            const imageRes = await fetch(`${BASE_URL}/accounts/${accountInfo.account_id}/updateImage`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    profileImg,
                }),
            });

            return imageRes;
        } catch (error) {
            console.log("error updating image");
            return null;
        }
    }

    async function handleImageSubmit(e) {
        //prevent page reload
        e.preventDefault();
        try {
            //make post request
            let res = await updateImage();
            
            // if post auth token expired see if refresh token can get new auth token
            if (res.status === 401) {
                try {
                    const refreshRes = await fetch(`${BASE_URL}/accounts/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                    const data = await refreshRes.json();
                    setAuth(data.accessToken);
                    setUserID(data.returnID);
                    res = await updateImage(data.accessToken);
                } catch (error) {
                    console.log("Refresh token is old")
                }    
            }
            const data = await res.json();
            console.log("Response for updating image: ", data);

            //refresh the accountInfo to be updated information
            setReloadInfo(true);
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="full-page">
            <Navbar />
            <div>Username: {accountInfo?.account_name ?? "loading"}</div>
            <div>Email: {accountInfo?.email ?? "loading"}</div>
            <div>Created at: {accountInfo?.created_at ?? "loading"}</div>
            <div>ID: {accountInfo?.account_id ?? "loading"}</div>
            <img
            className="image"
                src={accountInfo?.profile_img ?? "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}
            ></img>
            <form onSubmit={handleImageSubmit}>
                <input
                    type="text"
                    value={profileImg}
                    onChange={(e) => setprofileImg(e.target.value)}
                />
            <button type="submit">Update</button>
            </form>
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
}
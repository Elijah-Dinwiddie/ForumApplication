import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import InputArea from "../components/InputArea";
import InputTextArea from "../components/InputTextArea";
import { useEffect, useState } from "react";
import InputButton from "../components/InputButton";
import { useForumThreadInfo } from "../ForumThreadContext";
import { useNavigate } from "react-router-dom";


const BASE_URL = "http://localhost:3000";

export default function CreateForumPage() {
    const [forumName, setForumName] = useState();
    const [forumDescription, setForumDescription] = useState();
    const { setAuth, setUserID, auth } = useAuth();
    const { setForum } = useForumThreadInfo();
    const navigate = useNavigate();


    async function createNewForum(token='auth') {
        const createRes = await fetch(`${BASE_URL}/forums`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                forumName,
                forumDescription,
            }),
        });

        return createRes;
    }

    async function handleSubmit(e) {
        //prevent page reload
        e.preventDefault();
        try {
            //make post request
            let res = await createNewForum(auth);
            
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
                    res = await createNewForum(data.accessToken);

                    if (res.status === 401) {
                        console.log("Please sign in to create forum")
                        navigate('/login');
                        return;
                    }
                    setForum(res.forum_id)
                    navigate('/threads')
                } catch (error) {
                    console.log("Refresh token is old")
                }    
            }
            const data = await res.json();
            
            //run query to show newly created post
            console.log("Response for post creation: ", data);
            setForum(data.forum_id);
            navigate('/threads');
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="full-page">
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className="form-prompt">
                    <div className='sign-in-title'><b>Create Forum</b></div>
                    <InputArea 
                        label='Forum Name' 
                        placeholder='Fortnite Forum' 
                        type ='text' 
                        value={forumName} 
                        onChange={(e) => setForumName(e.target.value)} 
                    />
                    <InputTextArea 
                        label='Description' 
                        placeholder='This is the Description' 
                        type ='text' 
                        value={forumDescription} 
                        onChange={(e) => setForumDescription(e.target.value)} 
                        height='130px'
                    />
                    <div className="buttons">
                        <span className="medium-gap" />
                        <button className="general-button" type="submit">Create Forum</button>
                        <span className="button-gap" />
                        <InputButton 
                            whereTo="/home_page"
                            name="Cancel"
                        />
                        <span className="end-gap" />
                    </div>
                </div>
            </form>
        </div>
    )
}
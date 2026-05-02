import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import InputArea from "../components/InputArea";
import InputTextArea from "../components/InputTextArea";
import { useEffect, useState } from "react";
import InputButton from "../components/InputButton";
import { useForumThreadInfo } from "../ForumThreadContext";
import { useNavigate } from "react-router-dom";


const BASE_URL = "http://localhost:3000";

export default function CreateThreadPage() {
    const [threadTitle, setThreadTitle] = useState();
    const [threadPost, setThreadPost] = useState();
    const { setAuth, setUserID, auth } = useAuth();
    const { forum_id, setThread } = useForumThreadInfo();
    const navigate = useNavigate();


    async function createNewThread(token='auth') {
        const createRes = await fetch(`${BASE_URL}/forums/${forum_id}/threads`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                threadTitle,
                threadPost,
            }),
        });

        return createRes;
    }

    async function handleSubmit(e) {
        //prevent page reload
        e.preventDefault();
        try {
            //make post request
            let res = await createNewThread(auth);
            
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
                    res = await createNewThread(data.accessToken);

                    if (res.status === 401) {
                        console.log("Please sign in to create Thread")
                        navigate('/login');
                        return;
                    }
                    setThread(res.thread_id)
                    navigate('/')
                } catch (error) {
                    console.log("Refresh token is old")
                }    
            }
            const data = await res.json();
            
            //run query to show newly created post
            console.log("Response for post creation: ", data);
            setThread(data.thread_id);
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
                    <div className='sign-in-title'><b>Create Thread</b></div>
                    <InputArea 
                        label='Thread Name' 
                        placeholder='Fortnite is good?' 
                        type ='text' 
                        value={threadTitle} 
                        onChange={(e) => setThreadTitle(e.target.value)} 
                    />
                    <InputTextArea 
                        label='Description' 
                        placeholder='This is the Description' 
                        type ='text' 
                        value={threadPost} 
                        onChange={(e) => setThreadPost(e.target.value)} 
                        height='130px'
                    />
                    <div className="buttons">
                        <span className="medium-gap" />
                        <button className="general-button" type="submit">Create Thread</button>
                        <span className="button-gap" />
                        <InputButton 
                            whereTo="/threads"
                            name="Cancel"
                        />
                        <span className="end-gap" />
                    </div>
                </div>
            </form>
        </div>
    )
}
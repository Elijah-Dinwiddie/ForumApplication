import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import { useForumThreadInfo } from "../ForumThreadContext";
import PagBar from "../components/PagBar";


const BASE_URL = "http://localhost:3000";

function Messages({ posts, users }) {
  return (
    <>
      {posts.map((post, i) => (
        <Message key={post.id ?? i} POSTS={post} user={users[i]} />
      ))}
    </>
  );
}

function Message({ POSTS, user }) {
  const post = POSTS?.post_text ?? "Loading...";
  const accountName= user?.account_name ?? "Loading...";
  const accountImage = user?.profile_img ?? "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";


  return (
    <div className="message">
      <div className="user-picture">
        <img
          className="image"
          src={accountImage}
        ></img>
      </div>
      <div className="post-right">
        <div className="post-info">{accountName} - {new Date(POSTS?.created_at).toLocaleString()}</div>
        <div className="post">{post}</div>
      </div>
    </div>
  );
}


function CreatePost({setNeedLoadPost}) {
  const [postText, setText] = useState("");

  // bring in varuables and functions from AuthContext
  const { auth, setAuth, setUserID, accountInfo} = useAuth();

  //function to make a post request to make a new post
  async function createNewPost(token=auth) {
    const res = await fetch(`${BASE_URL}/forums/${forum_id}/threads/${thread_id}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            postText,
        }),
    });
    return res;
  }

  async function handleSubmit(e) {
        //prevent page reload
        e.preventDefault();
        try {
            //make post request
            let res = await createNewPost();
            
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
                    res = await createNewPost(data.accessToken);
                } catch (error) {
                    console.log("Refresh token is old")
                }    
            }
            const data = await res.json();
            
            //run query to show newly created post
            setNeedLoadPost(true);
            console.log("Response for post creation: ", data);
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <div className="message">
      <div className="user-picture">
        <img
          className="image"
          src={accountInfo?.profile_img ?? "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}
        ></img>
      </div>
      <div className="post-right">
        <div className="post-info">{accountInfo?.account_name ?? "Loading"} - {new Date().toLocaleString()}</div>
        <form className="post-input" onSubmit={handleSubmit}>
          <textarea 
            className="post-input-box" 
            value={postText} 
            onChange={(e) => setText(e.target.value)}
          />
          <button className="post-input-button" type="submit">Post</button>
        </form>
      </div>
    </div>
  )
};

function Title({threadInfo}) {
  return (
    <div className="title">
      <span><b>{threadInfo.thread_name}: </b> {threadInfo.thread_post}</span>
      
    </div>
  );
}

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [users, setUsers] = useState([]);
  const [threadInfo, setThreadInfo] = useState([]);
  const [needLoadPost, setNeedLoadPost] = useState(false);
  const [page, setPage] = useState(0);

  const { thread_id, forum_id } = useForumThreadInfo();

  useEffect(() => {
    async function loadThreadInfo() {
      const thread = await fetch(`${BASE_URL}/forums/${forum_id}/threads/${thread_id}`)
      const data = await thread.json();
      
      setThreadInfo(data);
    }

    loadThreadInfo()
  }, [thread_id]);

  useEffect(() => {
    async function loadPosts() {
 
      const postRes = await fetch(`${BASE_URL}/forums/${forum_id}/threads/${thread_id}/posts/?offset=${offset}`)
      const data = await postRes.json()      

      setPosts(data);

      //get all account_id's in messages
      const preIds = data.map(p=> p.account_id);
      const ids = preIds.map(x => x ?? 8002);

      // get userinfo for all user id's
      const userRes = await Promise.all(
        ids.map(id =>
          fetch(`${BASE_URL}/accounts/${id}`).then(res => res.json())
        )
      );
      
      setUsers(userRes);
      setNeedLoadPost(false);

      console.log("Here is the data", data);
      console.log("here is the user info", userRes);

    }

    loadPosts();
  }, [offset, needLoadPost]);

  return (
    <div className="full-page">
      <Navbar />
      <Title threadInfo={threadInfo}/>
      <Messages posts={posts} users={users} />
      <CreatePost setNeedLoadPost={setNeedLoadPost}/>
      <PagBar offset={offset} setOffset={setOffset} page={page} setPage={setPage}/>
    </div>
  );
}

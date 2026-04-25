import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";


const BASE_URL = "http://localhost:3000"
//Hardcoded data that will be replaced later. Info is recieved in
// previous page not implemented yet.
let forum_id = 8;
let thread_id = 5;

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

  return (
    <div className="message">
      <div className="user-picture">
        <img
          className="image"
          src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
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

/*Page variable increments by 5, each increment then changes the value to the next set so 0 is 1 2 3 4 5.   and when page is 5. the buttons are 6 7 8 9 10 */
function PagBar({updatePage, updatePagePag, page}) {
  return (
    <div>
      <button onClick={() => updatePagePag(page, -5)}>Prev</button>
      {[0,1,2,3,4].map(i => (
        <button
          key={i}
          className="pag-button"
          onClick={() => updatePage(page + i)}
        >
          {page + i + 1}
        </button>
      ))}
      <button onClick={() => updatePagePag(page, 5)}>Next</button>
    </div>
  )
}

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [users, setUsers] = useState([]);
  const [threadInfo, setThreadInfo] = useState([]);
  const [needLoadPost, setNeedLoadPost] = useState(false);
  const [page, setPage] = useState(0);
  

  useEffect(() => {
    async function loadThreadInfo() {
      const thread = await fetch(`${BASE_URL}/forums/${forum_id}/threads/${thread_id}`)
      const data = await thread.json();
      
      setThreadInfo(data);
    }

    loadThreadInfo()
  }, [thread_id]);

  // update the page value, which determines the offset for posts and the display numbers for  pagBar buttons
  function updatePagePag(currentPage, changeValue) {
    if(page==0 && changeValue==-5) {
      return;
    }
    setPage(currentPage+changeValue);
  }

  //
  function updatePage(newPage) {
    setOffset(newPage * 10);
    console.log("Here is page: ", page);
    console.log("Here is offset: ", offset);
  }

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
      <PagBar updatePage={updatePage} page={page} updatePagePag={updatePagePag}/>
    </div>
  );
}

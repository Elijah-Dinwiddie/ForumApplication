import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000"
//Hardcoded data that will be replaced later. Info is recieved in
// previous page not implemented yet.
let page = 0;
let forum_id = 8;
let thread_id = 5;
let userAccount = {
  "account_name": "t",
  "account_id": 1,
  "created_at": "2026-02-21T20:58:00.000Z",
  "is_deleted": false,
  "email": null,
  "isAdmin": null
};

function Navbar() {
  return (
    <div className="nav-bar">
      <div className="nav-left">Homepage</div>
      <div className="nav-right">
        <div className="forums-link">Forums</div>
        <div className="account-link">Account</div>
      </div>
    </div>
  );
}

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

function CreatePost() {
  const [text, setText] = useState("");

  // function handleSubmit() async (e) => {
  //   e.preventDefault();

  // }

  return (
    <div className="message">
      <div className="user-picture">
        <img
          className="image"
          src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
        ></img>
      </div>
      <div className="post-right">
        <div className="post-info">{userAccount.account_name} - {new Date().toLocaleString()}</div>
        {/* <form className="post-input" onSubmit={handleSubmit}>
          <textarea 
            className="post-input-box" 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
          />
          <button className="input-button" type="submit">Post</button>
        </form> */}
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

function PagBar({updatePage}) {
  return (
    <div>
      <button className="pag-button" onClick={() => updatePage(0)}>1</button>
      <button className="pag-button" onClick={() => updatePage(1)}>2</button>
      <button className="pag-button" onClick={() => updatePage(2)}>3</button>
      <button className="pag-button" onClick={() => updatePage(3)}>4</button>
      <button className="pag-button" onClick={() => updatePage(4)}>5</button>
    </div>
  )
}

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [users, setUsers] = useState([]);
  const [threadInfo, setThreadInfo] = useState([]);
  

  useEffect(() => {
    async function loadThreadInfo() {
      const thread = await fetch(`${BASE_URL}/forums/${forum_id}/threads/${thread_id}`)
      const data = await thread.json();
      
      setThreadInfo(data);
    }

    loadThreadInfo()
  }, [thread_id]);

  function updatePage(newPage) {
    if (page !== newPage) {
    page = newPage;
    setOffset(newPage * 10);
}
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

      console.log("Here is the data", data);
      console.log("here is the user info", userRes);
    }

    loadPosts();
  }, [offset]);

  return (
    <div className="full-page">
      <Navbar />
      <Title threadInfo={threadInfo}/>
      <Messages posts={posts} users={users} />
      <CreatePost />
      <PagBar updatePage={updatePage}/>
    </div>
  );
}

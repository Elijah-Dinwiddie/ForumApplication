import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000"
let page = 0;
let forum_id = 3;
let thread_id = 5;

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
      <Message POSTS={posts[0]} user={users[0]}/>
      <Message POSTS={posts[1]} user={users[1]}/>
      <Message POSTS={posts[2]} user={users[2]}/>
      <Message POSTS={posts[3]} user={users[3]}/>
      <Message POSTS={posts[4]} user={users[4]}/>
      <Message POSTS={posts[5]} user={users[5]}/>
      <Message POSTS={posts[6]} user={users[6]}/>
      <Message POSTS={posts[7]} user={users[7]}/>
      <Message POSTS={posts[8]} user={users[8]}/>
      <Message POSTS={posts[9]} user={users[9]}/>
    </>
  );
}

function Message({ POSTS, user }) {
  const post = POSTS?.post_text ?? "Loading...";
  const accountName= user?.accountInfo.account_name ?? "Loading...";

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

function Title() {
  return (
    <div className="title">
      <b>Thread Title: </b> Wow this is cool
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
  const [posts, setPosts] = useState(Array(10).fill(null));
  const [offset, setOffset] = useState(0);
  const [users, setUsers] = useState([]);

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
      <Title />
      <Messages posts={posts} users={users} />
      <PagBar updatePage={updatePage}/>
    </div>
  );
}

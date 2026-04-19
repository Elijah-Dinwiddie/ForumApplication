import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000"
let page = 0;
let forum_id = 3;
let thread_id = 5;

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

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

function Messages({ posts }) {
  return (
    <>
      <Message postNum={0} POSTS={posts} />
      <Message postNum={1} POSTS={posts} />
      <Message postNum={2} POSTS={posts} />
      <Message postNum={3} POSTS={posts} />
      <Message postNum={4} POSTS={posts} />
      <Message postNum={5} POSTS={posts} />
      <Message postNum={6} POSTS={posts} />
      <Message postNum={7} POSTS={posts} />
      <Message postNum={8} POSTS={posts} />
      <Message postNum={9} POSTS={posts} />
    </>
  );
}

function Message({ postNum, POSTS }) {
  console.log("This s the psot: ", POSTS);
  const post = POSTS?.[postNum]?.post_text ?? "Loading...";

  if(!post) {
    post = "this is test";
  }

  return (
    <div className="message">
      <div className="user-picture">
        <img
          className="image"
          src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
        ></img>
      </div>
      <div className="post-right">
        <div className="post-info">User Name - Date commented</div>
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

  function updatePage(newPage) {
    if (page !== newPage)
      page = newPage;
      setOffset(newPage * 10);
  }

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch(`${BASE_URL}/forums/${forum_id}/threads/${thread_id}/posts/?offset=${offset}`)
      const data = await res.json()

      setPosts(data);
      console.log("Here is the data", data);
    }

    loadPosts();
  }, [offset]);

  return (
    <div className="full-page">
      <Navbar />
      <Title />
      <Messages posts={posts} />
      <PagBar updatePage={updatePage}/>
    </div>
  );
}

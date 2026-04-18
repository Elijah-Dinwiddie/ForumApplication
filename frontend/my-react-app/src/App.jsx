import { useState } from "react";

const POSTS = [
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5003,
    created_at: "2026-02-24T19:29:31.953Z",
    post_text: "no way",
    is_deleted: false,
    post_number: 0,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5005,
    created_at: "2026-02-24T19:30:13.380Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 1,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5006,
    created_at: "2026-02-24T19:30:14.963Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 2,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5007,
    created_at: "2026-02-24T19:30:15.663Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 3,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5008,
    created_at: "2026-02-24T19:30:15.840Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 4,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5009,
    created_at: "2026-02-24T19:30:15.986Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 5,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5010,
    created_at: "2026-02-24T19:30:16.133Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 6,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5011,
    created_at: "2026-02-24T19:30:16.253Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 7,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5012,
    created_at: "2026-02-24T19:30:16.370Z",
    post_text: "Yo my dog! 67 67 67 67 67!",
    is_deleted: false,
    post_number: 8,
  },
  {
    thread_id: 5,
    account_id: 8,
    post_id: 5013,
    created_at: "2026-02-24T19:30:16.510Z",
    post_text: "This post is to test",
    is_deleted: false,
    post_number: 9,
  },
];

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
  const post = POSTS[postNum].post_text;

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
    <p1 className="title">
      <b>Thread Title: </b> Wow this is cool
    </p1>
  );
}

export default function Page() {
  function getUsersInfo() {}

  console.log("This: ", POSTS);
  return (
    <div className="full-page">
      <Navbar />
      <Title />
      <Messages posts={POSTS} />
    </div>
  );
}

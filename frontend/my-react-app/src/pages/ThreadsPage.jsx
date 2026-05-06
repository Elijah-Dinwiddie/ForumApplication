import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useForumThreadInfo } from "../ForumThreadContext";
import ItemBoxItem from "../components/ItemBoxItem";
import PagBar from "../components/PagBar";
import InputButton from "../components/InputButton";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:3000";

export default function ThreadsPage() {
    const [threads, setThreads] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [title, setTitle] = useState('');
    let whereTo = "/create_thread";

    const { forum_id } = useForumThreadInfo();
    const { auth } = useAuth();

    if(auth == null) {
        whereTo = "/login";
    }

    useEffect(() => {
        async function loadThreads() {
            try {
                const res = await fetch(`${BASE_URL}/forums/${forum_id}/threads?offset=${offset}`)

                const data = await res.json();
                setThreads(data);

            } catch (error) {
                console.log('Unable to load the threads', error);
            }
        }

        loadThreads();
    }, [offset])

    useEffect(() => {
        async function loadTitle() {
            try {
                const res = await fetch(`${BASE_URL}/forums/${forum_id}`)
                const data = await res.json();
                setTitle(data.forum_name);
            } catch (error) {
                console.log("Error getting title");
            }
        }

        loadTitle();
    }, [forum_id])

    return (
        <div className="full-page">
            <Navbar />
            <div className="item-box">
                <div className="item-box-title">
                    <span className="middle">{title}</span>
                        <InputButton whereTo={whereTo} name="Create Thread" />
                </div>
                <span className="line" />
                <Items threads={threads} />
                <span className="item-box-pag">
                    <PagBar offset={offset} setOffset={setOffset} page={page} setPage={setPage}/>
                </span>

            </div>
        </div>
    );
}

function Items({threads}) {
    return (
        <>
            {threads.map((thread, i) => (
                <Item key={thread.thread_id} thread={thread} />
            ))}
        </>
    )
}

function Item({thread}) {
    const { setThread } = useForumThreadInfo();

    return (
        <>
            <ItemBoxItem 
                title={thread.thread_name} 
                description={thread.thread_post}
                onClick={() => setThread(thread.thread_id)}
                to={`/posts`}
            />
        </>
    )
}
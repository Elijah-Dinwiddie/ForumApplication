import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useForumThreadInfo } from "../ForumThreadContext";
import ItemBoxItem from "../components/ItemBoxItem";
import PagBar from "../components/PagBar";

const BASE_URL = "http://localhost:3000";

export default function ThreadsPage() {
    const [threads, setThreads] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);

    const { forum_id } = useForumThreadInfo();

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

    return (
        <div className="full-page">
            <Navbar />
            <div className="item-box">
                <div className="item-box-title">Forums</div>
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
                to={`/`}
            />
        </>
    )
}
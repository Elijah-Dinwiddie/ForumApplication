import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useForumThreadInfo } from "../ForumThreadContext";
import ItemBoxItem from "../components/ItemBoxItem";
import PagBar from "../components/PagBar";

const BASE_URL = "http://localhost:3000";

export default function ForumsPage() {
    const [forums, setForums] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        async function loadForums() {
            try {
                const res = await fetch(`${BASE_URL}/forums/?offset=${offset}`)

                const data = await res.json();
                setForums(data);

            } catch (error) {
                console.log('Unable to load the forums', error);
            }
        }

        loadForums();
    }), [offset]

    return (
        <div className="full-page">
            <Navbar />
            <div className="item-box">
                <div className="item-box-title">Forums</div>
                <span className="line" />
                <Items forums={forums} />
                <span className="item-box-pag">
                    <PagBar offset={offset} setOffset={setOffset} page={page} setPage={setPage}/>
                </span>

            </div>
        </div>
    );
}

function Items({forums}) {
    return (
        <>
            {forums.map((forum, i) => (
                <Item key={forum.forum_id} forum={forum} />
            ))}
        </>
    )
}

function Item({forum}) {
    const { setForum } = useForumThreadInfo();

    return (
        <>
            <ItemBoxItem 
                title={forum.forum_name} 
                description={forum.forum_description}
                onClick={() => setForum(forum.forum_id)}
                to={`/threads`}
            />
        </>
    )
}
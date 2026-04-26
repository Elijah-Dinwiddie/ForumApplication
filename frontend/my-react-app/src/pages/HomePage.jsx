import Navbar from "../components/Navbar";
import ItemBoxItem from "../components/ItemBoxItem";
import { useForumThreadInfo } from "../ForumThreadContext";


export default function HomePage() {
    const { setThread, setForum } = useForumThreadInfo();

    function setInfo(thread_id, forum_id) {
        setThread(thread_id);
        setForum(forum_id);
    }
    return (
        <div className="full-page">
            <Navbar />
            <div className="item-box">
                <div className="item-box-title">Recommended Threads</div>
                <span className="line" />
                <ItemBoxItem 
                    title='New Thread' 
                    description='Hey Guys this is the thread post'
                    onClick={() => setInfo(5,8)}
                    to={`/`}
                />
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <ItemBoxItem title='Worst Sesame street season' description='Description of the thread is here'/>
                <div style={{height: "38px"}} />
            </div>
        </div>
    );
}
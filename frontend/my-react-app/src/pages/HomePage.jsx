import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="full-page">
            <Navbar />
            <div className="item-box">
                <div className="item-box-title">Recommended Threads</div>
                <span className="line" />
            </div>
        </div>
    );
}
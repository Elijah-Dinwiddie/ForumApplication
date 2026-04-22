import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function ForumsPage() {
    return (
        <div className="full-page">
            <Navbar />
            <div>Forums</div>
            <Link to='/'>click me</Link>
        </div>
    );
}
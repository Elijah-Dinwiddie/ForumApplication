import { Link } from "react-router-dom";

export default function InputButton({whereTo, name}) {
    return <Link className="general-button" to={whereTo}>{name}</Link>
}

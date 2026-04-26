import { Link } from "react-router-dom";

export default function ItemBoxItem({title, description, onClick, to}) {
    return (
        <div className="item-box-item">
            <Link className='item-title' onClick={onClick} to={to}>{title}</Link>
            <div className='item-description'>{description}</div>
        </div>
    )
}

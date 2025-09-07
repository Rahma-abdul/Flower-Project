import { Link } from "react-router-dom";


function FlowerCard({ name , image }) {
  return (
    <div className="flower-card">
      <Link to={`/info/${encodeURIComponent(name)}`} >
        <img src={image} alt={name} className="flower-image" />
        <h3>{name}</h3>
      </Link>
    </div>
  );
}

export default FlowerCard;

import { Link } from "react-router-dom";


function FlowerCard({ id, name }) {
  return (
    <div className="flower-card">
      <Link to={`/info/${id}`}>
        {/* <img src={image} alt={name} className="flower-image" /> */}
        <h3>{name}</h3>
      </Link>
    </div>
  );
}

export default FlowerCard;

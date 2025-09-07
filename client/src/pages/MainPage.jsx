import FlowerCard  from "../components/FlowerCard";
import "../styles/main.css";
import rose from "../assets/rose.jpg";
import tulip from "../assets/tulip.jpg";
import daisy from "../assets/daisy.jpg";
import sunflower from "../assets/sunflower.jpg";
import orchid from "../assets/orchid.jpg";  
import lily from "../assets/lily.jpg";
import carnation from "../assets/carnation.jpg";
import chrysanthemum from "../assets/chrysanthemum.jpg";
import marigold from "../assets/marigold.jpg";
import peony from "../assets/peony.jpg";
import hydrangea from "../assets/hydrangea.jpg";
import lavender from "../assets/lavender.jpg";


function MainPage() {

    // b3d keda hyb2a bygy mn el backend
    const flowers = [
        { name: "Rose", image: rose },
        { name: "Tulip", image: tulip },
        { name: "Daisy", image: daisy },
        { name: "Sunflower", image: sunflower },
        { name: "Orchid", image: orchid },
        { name: "Lily", image: lily },
        { name: "Carnation", image: carnation },
        { name: "Chrysanthemum", image: chrysanthemum },
        { name: "Marigold", image: marigold },
        { name: "Peony", image: peony },
        { name: "Hydrangea", image: hydrangea },
        { name: "Lavender", image: lavender },
    ];

  return (
    <div className="main-page">

         <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search for flowers..."
          className="search-bar"
        />
        <select className="filter-bar">
          <option value="" disabled hidden>Filter by...</option>
          <option value="color">Color</option>
          <option value="location">Location</option>
          <option value="climate">Climate</option>
        </select>
        
        <button className='filter-button' >Clear Filter</button>
      </div>

        <div className="flower-grid">
            {flowers.map(flower => (
                <FlowerCard 
                    name={flower.name} 
                    image={flower.image}
                />
            ))}
        </div>
    </div>

  );
}

export default MainPage;
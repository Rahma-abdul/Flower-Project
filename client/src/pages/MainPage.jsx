import FlowerCard  from "../components/FlowerCard";
import "../styles/main.css";


import { useState, useEffect } from "react";

function MainPage() {

  // Store flowers data from DB API
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { 
    const fetchFlowers = async () => {
      try {
        // Calling API --> Sends HTTP request
        const response = await fetch('/api/main-api');
        // Get flowers from backend and convert to JSON
        const data = await response.json();
        setFlowers(data);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
        finally {
            setLoading(false);
        }
    };

    fetchFlowers();
  }, []); 

  // Search function to call API 
  const handleSearch = async () => {
    const  query = searchTerm.trim();
    if (!query) {
      // If the search term is empty, do nothing
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/main-api?search=${encodeURIComponent(query)}`);
      const data = await response.json();

      // If no results found 
      if (data.length === 0) {
        alert("No flowers found matching your search.");
        setSearchTerm("");
        setFlowers(flowers)
        return;
      }
      setFlowers(data);

    } catch (error) {
      console.error("Error searching flowers:", error);
    }
    finally {
        setLoading(false);
    }
  };

  
  // If they click enter
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  // Example: RED_ROSE --> Red Rose
  const formatFlowerName = (name) => {
  if (!name) return "";

  return name
    // replace underscores with spaces
    .replace(/_/g, " ") 
    // normalize             
    .toLowerCase()   
    // capitalize each word                
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
};

if (loading) {
    return (
      <div className="main-page">
        <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search for flowers..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleEnter}          
        />
        <button className='search-button' onClick={handleSearch}>
          Search
        </button>
      </div>
        <h1>Loading flowers...</h1>
      </div>
    );
  }



  return (
    <div className="main-page">

         <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search for flowers..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleEnter}
        />
    
        <button className='search-button' onClick={handleSearch}>
          Search
        </button>
      </div>

        <div className="flower-grid">
            {flowers.map(flower => (
                <FlowerCard 
                    name={formatFlowerName(flower.name)} 
                    image={flower.image}
                />
            ))}
        </div>
    </div>

  );
}

export default MainPage;
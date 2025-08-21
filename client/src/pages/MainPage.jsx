import FlowerCard  from "../components/FlowerCard";

function MainPage() {

    const flowers = [
        { id: 1, name: "Rose", image: "https://example.com/rose.jpg" },
        { id: 2, name: "Tulip", image: "https://example.com/tulip.jpg" },
        { id: 3, name: "Daisy", image: "https://example.com/daisy.jpg" }
    ];

  return (
    <div className="main-page">
        <h1>🌸 Welcome to Flower Project</h1>
        <div className="flower-grid">
            {flowers.map(flower => (
                <FlowerCard 
                    key={flower.id} 
                    id={flower.id}
                    name={flower.name} 
                />
            ))}
        </div>
    </div>

  );
}

export default MainPage;
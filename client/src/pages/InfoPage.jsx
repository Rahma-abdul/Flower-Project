import { useParams } from "react-router-dom";
import "../styles/info.css";
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

function InfoPage() {
    const { name } = useParams();

    const flowerDetails = {
        Rose: {
            Image: rose,
            Colors: "Red, Pink, White, Yellow",
            Orgin: "Asia , Europe, North America",
            Meaning: "Love and Passion",
            Climate: "Temperate"
        }
        ,
        Tulip: {
            Image: tulip,
            Colors: "Red, Yellow, Pink, White, Purple",
            Orgin: "Central Asia and Turkey",
            Meaning: "Perfect Love",
            Climate: "Temperate"
        },
        Daisy: {
            Image: daisy,
            Colors: "White, Yellow, Pink",
            Orgin: "Europe and North America",
            Meaning: "Innocence and Purity",
            Climate: "Temperate"
        },
        Sunflower: {
            Image: sunflower,
            Colors: "Yellow, Orange, Red",
            Orgin: "North America",
            Meaning: "Adoration and Loyalty",
            Climate: "Temperate to Warm"
        },
        Orchid: {
            Image: orchid,
            Colors: "Purple, Pink, White, Yellow",
            Orgin: "Worldwide (mainly in tropical regions)",
            Meaning: "Love, Beauty, Strength",
            Climate: "Tropical and Subtropical"
        },
        Lily: {
            Image: lily,
            Colors: "White, Pink, Orange, Yellow",
            Orgin: "Northern Hemisphere (mainly in Asia and North America)",
            Meaning: "Purity and Renewal",
            Climate: "Temperate"
        },
        Carnation: {
            Image: carnation,
            Colors: "Pink, Red, White, Yellow",
            Orgin: "Mediterranean region",
            Meaning: "Love and Fascination",
            Climate: "Temperate"
        },
        Chrysanthemum: {
            Image: chrysanthemum,
            Colors: "Yellow, White, Red, Purple",
            Orgin: "Asia and Northeastern Europe",
            Meaning: "Optimism and Joy",
            Climate: "Temperate"
        },
        Marigold: {
            Image: marigold,
            Colors: "Orange, Yellow, Red",
            Orgin: "Mexico and Central America",
            Meaning: "Passion and Creativity",
            Climate: "Warm"
        },
        Peony: {
            Image: peony,
            Colors: "Pink, Red, White, Yellow",
            Orgin: "Asia, Europe, and Western North America",
            Meaning: "Romance and Prosperity",
            Climate: "Temperate"
        },
        Hydrangea: {
            Image: hydrangea,
            Colors: "Pink, Blue, White, Purple",
            Orgin: "Asia and the Americas",
            Meaning: "Gratitude and Understanding",
            Climate: "Temperate"
        },
        Lavender: {
            Image: lavender,
            Colors: "Purple, Blue, White",
            Orgin: "Mediterranean region",
            Meaning: "Calmness and Serenity",
            Climate: "Temperate to Warm"
        }
    };

    return (
        <div className="info-page">
        <h1 className="header-info" >Flower Information</h1>
        <div className="header">Showing details for {decodeURIComponent(name)} flower:</div>
        <div className="flower-details">
            {flowerDetails[name] ? (
                <div>
                    <img src={flowerDetails[name].Image} alt={name} className="flower-detail-image" />
                    <p><strong className= "topic">Colors:</strong> {flowerDetails[name].Colors}</p>
                    <p><strong className= "topic">Orgin:</strong> {flowerDetails[name].Orgin}</p>
                    <p><strong className= "topic">Meaning:</strong> {flowerDetails[name].Meaning}</p>
                    <p><strong className= "topic">Climate:</strong> {flowerDetails[name].Climate}</p>
                </div>
            ) : (
                <p>No details available for this flower.</p>
            )}
                </div>
        </div>
    );
}
export default InfoPage;
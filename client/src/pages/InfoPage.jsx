import { useParams , useSearchParams } from "react-router-dom";
import "../styles/info.css";
import { useEffect, useState } from "react";

function InfoPage() {

    // useParams --> hook to get flower name from URL
    const { name } = useParams();
    const [flowerDetails, setflowerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useSearchParams --> hook to get confidence score from URL parameters
    const [searchParams] = useSearchParams();
    const confidence = searchParams.get("confidence");


    useEffect(() => {
        async function fetchFlowerDetails() {
            
            try {
                // Calling API --> Sends HTTP request
                const response = await fetch(`/api/info-api?name=${encodeURIComponent(name)}`);
                if (!response.ok) {
                    throw new Error("Flower Not Found :(\n Refresh and Try again!!");
                }

                // .json method to parse JSON response 
                // Response comes as a stream of data to Js object
                // Response = {type: 'basic', url: 'http://localhost:3000/api/info-api?name=Rose', redirected: false, status: 200, ok: true, …}
                
                const data = await response.json();

                // console.log("API response:", response);
                // console.log("Fetched flower details:", data); 
                // Data = {Image: '/assets/rose.jpg', Colors: 'Red', Origin: 'Asia, Europe, North America'....} --> Objects
               
                setflowerDetails(data);
                console.log("Flower data:", data);
                console.log("Image URL:", data.Image);

                }
            catch(error){
                setError(error.message);
                console.error("Error fetching advice:", error.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchFlowerDetails();
    }, [name]);

    if (loading) 
        return( 
            <div className="info-page">
            <h1 className="header-info">Loading details for {decodeURIComponent(name)} flower...</h1>   
            </div>
        );
    if (error) 
        return( 
                <div className="info-page">
                <div className="header">Error: {error}</div>   
                </div>
            );

    return (
        <div className="info-page">
        <h1 className="header-info">Showing details for {decodeURIComponent(name)} flower:</h1>
        {confidence && <p className="confidence">Model Confidence: {confidence}%</p>}
        <div className="flower-details">
            {flowerDetails ? (
                <div>
                    {flowerDetails.Image && (
                        <img src={flowerDetails.Image} alt={name} className="flower-detail-image" />
                    )}
                    <p><strong className= "topic">Description:</strong> {flowerDetails.Description}</p>
                    <p><strong className= "topic">Colors:</strong> {flowerDetails.Colors}</p>
                    <p><strong className= "topic">Origin:</strong> {flowerDetails.Origin}</p>
                    <p><strong className= "topic">Meaning:</strong> {flowerDetails.Meaning}</p>
                    <p><strong className= "topic">Climate:</strong> {flowerDetails.Climate}</p>
                    <p><strong className= "topic">Other Names:</strong> {flowerDetails.OtherNames}</p>
                    <p><strong className= "topic">Fun Fact:</strong> {flowerDetails.FunFact}</p>
                </div>
            ) : (
                <p>No details available for this flower.</p>
            )}
                </div>
        </div>
    );
}
export default InfoPage;


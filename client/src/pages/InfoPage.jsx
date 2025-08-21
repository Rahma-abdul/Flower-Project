import { useParams } from "react-router-dom";

function InfoPage() {
    const { id } = useParams();

    return (
        <div className="info-page">
        <h1>Flower Information</h1>
        <p>Showing details for flower with ID: {id}</p>

        </div>
    );
}
export default InfoPage;
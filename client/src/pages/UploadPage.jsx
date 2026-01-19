import "../styles/info.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function UploadPage() {

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  // For uploading files
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // setStatus("File selected: " + file.name);
      setStatus("");
      setResult(false);
    }
  };

  const handleDragDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // setStatus("File selected: " + file.name);
      setStatus("");
      setResult(false);
    } 
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    if (!image) {
      setStatus("Please select a file first!!");
      setTimeout(() => {
        setStatus("");
      }, 1000);
      return;
    }
    setStatus("Searching Web...");

    setTimeout(() => {
      setStatus("Consulting AI Model..."); 
    }, 2000);

    setTimeout(() => {
      setStatus("Redirecting..."); 
    }, 4000);

    setTimeout(() => {
      const flower = "Rose";
      navigate(`/info/${encodeURIComponent(flower) }`);
    }, 5000);

  };


  const navigate = useNavigate();

  return (
    <div className="info-page">  
      {/* <h1 className="header-info" >Upload Flower</h1> */}
      <h1 className="header-info">Upload a flower and we'll identify it for you :) </h1>
      <div className= 'upload-box'
        onDrop={handleDragDrop}
        onDragOver={handleDragOver}
      >
      {image ? (
        <img src={image} alt="Preview" 
        className={`uploaded-image ${status ? "blurred" : ""}`} />
      
      ) : (
        <p>Drag & Drop Image Here</p>
      )}

      {/* If status defined --> Remove button */}
      {(!status || status == "Please select a file first!!") && (
      <>
      <p>Or</p>
      <label 
        htmlFor="fileInput" 
        className="upload-button"> Choose File
      </label>
      </>
      )}
      
      <input 
        type="file"
        id = "fileInput" 
        accept="image/*" 
        onChange={handleFileChange} 
        hidden
      />

      </div>
      
      {/* If status is defined then remove the submit button */}
      {!status && (
      <button 
        className="submit-button" 
        onClick={handleSubmit}
        >Submit</button>
      )}

      {status && <p className="status">{status}</p>}


    </div>
  );
}
export default UploadPage;

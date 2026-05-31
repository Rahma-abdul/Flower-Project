import "../styles/info.css";
import { useState  , useRef , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as ort from "onnxruntime-web";

// Pin to stable version
const ORT_VERSION = "1.26.0"; 

ort.env.wasm.wasmPaths =  `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;

let cachedSession = null;
let cachedIdxToFlower = null;

async function loadModel() {
  if (!cachedSession) {
    const modelUrl = "https://flower-project-kappa.vercel.app/models/flower_model_clean.onnx";
    cachedSession = await ort.InferenceSession.create(modelUrl , {
      executionProviders: ['wasm'], // Use WebAssembly backend for better performance
    });
    console.log("ONNX model loaded successfully!");
  }
  return cachedSession;
}

async function loadIdxToFlower() {
  if (!cachedIdxToFlower) {
    const idxToFlowerUrl = "https://flower-project-kappa.vercel.app/models/idx_to_class.json";
    cachedIdxToFlower = await fetch(idxToFlowerUrl).then(r => r.json());
    console.log("idx_to_flower mapping loaded successfully!");
  }
  return cachedIdxToFlower;
}

async function preprocessImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(img, 0, 0, 224, 224);

    const imageData = ctx.getImageData(0, 0, 224, 224);
    const data = imageData.data;

    const floatArray = new Float32Array(3 * 224 * 224);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < 224 * 224; i++) {
    for (let c = 0; c < 3; c++) {
      const pixel = data[i * 4 + c] / 255.0;
      floatArray[c * 224 * 224 + i] = (pixel - mean[c]) / std[c];
    }
  }

    return new ort.Tensor('float32', floatArray, [1, 3, 224, 224]);
}

function UploadPage() {

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    loadModel();
    loadIdxToFlower();
  }, []);


  // For uploading files
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
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
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
      // setStatus("File selected: " + file.name);
      setStatus("");
      setResult(false);
    } 
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async() => {
    if(!selectedFile) {
    // if (!image) {
      setStatus("Please select a file first!!");
      setTimeout(() => {
        setStatus("");
      }, 1000);
      return;
    }
    // setStatus("Searching Web...");
    // remove all timeouts after this

    // setTimeout(() => {
      // setStatus("Consulting AI Model..."); 
    // }, 2000);
    
    // setTimeout(() => {
    //   setStatus("Redirecting..."); 
    // }, 4000);

    // setTimeout(() => {
    //   const flower = "Rose";
    //   navigate(`/info/${encodeURIComponent(flower) }`);
    // }, 5000);

    try {

      setStatus("Loading Image...");

      // const formData = new FormData();
      // formData.append("image", selectedFile);
      const [session, idx_to_flower] = await Promise.all([loadModel(), loadIdxToFlower()]);


      setStatus("Consulting AI Model..."); 
      
      // const response = await fetch("/api/predict-api", {
      //   method: "POST",
      //   body: formData
      // });
      // if (!response.ok) {
      //   throw new Error("Prediction Failed :(\n Please Try again!!");
      // }


      // const data = await response.json();

      // if (!data?.flower) {
      //   throw new Error("Flower Not Found :(\n Please Try again!!");
      // }

      // Wait for the <img> element to be fully painted before reading pixels
      const imageElement = imgRef.current;
      if (!imageElement.complete) {
        await new Promise((resolve) => {
          imageElement.onload = resolve;
        });
      }

      const tensor = await preprocessImage(imageElement);
      const inputName = session.inputNames[0];
      const outputs = await session.run({ [inputName]: tensor });
      
      const outputKey = session.outputNames[0];
      const outputTensor = outputs[outputKey];
      const outputData = outputTensor.data;
      
      const prediction = Array.from(outputData).indexOf(Math.max(...outputData));
      const flower = idx_to_flower[prediction];

      if (!flower) {
        throw new Error("Flower Not Found :(\n Please Try again!!");
      }

      setStatus("Redirecting...");

      setTimeout(() => {
        navigate(`/info/${encodeURIComponent(flower)}`);
      }, 1500);
    }

    catch (error) {
      console.error("Error Predicting Flower:", error);
      setStatus(error.message || "An error occurred!");
    }
  };


  const navigate = useNavigate();

  return (
    <div className="info-page">  
      {/* <h1 className="header-info" >Upload Flower</h1> */}
      <h1 className="header-info">Upload a flower and we'll identify it for you :) </h1>
      <div className="ai_model">This is a custom-trained AI model with accuracy of 80% approximately.</div>
      <div className="ai_model ">(Results should be verified for critical applications.)</div>
      <div className= 'upload-box'
        onDrop={handleDragDrop}
        onDragOver={handleDragOver}
      >
      {image ? (
        <img 
          src={image} 
          alt="Preview" 
          className={`uploaded-image ${status ? "blurred" : ""}`} 
          ref={imgRef}
        />
      
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


// To do :
// Make text pretty again in info page 
// Add confidence but make sure it's not in db
// add notebook to repo 
// readme and cv description 
// How to run readme section
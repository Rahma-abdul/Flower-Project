import "../styles/info.css";
import { useState  , useRef , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as ort from "onnxruntime-web";

// Pin ONNX to stable version
const ORT_VERSION = "1.26.0"; 

// Load ONNX Runtime Web from CDN
ort.env.wasm.wasmPaths =  `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;

// Cache model so it loads only once
let cachedSession = null;
let cachedIdxToFlower = null;

async function loadModel() {

  // If session already loaded --> return it
  if (!cachedSession) {
    const modelUrl = "https://flower-project-kappa.vercel.app/models/flower_model_clean.onnx";
    const response = await fetch(modelUrl, { cache: "no-store" });
    const modelBuffer = await response.arrayBuffer();

    // Create ONNX inference session
    cachedSession = await ort.InferenceSession.create(modelBuffer, {
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
  
  // Create hidden canvas to process image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Resize image to 224x224 aka model input size
  canvas.width = 224;
  canvas.height = 224;
  ctx.drawImage(img, 0, 0, 224, 224);

  const imageData = ctx.getImageData(0, 0, 224, 224);
  const data = imageData.data;

  // Create tensor array expected by model 
  const floatArray = new Float32Array(3 * 224 * 224);

  // Same normalization as used during training
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];

  // Convert pixels to tensor values
  for (let i = 0; i < 224 * 224; i++) {
  for (let c = 0; c < 3; c++) {
    const pixel = data[i * 4 + c] / 255.0;
    floatArray[c * 224 * 224 + i] = (pixel - mean[c]) / std[c];
  }
}
  // Return tensor in shape [batch, channels, height, width]
  return new ort.Tensor('float32', floatArray, [1, 3, 224, 224]);
}

function UploadPage() {

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  // const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const imgRef = useRef(null);

  // Preload model when page loads
  useEffect(() => {
    loadModel();
    loadIdxToFlower();
  }, []);


  // For uploading files
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL for the selected image
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
      setStatus("Please select a file first!!");
      setTimeout(() => {
        setStatus("");
      }, 1000);
      return;
    }

    try {

    setStatus("Loading Image...");

    // Load model and mapping 
    const [session, idx_to_flower] = await Promise.all([loadModel(), loadIdxToFlower()]);


    setStatus("Consulting AI Model..."); 
    

    // Wait for the <img> element to be fully painted before reading pixels
    const imageElement = imgRef.current;
    if (!imageElement.complete) {
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });
    }

    // Convert image to tensor 
    const tensor = await preprocessImage(imageElement);
    const inputName = session.inputNames[0];
    // Run inference
    const outputs = await session.run({ [inputName]: tensor });
    
    const outputKey = session.outputNames[0];
    const outputTensor = outputs[outputKey];
    const outputData = outputTensor.data;
    
    // Get class with highest probability
    const prediction = Array.from(outputData).indexOf(Math.max(...outputData));
    const flower = idx_to_flower[prediction];

    // Make Name Pretty
    // Ex: bee_balm --> Bee Balm
    const flower2 = flower.trim();
    const prettyFlower = flower2.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    if (!flower) {
      throw new Error("Flower Not Found :(\n Please Try again!!");
    }

    // Convery logits to probabilities
    const logits = Array.from(outputData);
    const expValues = logits.map(x => Math.exp(x - Math.max(...logits))); // subtract max for numerical stability
    const sumExp = expValues.reduce((a, b) => a + b, 0);
    const probabilities = expValues.map(x => x / sumExp);
    const confidence = (Math.max(...Array.from(probabilities)) * 100).toFixed(2);


    setTimeout(() => {
    setStatus("Redirecting...");
    }, 1500);


    setTimeout(() => {
      // navigate(`/info/${encodeURIComponent(prettyFlower)}`);
      navigate(`/info/${encodeURIComponent(prettyFlower)}?confidence=${confidence}`);

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
      <div className="ai_model">This is a custom-trained AI model with accuracy of 70% approximately.</div>
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
      {status == "Loading Image..." && <div className = "ai_model">This might take a moment</div>}
      {status && <p className="status">{status}</p>}
    </div>
  );
}
export default UploadPage;

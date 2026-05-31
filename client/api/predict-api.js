import * as ort from "onnxruntime-web";
import fs from "fs";
import formidable from "formidable";
import sharp from "sharp";
import path from "path";

export const config = {
    api: {
        bodyParser: false, // Disable Next.js's default body parser
    },
};

// Will hold the ONNX InferenceSession instance
let session = null; 


// Load the ONNX model when the server starts
async function loadModel() {
  if (!session) {
    const modelPath = path.join(
      process.cwd(),
      "upload-model",
      "flower_model_clean.onnx"
    );
    session = await ort.InferenceSession.create(modelPath);
    console.log("ONNX model loaded successfully!");
  } 
  return session;
}

// idx_to_flower mapping
// const idx_to_flower = JSON.parse(fs.readFileSync("./upload-model/idx_to_class.json", "utf-8"));
const idx_to_flower = JSON.parse(
    fs.readFileSync(
        path.join(
            process.cwd(),
            "upload-model",
            "idx_to_class.json"
        ),
        "utf-8"
    )
);

async function preprocessImage(filePath) {
    const {data: imageBuffer , info } = await sharp(filePath)
        .resize(224, 224) // Resize to model's expected input size
        .removeAlpha() // Remove alpha channel if present
        .raw() // Get raw pixel data
        .toBuffer({ resolveWithObject: true });
    
    const { width, height, channels } = info;

    const floatArray = new Float32Array(3*width*height);

    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < width*height; i++) {
        for (let c = 0; c < 3; c++) {
            const pixel = imageBuffer[i * 3 + c]/255.0;
            floatArray[c * width * height + i] = (pixel - mean[c]) / std[c]; 
        }
    }

    return new ort.Tensor("float32", floatArray, [1, 3, 224, 224]); 
    // Shape: [batch_size, channels, height, width]
    // return new ort.Tensor("float32", floatArray, [1, channels, height, width]);
}

export default async function handler(req, res) {
    if (req.method !== "POST") {   
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // console.log("API HIT!!");
        // const form = new formidable.IncomingForm();
        const form = formidable({ multiples: false });

        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });

        });

        // console.log("FILES:", files);
        // console.log("IMAGE FILE:", files.image);


        const imageFile = files.image[0];
        const buffer = fs.readFileSync(imageFile.filepath);

        const tensor = await preprocessImage(buffer);

        const session = await loadModel();


        const inputName = session.inputNames[0];
        const outputs = await session.run({ [inputName]: tensor });
        
        // console.log("OUTPUT KEYS:", Object.keys(outputs));
        // console.log("OUTPUTS:", outputs);

        // const outputTensor = outputs.output;
        const outputKey = session.outputNames[0];
        const outputTensor = outputs[outputKey];
        const outputData = outputTensor.data;


        const prediction = outputData.indexOf(Math.max(...outputData));

        const flower = idx_to_flower[prediction];

        res.status(200).json({ flower });
    } catch (error) {
        console.error("Error during prediction:", error);
        res.status(500).json({ error: "Prediction Failed" });
    }   
}

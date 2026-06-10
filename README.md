# 🌸 The Flower Project

The Flower Project is an AI-powered full-stack web application that helps users explore flowers through various AI features, detailed flower information, image classification, personalized flower matching, and flower-related advice.

The project combines modern web development, machine learning, and computer vision to create an interactive and educational experience for flower enthusiasts.

---

## A) Features

### 1) Flower Catalog 

Called the "Main Page": 

* Browse a collection of flowers.
* Search for flowers by name.
* Responsive card-based interface.
* Dynamic data loaded from the backend.

### 2) Flower Information Pages

Serverless APIs generate structured flower information when data is unavailable through the Database. Called the "Info Page" containing scientific and educational details:

* Description
* Colors
* Origin
* Meaning
* Climate
* Alternative names
* Fun facts
* Flower image

Information is stored and retrieved dynamically from the database. If a flower details aren't found in the database, the Gemini API is used to generate structured fallback information, which is stored in the database for future reuse.

### 3) AI Flower Identification

Called the "Upload Page" where you upload an image of a flower and let custom-trained model identify it.

Features:

* Drag-and-drop image upload
* File picker support
* Custom-trained deep learning model
* Confidence score display
* Automatic redirection to the flower information page

### 4) "Which Flower Are You?" Quiz

Called the "Quiz Page" which is a personality-based quiz that predicts which flower best matches the user. It uses AI-generated reasoning to map personality traits to flower types.


Features:

* Open-ended questions
* Multiple-choice questions
* AI-powered flower prediction
* Automatic navigation to the predicted flower page

### 5) Flower Advice Assistant

Large Language Model integration through serverless APIs to answer flower-related questions. Called the "Advice Page" where you ask questions related to flowers and receive AI-generated responses through Google Gemini. 


Examples:

* How often should I water roses?
* Can lilies grow best in warm climates?

---

## B) Machine Learning Model

The flower classification system uses a custom-trained deep learning model built with PyTorch. Using a dataset that was manually collected from 4 different datasets, which was then cleaned and unified into a single label space.

### 1) Model Details

* Architecture: EfficientNet-B3
* Transfer Learning from ImageNet
* 375 flower classes
* Data augmentation during training
* Multi-stage fine-tuning
* Exported for deployment using ONNX

EfficientNet-B3 was selected because it offered:

- Strong image classification performance
- Good transfer learning capabilities
- Reasonable model size
- Faster training than larger architectures

### 2) Training Techniques

* Transfer Learning
* Data Augmentation
* Label Smoothing
* Class-Weighted Loss
* Progressive Fine-Tuning
* Learning Rate Scheduling

### 3) Training Strategy

**Pipeline:** Dataset → Training → Evaluation → Export to ONNX → Deployment

Training was performed in multiple stages:

#### Stage 1: Classifier Training
- Freeze all pretrained layers (Backbone Frozen)
- Train only the classifier

#### Stage 2: Partial Fine-Tuning
- Unfreeze last feature blocks
- Differential learning rates
- Learning rate scheduler 
- Fine tune pretrained representations

#### Stage 3: Deeper Fine-Tuning
- Unfreeze additional layers
- Lower learning rates
- Apply deeper fine tuning

This gradual approach improved validation accuracy significantly while reducing overfitting.

### 4) Final Validation Accuracy

Approximately **70% validation accuracy** across 375 flower classes.


### 5) Image Processing Pipeline

Before inference:

1. Image uploaded by user
2. Resize to 224 × 224
3. Convert to tensor
4. Normalize using ImageNet statistics
5. Run ONNX model inference
6. Calculate prediction confidence
7. Display flower information

### 6) Confidence 

Predictions include confidence scores so users can understand how certain the model is about each classification.

---
## C) Database Integration

Flower information is stored in Supabase and fetched dynamically.

This allows:

* Easy Updates
* Scalable Storage
* Centralized flower information management
* Acts as a caching layer 
* Decreases the consumption of unnecessary AI tokens and calls

Flower images are stored using Supabase Storage which helps with 

* Fast delivery
* Cloud-based storage
* Persistent image hosting

---

## D) Serverless Backend 

The backend is fully serverless, which means that each feature is implemented as an independent APU function deployed on Vercel, eliminating the need for a dedicated server.

The backend logic is encapsulated within Serverless Functions

### API Endpoints

* Main API: `/api/main-api`
  -  Retrieves flower data from Supabase
    
* Info API:  `/api/info-api`
  - Returns detailed flower information fetched from Gemini 2.5 flash
    
* Advice API:  `/api/advice-api`
  - Uses Gemini 2.5 flash lite to generate advice about a specific flower as requested by user
    
* Quiz API:  `/api/quiz-api`
  - Generated result based on user's answers on a few questions with the help of Gemini 2.5 flash lite to predict the best-suited flower for the user
   

---

## E) Project Architecture

### Frontend

Modern Responsive UI

Built using:

* React
* React Router
* CSS
* React Markdown

Pages:

* Main Page
* Flower Info Page
* Upload Page
* Quiz Page
* Advice Page

### Backend

Built using:

* Node.js
* Vercel Serverless Functions

API Routes:

* `/api/main-api`
* `/api/info-api`
* `/api/quiz-api`
* `/api/advice-api`

### Database 
* Supabase Database
* Supabase Storage 
  
### Machine Learning

Built using:

* PyTorch
* TorchVision
* Numpy
* ONNX Runtime Web

### AI Services

* Google Gemini 

### Deployment 

* Vercel

---

## F) Design Decisions

Throughout development several approaches were considered before the final architecture was chosen.

### Why Serverless?

Initially the plan was to use:

- React Frontend
- Express Backend
- Separate Database Deployment

After research, A serverless architecture using Vercel Functions was preferred because:

- Simpler deployment
- Lower maintenance
- Automatic scaling
- No dedicated server management
- Easier AI API integration

A serverless architecture helped to focus solely on application logic while the cloud provider handles infrastructure concerns

Each API endpoint became an independent serverless function.
 
---

## G) Project Structure

```text
Flower-Project/
│
├── client/
|   |
|   |── api/
|   │   ├── main-api.js
|   │   ├── info-api.js
|   │   ├── advice-api.js
|   │   ├── quiz-api.js
|   │   └── supabaseClient.js
│   |
|   ├── src/
|   │   ├── pages/
|   │   ├── components/
|   │   └── styles/
│   |
|   ├── public/
|   │   ├── assets/
|   │   └── models/
│   │         ├── flower_model_clean.onnx
│   │         └── idx_to_class.json
│   │
|   └── package.json 
│
├── model-training/
│   └── flower-custom-model.ipynb
│
├── uploadDB.js
|
└── README.md
```

---

## H) Live Demo

The project is already deployed and can be accessed directly without downloading or installing anything.

Simply visit the deployed application:

```text
https://flower-project-kappa.vercel.app/
```

---

### I) Screenshots 

* Main Page: 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/da32b98b-ae8d-4564-8571-01e882613585" />

* Info Page:
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fa983f48-4024-4499-be91-3cd87412c7aa" />

* Upload Page:
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7419f3fe-d017-4b82-9013-49baf2b3bd4c" />

After prediction: 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/231b1def-417a-48f4-b0a9-3a99fc96b546" />

* Advice Page:
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c5c67a53-858f-41c4-a6d5-af64de8af1c6" />

* Quiz Page:
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/21bfbef5-9def-4736-b67a-497c42028306" />









## 👤 Author

Developed by Rahma Rizk.


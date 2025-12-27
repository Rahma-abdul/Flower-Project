// This file defines a serverless HTTP endpoint for info page.

// Import gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // Step 1: Defining the serverless function to handle requests
    // req --> Contains url , query parameters, headers, method (GET, POST etc)
    // res --> Used to send back response to client
    try{
        // Step 2: Extracts the query parameter (Name) from the request URL
        const { name } = req.query;

        // Dummy API data 
        // const flowers = {
        //     Rose: {
        //     // Image: "/assets/rose.jpg",
        //     Colors: "Red",
        //     Origin: "Asia, Europe, North America",
        //     Meaning: "Love and Passion",
        //     Climate: "Temperate"
        //     },
        //     Tulip: {
        //     // Image: "/assets/tulip.jpg",
        //     Colors: "Red, Yellow, Pink, White, Purple",
        //     Origin: "Central Asia and Turkey",
        //     Meaning: "Perfect Love",
        //     Climate: "Temperate"
        //     }
        // };

        // Check if gemini key exists
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            return res.status(500).json({ error: "Server configuration error: Missing Gemini API key" });
        }

        
        // Step 3: Integrating Gemini API
        // A. Pick Model
        const gemini = new GoogleGenerativeAI(geminiKey);
        const model = gemini.getGenerativeModel({
        model: "gemini-2.5-flash"
        });

        // // B. Create prompt
        const prompt = `Provide the following information about the flower named "${name}". 
                        Include these exact details {all possible colors, origins , meanings that this flower symbolizes, and climate it's grown in}. 
                        Respond in ONLY VALID JSON format. No markdown. No explanation. No extra text. as the following 
                        { Colors: "...",
                        Origin: "...",
                        Meaning: "...",
                        Climate: "..."}`;
                
                
        
            
        // C. Call the model
        const result = await model.generateContent(prompt);
        

        // D. Gemini does NOT return plain text and does NOT return JSON.
        // It returns a structured response object
        // { response: { candidates: [{ content: { parts: [
                                            // { text: "Here is the answer..." }  ]}}]}}
        // So we extract the text part
        const text = result.response.text();


        // E. Parse the response text to JSON
        // const flowers = JSON.parse(text); --> We need to check first if it's valid JSON
        let flowers;
        try {
            flowers = JSON.parse(text);
        } catch (error) {
            return res.status(500).json({ error: "Error parsing Gemini API response to JSON" , raw: text });
        }   

        // Step 4: Check if flower name exists
        if (!name) {
            return res.status(404).json({ error: "Flower Not Found" });
        }

        // Step 5: Return the JSON response
        res.status(200).json(flowers);

    } catch (error) {
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}

// This file defines a serverless HTTP endpoint for quiz page.


// Import gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {

   
    // Why?
    if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" }); 
    }

    const { answers } = req.body;
    // console.log("Received answers:", answers);

    try{

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            return res.status(500).json({ error: "Server configuration error: Missing Gemini API key" });
        }

        const gemini = new GoogleGenerativeAI(geminiKey);

        const model = gemini.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.5
        }
        });

        // // B. Create prompt
        const prompt = `You are a strict classifier.
            Based on the user's quiz answers, determine the single flower that best represents them. 
            Be creative and thoughtful in your selection.

            Rules:
            - Return ONLY the flower name.
            - 1-3 words maximum.
            - No punctuation.
            - No explanations.
            - No emojis.
            - No markdown.
            - No extra text.
            - Do not ask questions.

            User quiz answers:
            ${JSON.stringify(answers, null, 2)}`;
                            
                        
        // C. Call the model
        const result = await model.generateContent(prompt);
        
        const text = result.response.text();

        
        // console.log("Generated flower:", text);


        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error generating advice:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}



// To Do: Make sure to validate answers before sending API

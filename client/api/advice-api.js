// When to return can't help
// Not abt flower
// Doesn't explicitly mention a name of a flower 

// This file defines a serverless HTTP endpoint for advice page.


// Import gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
   
    // Why?
    if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" }); 
    }

    const { question } = req.body;
    // console.log("Received question:", question);

    try{

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            return res.status(500).json({ error: "Server configuration error: Missing Gemini API key" });
        }

        const gemini = new GoogleGenerativeAI(geminiKey);

        const model = gemini.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.5
        }
        });

        // // B. Create prompt
        const prompt = `You are a knowledgeable plant and flower care assistant.
                Answer clearly and practically. 
                Rules: 
                -Answer in max 10 short bullet points only.
                -No introductions or conclusions.
                -No emojis and long explanations.
                -If the question is not about flowers or plant care, respond with "I'm sorry, I can only provide advice related to flowers and plant care."
                -If and only if no specific flower is mentioned, say "Please provide the name of the flower you are asking about".
            
                Question: ${question}`;
                
                
        
            
        // C. Call the model
        const result = await model.generateContent(prompt);
        
        const text = result.response.text();

        
        // console.log("Generated advice:", text);


        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error generating advice:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}

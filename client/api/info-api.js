// This file defines a serverless HTTP endpoint for info page.

// Import gemini
import { GoogleGenerativeAI } from '@google/generative-ai';
// Import supabase 
import { supabase } from './supabaseClient.js';


export default async function handler(req, res) {
    // Step 1: Defining the serverless function to handle requests
    // req --> Contains url , query parameters, headers, method (GET, POST etc)
    // res --> Used to send back response to client
    try{
        // Step 2: Extracts the query parameter (Name) from the request URL
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: "Missing 'name' query parameter" });
        }

        // Step 3: CHECK DATABASE FIRST (CACHE)
        const { data: existing, error: dbError } = await supabase
        .from("Flowers")
        .select("info_json, image")
        .eq("name", name)
        .maybeSingle();

        if (dbError) {
        console.error("DB error:", dbError);
        }

        // Step 3.1: IF FOUND → RETURN IMMEDIATELY
        if (existing?.info_json) {
        return res.status(200).json({
            ...existing.info_json,
            Image: existing.image
        });
        }

        // Step 3.2: OTHERWISE → CALL GEMINI
        
        // Check if gemini key exists
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            return res.status(500).json({ error: "Server configuration error: Missing Gemini API key" });
        }

        
        // Integrating Gemini API
        // A. Pick Model
        const gemini = new GoogleGenerativeAI(geminiKey);
        const model = gemini.getGenerativeModel({
        // model: "gemini-2.5-flash"
        model: "gemini-2.5-flash-lite"
        });

        // // B. Create prompt
        const prompt = `Provide the following information about the flower named "${name}". 
                        Include these exact details {a detailed description of the flower, all possible colors, origins , meanings that this flower symbolizes and associations, climate it's grown in, other common names of this flower and a fun fact OR explanation of how the flower got its name }. 
                        Respond in ONLY VALID JSON format. No markdown. No explanation. No extra text. as the following 
                        { 
                        Description: "...",
                        Colors: "...",
                        Origin: "...",
                        Meaning: "...",
                        Climate: "..."}
                        OtherNames: "...",
                        FunFact: "..."
                        }`;
                   
            
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

        let imageUrl = null;

        // Step 5: Fetch the image URL from Supabase if found
        const { data, error } = await supabase
        .from('Flowers')
        .select('image')
        .ilike('name', `%${decodeURIComponent(name)}%`)        
        .single();

        
        if (data?.image) {
            imageUrl = data.image;
        }

        

        // Step 6: Save the info_json to the database for future caching
        const { data: data2, error: error2 } =  await supabase
        .from("Flowers")
        .update({
            info_json: flowers
        })
        .ilike('name', `%${name}%`)
        .select();

                
        // console.log("Updated rows:", data2);
        // console.log("Error:", error2);

        // Step 7: If flower name not in DB --> make new row with name and info
        // Keda keda Image will be null since it's new flower 
        if (!data2 || data2.length === 0) {
        const { error: insertError } = await supabase
            .from("Flowers")
            .insert({
            name,
            image: imageUrl,
            info_json: flowers
            });

        if (insertError) {
            console.error("Insert error:", insertError);
        }
        }

        // Step 6: Return the JSON response
        // res.status(200).json(flowers);
        res.status(200).json({ ...flowers, Image: imageUrl });


    } catch (error) {
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}

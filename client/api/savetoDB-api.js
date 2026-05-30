// This file defines a serverless HTTP endpoint for saving data to the database.
// NOT NEEDED ANYMORE

// Import supabase 
import { supabase } from './supabaseClient.js';


export default async function handler(req, res) {
    // Step 1: Defining the serverless function to handle requests
    
    try{
        // console.log("savetoDB-api hit");
        // console.log("Request body:", req.body);
        // Step 1.1: Check if the request method is POST because we want to save data to DB
        // If it's not POST, we return a 405 Method Not Allowed error
        if (req.method !== 'POST') {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        // Step 2: Extracts the body parameter (infoJson) from the request URL
        const {name , infoJson} = req.body;
        // console.log("Flower name:", name);
        // Step 3: Check if flower name exists
        if (!name) {
            return res.status(404).json({ error: "Flower Not Found" });
        }
        // Step 4: Update the info_json column in the database for the given flower name
        // const { error } = await supabase        
        // .from('Flowers')
        // .update({ info_json: infoJson })
        // .eq('name', decodeURIComponent(name))
        
        const { data, error } = await supabase
        .from('Flowers')
        .update({
            info_json: infoJson
        })
        .ilike('name', `%${name}%`)
        .select();

// console.log("Updated rows:", data);
// console.log("Error:", error);
        if (error) {
            console.error("Database update error:", error.message);
            return res.status(500).json({ error: "Failed to update database" });
        }
        
        
        // Step 6: Return the JSON response
        // res.status(200).json(flowers);
        return res.status(200).json({ message: "Flower information saved successfully" });


    } catch (error) {
        // We also need to be extra sure in case all the api fails so we wrap everything in try catch
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }


    
}

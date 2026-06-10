import { supabase } from './supabaseClient.js';

export default async function handler(req, res) {
  

    // Get the search query from the request
    const { search } = req.query; 
try{

    if (search) {
        const normalizedSearch = search.trim().toLowerCase();
        const { data: search_data, error: search_error } = await supabase
        .from('Flowers')
        .select('*')
        // .ilike('name', `${normalizedSearch}%`); 
        .ilike('name', `%${normalizedSearch}%`)
        // Case-insensitive search on the 'name' column

       if (search_error) {
          return res.status(500).json({ error: search_error.message });
       };

        return res.status(200).json(search_data);

    }

    const { data, error } = await supabase
    .from('Flowers')
    .select('*');

    const shuffle = data.sort(() => 0.5 - Math.random());
    const selectedFlowers = shuffle.slice(0, 15); 
    // Select the first 15 flowers from the shuffled array
  

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(selectedFlowers);
}
catch(error){
    console.error("Error fetching data from Supabase:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
}

}
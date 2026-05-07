import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL= ""
const SUPABASE_ANON_KEY=""

const supabase = createClient(
  SUPABASE_URL,SUPABASE_ANON_KEY);

const datasetPath = "C:\\Users\\rahma\\OneDrive\\Desktop\\Personal Projects\\Flower-Datasets\\Flower-Dataset-Resize\\flower-database";

const uploadAndInsert = async () => {
  const files = fs.readdirSync(datasetPath);

  for (const file of files) {
    const filePath = path.join(datasetPath, file);

    // skip non-images
    if (!file.match(/\.(jpg|jpeg|png)$/)) continue;

    const raw_flowerName = file.split('.')[0]; // "rose.jpg" → "rose"

    const flowerName =
        raw_flowerName.charAt(0).toUpperCase() +
        raw_flowerName.slice(1);
        // "rose.jpg" → "rose" → "Rose"

    console.log(`Uploading ${flowerName}...`);

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('Flower_Images')
      .upload(file, fs.readFileSync(filePath), {
        contentType: 'image/*',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      continue;
    }

    // Generate public URL
    const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/Flower_Images/${file}`;

    // Insert into DB
    const { error: dbError } = await supabase
      .from('Flowers')
      .insert([
        {
          name: flowerName,
          image: imageUrl,
          info_json: null
        }
      ]);

    if (dbError) {
      console.error('DB error:', dbError.message);
    } else {
      console.log(`Inserted ${flowerName}`);
    }
  }
};

uploadAndInsert();
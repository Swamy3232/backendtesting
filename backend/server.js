import express from "express";
import fileUpload from "express-fileupload";
import { supabase } from "./supabaseClient.js";

const app = express();
app.use(express.json());
app.use(fileUpload());

// GET all products
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// POST new product with image upload
app.post("/products", async (req, res) => {
  try {
    const { name, category_id, price, weight, description } = req.body;
    let image_url = null;

    // If an image file is sent
    if (req.files && req.files.image) {
      const file = req.files.image;

      const { data, error } = await supabase.storage
        .from("product-image") // your bucket name
        .upload(file.name, file.data, { upsert: true });

      if (error) return res.status(400).json({ error: error.message });

      // Construct public URL
      image_url = `https://pyxujweejwvyphjmxaag.supabase.co/storage/v1/object/public/product-image/${file.name}`;
    }

    // Insert product with image URL
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, category_id, price, weight, description, image_url }]);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("API running on port 3000"));

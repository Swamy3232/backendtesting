import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors"; // <-- import cors
import { supabase } from "./supabaseClient.js";

const app = express();

// Enable CORS for all origins
app.use(cors());

app.use(express.json());
app.use(fileUpload());

// Your routes
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.post("/products", async (req, res) => {
  try {
    const { name, category_id, price, weight, description } = req.body;
    let image_url = null;

    if (req.files && req.files.image) {
      const file = req.files.image;
      const { data, error } = await supabase.storage
        .from("product-image")
        .upload(file.name, file.data, { upsert: true });

      if (error) return res.status(400).json({ error: error.message });

      image_url = `https://pyxujweejwvyphjmxaag.supabase.co/storage/v1/object/public/product-image/${file.name}`;
    }

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

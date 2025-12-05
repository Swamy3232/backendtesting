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
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    // Extract fields from the form
    const { name, category_id, price, weight, description } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    // Handle image upload
    let image_url = null;
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Optional: prepend timestamp to file name to avoid conflicts
      const fileName = Date.now() + "_" + file.name;

      const { data, error } = await supabase.storage
        .from("product-image")
        .upload(fileName, file.data, { upsert: true });

      if (error) return res.status(400).json({ error: error.message });

      image_url = `https://pyxujweejwvyphjmxaag.supabase.co/storage/v1/object/public/product-image/${fileName}`;
    }

    // Prepare product object with correct types
    const product = {
      name,
      category_id: category_id ? parseInt(category_id) : null,
      price: parseFloat(price),
      weight: weight ? parseFloat(weight) : 0,
      description: description || "",
      image_url
    };

    // Insert into Supabase
    const { data, error } = await supabase.from("products").insert([product]);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => console.log("API running on port 3000"));

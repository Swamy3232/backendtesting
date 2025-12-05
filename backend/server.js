import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

// Enable CORS
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// Enable file uploads
app.use(fileUpload());

// -------------------
// Supabase Client
// -------------------
const supabaseUrl = "https://pyxujweejwvyphjmxaag.supabase.co";
const supabaseSecretKey = "sb_secret_Jqm1U"; // ⚠️ Service key, do NOT expose to frontend
const supabase = createClient(supabaseUrl, supabaseSecretKey);

// -------------------
// GET all products
// -------------------
app.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*").order('id', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------
// POST new product
// -------------------
app.post("/products", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    const { name, category_id, price, weight, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    // Handle image upload
    let image_url = null;
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileName = Date.now() + "_" + file.name;

      const { error: storageError } = await supabase.storage
        .from("product-image")
        .upload(fileName, file.data, { upsert: true });

      if (storageError) return res.status(400).json({ error: storageError.message });

      image_url = `https://pyxujweejwvyphjmxaag.supabase.co/storage/v1/object/public/product-image/${fileName}`;
    }

    // Prepare product object
    const product = {
      name: name.trim(),
      category_id: category_id ? parseInt(category_id) : null,
      price: parseFloat(price),
      weight: weight ? parseFloat(weight) : 0,
      description: description ? description.trim() : "",
      image_url
    };

    console.log("Prepared product object:", product);

    // Insert into Supabase
    const { data, error } = await supabase.from("products").insert([product]);
    if (error) return res.status(400).json({ error: error.message });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------
// Start server
// -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

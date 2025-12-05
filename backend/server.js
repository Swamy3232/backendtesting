import express from "express";
import { supabase } from "./supabaseClient.js";

const app = express();
app.use(express.json());

// GET all products
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// POST new product
app.post("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .insert([req.body]);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.listen(3000, () => console.log("API running on port 3000"));

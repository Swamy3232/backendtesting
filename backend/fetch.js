import { supabase } from "./supabaseClient.js";

// Function to load all products
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error loading products:", error);
  } else {
    console.log("Products:", data);
  }
}

// Function to add a new product
async function addProduct() {
  const { data, error } = await supabase.from("products").insert([
    {
      name: "22k Gold Chain",
      price: 32000,
      weight: 5.2,
      description: "Pure gold chain 22k",
    },
  ]);

  if (error) {
    console.error("Error inserting product:", error);
  } else {
    console.log("Inserted product:", data);
  }
}

// Main function to run
async function main() {
  await addProduct();   // Insert product
  await loadProducts(); // Fetch all products
}

main();

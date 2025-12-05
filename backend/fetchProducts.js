import { supabase } from "./supabaseClient.js";

async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
  } else if (data.length === 0) {
    console.log("No products found.");
  } else {
    console.log("All Products:\n");
    console.table(data);
  }
}

fetchProducts();

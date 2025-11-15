"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AdminMenuPage() {
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // ingredient mapping
  const [ingredients, setIngredients] = useState([
    { inventory_id: "", quantity: "" },
  ]);

  useEffect(() => {
    loadMenu();
    loadInventory();
  }, []);

  async function loadMenu() {
    const { data } = await supabase.from("menu").select("*");
    setMenu(data || []);
  }

  async function loadInventory() {
    const { data } = await supabase.from("inventory").select("*");
    setInventory(data || []);
  }

  function addIngredientRow() {
    setIngredients([...ingredients, { inventory_id: "", quantity: "" }]);
  }

  function updateIngredient(i, field, value) {
    const updated = [...ingredients];
    updated[i][field] = value;
    setIngredients(updated);
  }

  async function uploadImage() {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, imageFile);

    if (error) {
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("menu-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveMenuItem() {
    if (!name || !price) {
      alert("Name & price required");
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    // insert into menu
    const { data: menuItem } = await supabase
      .from("menu")
      .insert({
        name,
        price,
        image_url: imageUrl,
      })
      .select()
      .single();

    // insert menu_inventory mappings
    for (const ing of ingredients) {
      if (ing.inventory_id && ing.quantity) {
        await supabase.from("menu_inventory").insert({
          menu_id: menuItem.id,
          inventory_id: ing.inventory_id,
          quantity: ing.quantity,
        });
      }
    }

    alert("Menu item added!");

    // reset form
    setName("");
    setPrice("");
    setImageFile(null);
    setIngredients([{ inventory_id: "", quantity: "" }]);

    loadMenu();
  }

  async function deleteMenu(id) {
    await supabase.from("menu").delete().eq("id", id);
    await supabase.from("menu_inventory").delete().eq("menu_id", id);
    loadMenu();
  }

  return (
    <>
      <h2 className="fw-bold mb-4" style={{ color: "#b85c38" }}>
        Menu Management
      </h2>

      {/* ADD MENU CARD */}
      <div className="card shadow p-4 mb-5 border-0 rounded-4">
        <h4 className="fw-bold mb-3">Add Menu Item</h4>

        <div className="row g-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Menu name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="col-md-5">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
        </div>

        <h5 className="fw-bold mt-4">Ingredients</h5>

        {ingredients.map((ing, i) => (
          <div className="row g-3 mt-2" key={i}>
            <div className="col-md-6">
              <select
                className="form-select"
                value={ing.inventory_id}
                onChange={(e) =>
                  updateIngredient(i, "inventory_id", e.target.value)
                }
              >
                <option value="">Select ingredient</option>
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) =>
                  updateIngredient(i, "quantity", e.target.value)
                }
              />
            </div>

            {i === ingredients.length - 1 && (
              <div className="col-md-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={addIngredientRow}
                >
                  + Add
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          className="btn mt-4 w-100"
          style={{ background: "#4aa96c", color: "white" }}
          onClick={saveMenuItem}
        >
          Save Menu Item
        </button>
      </div>

      {/* MENU LIST */}
      <div className="row g-4">
        {menu.map((item) => (
          <div className="col-md-4" key={item.id}>
            <div className="card shadow-sm border-0 rounded-4">
              <img
                src={item.image_url}
                className="card-img-top rounded-top-4"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="fw-bold">{item.name}</h5>
                <p className="text-muted">${item.price}</p>

                <button
                  className="btn btn-danger w-100"
                  onClick={() => deleteMenu(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

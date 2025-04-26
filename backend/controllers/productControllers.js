import { sql } from "../config/db.js";
export const getAllProducts = async (req,res)=>{
    try {
        const getProducts = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `
        if (getProducts.length === 0) {
            return res.status(404).json({ success: false, message: "There is no product added to show. Add Something" });
        }
        res.status(200).json({ success: true, data: getProducts });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success:false,message: "Internal server error" });
    }
};
export const getProduct = async (req,res)=>{
    const {id} = req.params;
    try {
        const getProduct = await sql`
        SELECT * FROM products
        WHERE id = ${id}`
        if (getProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: getProduct[0]});
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success:false,message: "Internal server error" });
    }
};
export const createProduct = async (req,res)=>{
    try {
        const { name, image, price } = req.body;
        if (!name || !image || !price) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }
        const createProduct = await sql`
        INSERT INTO products (name,image,price)
        VALUES (${name},${image},${price})
        RETURNING *
        `
        res.status(201).json({ success: true, data: createProduct[0] });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success:false,message: "Internal server error" });
    }
};
export const updateProduct = async (req,res)=>{
    const {id} = req.params;
    try {
        const { name, image, price } = req.body;
        if (!name || !image || !price) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }
        const updateProduct = await sql`
        UPDATE products
        SET name = ${name}, image = ${image}, price = ${price}, updated_at = current_timestamp
        WHERE id = ${id}
        RETURNING *
        `
        if (updateProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: updateProduct[0] });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success:false,message: "Internal server error" });
    }
};
export const deleteProduct = async (req,res)=>{
    const {id} = req.params;
    try {
        const deleteProduct = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
        `
        if (deleteProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: deleteProduct[0] });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success:false,message: "Internal server error" });
    }
};

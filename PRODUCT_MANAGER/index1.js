const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/productDB")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Define Product Schema
const productSchema = new mongoose.Schema({
    PID: String,
    name: String,
    product_pic: String,
    product_type: String,
    manufacturing_year: String,
});

const Product = mongoose.model("Product", productSchema);

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index1.html"));
});

// Add Product
app.post('/add', async (req, res) => {
    try {
        await Product.create({
            PID: req.body.PID,
            name: req.body.name,
            product_pic: req.body.product_pic,
            product_type: req.body.product_type,
            manufacturing_year: req.body.manufacturing_year,
        });
        res.sendFile(path.join(__dirname, "index1.html"));
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send("Error adding product");
    }
});

// Delete Product
app.post('/delete', async (req, res) => {
    try {
        await Product.deleteOne({ PID: req.body.PID });
        res.sendFile(path.join(__dirname, "index1.html"));
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).send("Error deleting product");
    }
});

// Update Product
app.post("/update", async (req, res) => {
    try {
        await Product.updateOne(
            { PID: req.body.PID },
            {
                $set: {
                    name: req.body.name,
                    product_pic: req.body.product_pic,
                    product_type: req.body.product_type,
                    manufacturing_year: req.body.manufacturing_year,
                },
            }
        );
        res.sendFile(path.join(__dirname, "index1.html"));
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Error updating product");
    }
});

// Show Products
app.get("/show", async (req, res) => {
    try {
        const data = await Product.find();
        if (data.length === 0) {
            return res.json([]); // Return an empty array if no products exist
        }
        res.json(data);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Error fetching products" });
    }
});

// Start the server
app.listen(3004, () => {
    console.log("Server running at http://127.0.0.1:3004/");
});
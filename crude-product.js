


//Establish mongo db connection 

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());


// Connection with Mongo db
async function mongoDBConnection(){
    try {
        await mongoose.connect("mongodb://localhost:27017/product-database");
        console.log("connection with mongodb established successfully..");  
    } catch (error) {
        console.log(error);
    }
}

mongoDBConnection();

// Creating  product schema
const schemaProduct = new mongoose.Schema({
    p_id:{type:Number},
    name:{type:String},
    Description:{type:String},
    price:{type:Number},
    stock:{type:Number},
    brand:{type:String}
},
{collection:"product-collection"},
{timestamps:true}
);

// creating product model
const Product = mongoose.model('Product',schemaProduct);

// Performing  CRUD operations

// Create Operation
// Method: POST, Endpoint: http://localhost:8081/product/create
app.post("/product/create", async (request, response )=>{
    const { p_id, name, Description, price, stock,brand } = request.body;
    try {
        const productsData = await Product.create({
            p_id,
            name, 
            Description, 
            price,
            stock,
            brand
        });
        return response.status(200)
        .json( {
            message: "Given product created successfully...",
            product: productsData
              });
    } catch (error) {
        response.status(500)
        .json({
            error: "An error occurred while creating product", 
            errorDetails: error.message
        });
    }
  });

  


  // READ Operation 
app.get("/allProducts",async(request,response)=>{ const productsData = await Product.find({});
 return response.json(productsData);
})

// UPDATE Method

// Method: PUT, Endpoint: http://localhost:8081/product/update
app.put("/product/update/:p_id", async (request, response) => {
    try {
      const { p_id, name, Description, price, stock, brand } = request.body;
  
      // Validate input
      if (!p_id || !price) {
        return response.status(400).json({ message: "Product ID and Price are required" });
      }
  
      // Find the product by ID and update the fields
      const productUpdate = await Product.findOneAndUpdate(
        { p_id: p_id }, // Query: Find by Product ID
        {
          name: name,
          Description: Description,
          price: price,
          stock: stock,
          brand: brand,
        }, // Data to update
        { new: true } // Options: return the updated document
      );
  
      // Check if product was found and updated
      if (!productUpdate) {
        return response.status(404).json({ message: "Product not found" });
      }
  
      response.status(200).json({ message: "Product updated successfully", product: productUpdate });
    } catch (error) {
      console.error("Error updating Product:", error);
      response.status(500).json({ message: "An error occurred while updating the Product", error: error.message });
    }
  });


  // Method : DELETE , Endpoint : http://localhost:8081/product/54

app.delete("/product/delete/:p_id", async(request, response)=>{
    try {
        const productId = request.params.p_id;
        const productsData = await Product.findOneAndDelete({p_id: productId});
        if (!productsData) {
            return response.status(404).json(`Product not found with p_id: ${productId}`);
        } else {
            return response.status(200).json({ message: "Product deleted successfully" ,product:productsData });
        }    
    } catch (error) {
        return response.status(500).json("Internal Server Error");
    }
});

  


app.listen(8081, ()=>{
    console.log("Ready to listen requests on port 8081");
});


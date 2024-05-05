import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Review from "../models/reviewModel";
import Product from "../models/productModel";
import { transformName, generateRandomString } from "../utils";

const productRouter = express.Router();

// Get All Products from a Store
productRouter.get(
  "/:storeId/all",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const storeId = req.params.storeId;
    const isFeatured = req.body.featured;

    let query: any = { storeId: storeId };

    if (isFeatured) {
      query.isFeatured = true;
    }

    const allProductsFromStore = await Product.find(query);
    res.send(allProductsFromStore);
  })
);

// Get a specific product by its slug
productRouter.get('/:productSlug', async (req: Request, res: Response) => {
  const product = await Product.findOne({ productSlug: req.params.productSlug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Lo sentimos, ese producto no existe.' });
  }
});

// Crete a new product
productRouter.post('/create', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    // Transform productSlug
    const productSlug = `${transformName(req.body.productName)}-${generateRandomString()}`;

    // Create new product
    const newProduct = new Product({
      storeId: req.body.storeId,
      productSlug: productSlug,
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      productPrice: req.body.productPrice,
      productBrand: req.body.productBrand,
      productCategory: req.body.productCategory,
      stockAmount: req.body.stockAmount,
      leadImageURL: req.body.leadImageURL,
      imagesCollectionURL: req.body.imagesCollectionURL,
      isFeatured: req.body.isFeatured,
    });

    // Save new product to database
    const product = await newProduct.save();

    // Send response
    res.status(201).send(product);
  } catch (error) {
    console.error('Error during product creation: ', error);
    res.status(500).send({ message: 'An error occurred during product creation.' });
  }
}));

// Update a specific product
productRouter.put(
  "/update/:productId",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const newProductData = req.body; // Contains the updated product information

      const updatedProduct = await Product.findByIdAndUpdate(productId, newProductData, { new: true });
      
      if (updatedProduct) {
        res.send(updatedProduct); // Return the updated product data
      } else {
        res.status(404).send({ message: 'Lo sentimos, ese producto no existe.' });
      }
    } catch (err) {
      console.error('Error updating product: ', err);
      res.status(500).send({
        message:
          "An error occurred when updating a specific product.",
      });
    }
  })
);

// Delete a specific product
productRouter.delete('/delete/:productId', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    // Delete all reviews associated with the product
    await Review.deleteMany({ productId });
    // Delete the product
    await Product.findByIdAndDelete(productId);
    res.status(200).send({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error during product deletion: ', error);
    res.status(500).send({ message: 'Ocurrió un error durante la eliminación del producto.' });
  }
}));

export default productRouter;
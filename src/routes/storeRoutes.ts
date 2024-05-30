import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Store from "../models/storeModel";
import Product from "../models/productModel";
import { generateRandomString, transformName } from "../utils";

const storeRouter = express.Router();

// Get All Stores
storeRouter.get(
  "/",
  expressAsyncHandler(async (_: Request, res: Response) => {
    const allStores = await Store.find({});
    res.send(allStores);
  })
);

// Get a specific store by its ID
storeRouter.get('/find/:storeId', async (req: Request, res: Response) => {
  const store = await Store.findById(req.params.storeId);
  if (store) {
    res.send(store);
  } else {
    res.status(404).send({ message: 'Lo sentimos, esa tienda no existe.' });
  }
});

// Get a specific store by its slug
storeRouter.get('/:storeSlug', async (req: Request, res: Response) => {
  const store = await Store.findOne({ storeSlug: req.params.storeSlug });
  if (store) {
    res.send(store);
  } else {
    res.status(404).send({ message: 'Lo sentimos, esa tienda no existe.' });
  }
});

// Get all stores by sellerId
storeRouter.get('/seller/:sellerId', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const stores = await Store.find({ sellerId }); // Find all stores associated with the sellerId

    if (stores.length > 0) {
      res.send(stores); // Return the list of stores
    } else {
      res.status(404).send({ message: 'No se encontraron tiendas para este vendedor.' });
    }
  } catch (error) {
    console.error('Error fetching stores: ', error);
    res.status(500).send({ message: 'An error ocurred when getting all stores by seller.' });
  }
}));

// Crete a new store
storeRouter.post('/create', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    // Transform storeSlug
    const storeSlug = `${transformName(req.body.storeName)}-${generateRandomString()}`;

    // Create new store
    const newStore = new Store({
      sellerId: req.body.sellerId,
      sellerFirstName: req.body.sellerFirstName,
      sellerLastName: req.body.sellerLastName,
      sellerPictureURL: req.body.sellerPictureURL,
      storeSlug: storeSlug,
      storeName: req.body.storeName,
      storeDescription: req.body.storeDescription,
      storePhoneNumber: req.body.storePhoneNumber,
      storeAddress: req.body.storeAddress,
      storeImageURL: req.body.storeImageURL,
    });

    // Save new store to database
    const store = await newStore.save();

    // Send response
    res.status(201).send(store);
  } catch (error) {
    console.error('Error during store creation: ', error);
    res.status(500).send({ message: 'An error occurred during store creation.' });
  }
}));

// Update a specific store
storeRouter.put(
  "/update/:storeId",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { storeId } = req.params;
      const newStoreData = req.body; // Contains the updated store information

      const updatedStore = await Store.findByIdAndUpdate(storeId, newStoreData, { new: true });

      if (updatedStore) {
        res.send(updatedStore); // Return the updated store data
      } else {
        res.status(404).send({ message: 'Lo sentimos, esa tienda no existe.' });
      }
    } catch (err) {
      console.error('Error updating store: ', err);
      res.status(500).send({
        message:
          "An error occurred when updating a specific store.",
      });
    }
  })
);

// Update all stores to sync seller information
storeRouter.put(
  "/update-seller",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { sellerId, ...newSellerData } = req.body; // Contains the updated seller information

      // Update all stores associated with the seller
      const updatedStores = await Store.updateMany(
        { sellerId: sellerId },
        { $set: newSellerData }
      );

      if (updatedStores) {
        res.send({ message: 'Todas las tiendas actualizadas exitosamente.' });
      } else {
        res.status(404).send({ message: 'Lo sentimos, no se pudo encontrar ninguna tienda para ese vendedor.' });
      }
    } catch (err) {
      console.error('Error updating stores: ', err);
      res.status(500).send({
        message: "An error occurred during seller updates throughout all stores.",
      });
    }
  })
);

// Delete store and associated products
storeRouter.delete(
  "/delete/:storeId",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId;
      // Delete the store
      const deletedStore = await Store.findByIdAndDelete(storeId);
      if (!deletedStore) {
        res.status(404).send({ message: 'No se pudo encontrar la tienda para eliminar.' });
      } else {
        // Delete all products associated with the store
        await Product.deleteMany({ storeId: storeId });
        res.send({ message: 'Tienda y productos asociados eliminados exitosamente.' });
      }
    } catch (err) {
      console.error('Error deleting store and associated products: ', err);
      res.status(500).send({
        message: 'Ocurrió un error al eliminar la tienda y los productos asociados.'
      });
    }
  })
);

export default storeRouter;
import express, { Request, Response } from "express";
import data from "../data";
import UserModel from "../models/userModel";
import StoreModel from "../models/storeModel";
import ShippingAddressModel from "../models/shippingAddressModel";
import ProductModel from "../models/productModel";
import ReviewModel from "../models/reviewModel";
import OrderModel from "../models/orderModel";

const dataRouter = express.Router();

dataRouter.get("/", async (_req: Request, res: Response) => {
  try {
    // Clear existing data
    await UserModel.deleteMany({});
    await StoreModel.deleteMany({});
    await ShippingAddressModel.deleteMany({});
    await ProductModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await OrderModel.deleteMany({});

    // Insert base data
    const createdUsers = await UserModel.insertMany(data.users);
    const createdStores = await StoreModel.insertMany(data.stores);
    const createdShippingAddresses = await ShippingAddressModel.insertMany(data.shippingAddresses);
    const createdProducts = await ProductModel.insertMany(data.products);
    const createdReviews = await ReviewModel.insertMany(data.reviews);
    const createdOrders = await OrderModel.insertMany(data.orders);

    console.log("Successfuly created base data, check your MongoDB database.");
    res.send({
      createdUsers,
      createdStores,
      createdShippingAddresses,
      createdProducts,
      createdReviews,
      createdOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting base data.");
  }
});

export default dataRouter;

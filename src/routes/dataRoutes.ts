import express, { Request, Response } from "express";
import data from "../data";
import UserModel from "../models/userModel";

const dataRouter = express.Router();

dataRouter.get("/", async (_req: Request, res: Response) => {
  try {
    // Clear existing data
    await UserModel.deleteMany({});

    // Insert base data
    const createdUsers = await UserModel.insertMany(data.users);

    console.log("Successfuly created base data, check your MongoDB database.");
    res.send({
      createdUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting base data.");
  }
});

export default dataRouter;

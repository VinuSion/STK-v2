import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import cors from 'cors';
import mongoose from "mongoose";
import { config } from "dotenv";
import { ErrorRequestHandler } from "express";
import { baseUrl } from './utils';

import dataRouter from "./routes/dataRoutes";
import userRouter from "./routes/userRoutes";
import storeRouter from "./routes/storeRoutes";
import shippingRouter from "./routes/shippingRoutes";
import productRouter from "./routes/productRoutes";
import reviewRouter from "./routes/reviewRoutes";
import orderRouter from "./routes/orderRoutes";
import uploadRouter from "./routes/uploadRoutes";

config(); // Setup dotenv

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log("STK v2 [API] - Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
  });

const app = express(); // Setup express
const port = process.env.PORT || 3000; // Setup server port

// Setup cors to allow cross-origin requests only from localhost url or hosted url with baseUrl
const allowedOrigins = baseUrl();
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("STK v2 [API] - Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALL API ENDPOINTS FOR THE SERVER
app.use("/v2/seed", dataRouter);
app.use("/v2/users", userRouter);
app.use("/v2/stores", storeRouter);
app.use("/v2/shipping", shippingRouter);
app.use("/v2/products", productRouter);
app.use("/v2/reviews", reviewRouter);
app.use("/v2/orders", orderRouter);
app.use("/v2/upload", uploadRouter);

app.get('/', expressAsyncHandler(async (_: Request, res: Response) => {
  res.send({ message: "Welcome to the STK v2 API!"})
}));

// Underscores '_', '__' are both 'req' and 'next' respectively
const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  res.status(500).send({ message: err.message });
};
app.use(errorHandler);

// Listen for backend server on port 3000
app.listen(port, () => {
  console.log(`STK v2 [API] - Server is live at http://localhost:${port}`);
});
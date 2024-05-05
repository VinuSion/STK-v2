import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Review from "../models/reviewModel";
import Product from "../models/productModel";
import { calculateAverageRating } from "../utils";

const reviewRouter = express.Router();

// Get All Reviews from a Product
reviewRouter.get(
  "/:productId/all",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const allReviewsFromProduct = await Review.find({ productId: productId });
    res.send(allReviewsFromProduct);
  })
);

// Crete a new review
reviewRouter.post('/create', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const product: any = await Product.findById(req.body.productId);
    if (product) {
      // Check if the user already has a review for this product
      const existingReview = await Review.findOne({
        productId: req.body.productId,
        userId: req.body.userId,
      });

      if (existingReview) {
        res.status(400).send({ message: 'Ya usted envió una reseña.' });
      } else {
        // Create new review
        const newReview = new Review({
          productId: req.body.productId,
          userId: req.body.userId,
          userFirstName: req.body.userFirstName,
          userLastName: req.body.userLastName,
          userPictureURL: req.body.userPictureURL,
          rating: req.body.rating,
          comment: req.body.comment,
        });

        // Save new review to database
        const review = await newReview.save();

        // Recalculate new Average Rating
        const { newAverageRating, totalReviews } = await calculateAverageRating(req.body.productId);

        // Update product document
        product.reviewsAmount = totalReviews;
        product.averageRating = newAverageRating;
        const updatedProduct = await product.save();

        // Send response
        res.status(201).send({ review, updatedProduct });
      }
    } else {
      res.status(404).send({ message: 'El Producto para crear esa reseña no se pudo encontrar.' });
    }
  } catch (error) {
    console.error('Error during review creation: ', error);
    res.status(500).send({ message: 'An error occurred during review creation.' });
  }
}));

// Update a specific review
reviewRouter.put('/update/:reviewId', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    // Find the review by reviewId
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404).send({ message: 'La reseña no se pudo encontrar.' });
    } else {
      // Prepare update object
      const update: any = {};

      // Update rating if provided and different from the current rating
      if (req.body.rating !== undefined && req.body.rating !== null && req.body.rating !== review.rating) {
        // Update rating
        update.rating = req.body.rating;
      }

      // Update comment
      if (req.body.comment !== undefined && req.body.comment !== null) {
        // Trim comment
        const trimmedComment = req.body.comment.trim();

        // If the comment is empty, include $unset operation to remove the comment field
        if (trimmedComment === "") {
          update.$unset = { comment: true };
        } else {
          // Otherwise, update the comment field
          update.comment = trimmedComment;
        }
      }

      // Update review with the prepared update object
      const updatedReview = await Review.findByIdAndUpdate(reviewId, update, { new: true });

      if (updatedReview) {
        // Recalculate average rating for the product
        const { newAverageRating, totalReviews } = await calculateAverageRating(updatedReview.productId.toString());
  
        // Update product document with new average rating and total reviews
        await Product.findByIdAndUpdate(updatedReview.productId, {
          $set: {
            reviewsAmount: totalReviews,
            averageRating: newAverageRating,
          }
        });
  
        // Send response
        res.status(200).send(updatedReview);
      } else {
        res.status(500).send({ message: 'No se pudo actualizar esa reseña. Intentalo de nuevo mas tarde.'})
      }
    }
  } catch (error) {
    console.error('Error during review update: ', error);
    res.status(500).send({ message: 'An error occurred during review update.' });
  }
}));

// Update all reviews to sync user information
reviewRouter.put(
  "/update-user",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { userId, ...newUserData } = req.body; // Contains the updated user information

      // Update all reviews associated with the user
      const updatedUsers = await Review.updateMany(
        { userId: userId },
        { $set: newUserData }
      );

      if (updatedUsers) {
        res.send({ message: 'Todas las reseñas de ese usuario actualizadas exitosamente.' });
      } else {
        res.status(404).send({ message: 'Lo sentimos, no se pudo encontrar ninguna reseña para ese usuario.' });
      }
    } catch (err) {
      console.error('Error updating stores: ', err);
      res.status(500).send({
        message: "An error occurred during seller updates throughout all stores.",
      });
    }
  })
);

// Delete a specific review
reviewRouter.delete('/delete/:reviewId', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    // Find the review by reviewId
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404).send({ message: 'La reseña no se pudo encontrar.' });
    } else {
      // Get the productId associated with the review
      const productId = review.productId;

      // Delete the review
      await Review.findByIdAndDelete(reviewId);

      // Recalculate average rating and total reviews for the product
      const { newAverageRating, totalReviews } = await calculateAverageRating(productId.toString());

      // Update product document with new average rating and total reviews
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        $set: {
          reviewsAmount: totalReviews,
          averageRating: newAverageRating,
        }
      }, { new: true });

      res.status(200).send(updatedProduct);
    }
  } catch (error) {
    console.error('Error during review deletion: ', error);
    res.status(500).send({ message: 'Ocurrió un error durante la eliminación de la reseña.' });
  }
}));

export default reviewRouter;
import mongoose, { Schema, Document } from "mongoose";

interface Review extends Document {
  productId: mongoose.Types.ObjectId; // ID del producto donde se encuentra la reseña
  userFirstName: string; // First name of the user who left the review
  userLastName: string; // Last name of the user who left the review
  userPictureURL: string; // Profile picture URL of the user who left the review
  rating: number; // Reseña del producto (1-5)
  comment?: string; // Comentario de la reseña (Opcional)
}

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    userPictureURL: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<Review>("Review", ReviewSchema);
export default ReviewModel;
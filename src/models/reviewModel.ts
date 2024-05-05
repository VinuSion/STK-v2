import mongoose, { Schema, Document } from "mongoose";

interface Review extends Document {
  productId: mongoose.Types.ObjectId; // ID del producto donde se encuentra la reseña
  userId: mongoose.Types.ObjectId; // ID del usuario que hiso la reseña
  userFirstName: string; // Nombre del usuario que dejo la reseña
  userLastName: string; // Apellido del usuario que dejo la reseña
  userPictureURL: string; // URL de la foto de perfil del usuario que dejo la reseña
  rating: number; // Reseña del producto (1-5)
  comment?: string; // Comentario de la reseña (Opcional)
}

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    userPictureURL: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<Review>("Review", ReviewSchema);
export default ReviewModel;
import mongoose, { Schema, Document } from "mongoose";

interface Product extends Document {
  storeId: mongoose.Types.ObjectId; // Referencia del ID de la tienda de ese producto
  productSlug: string; // Identificador de URL unico y descriptivo del producto
  productName: string; // Nombre del producto
  productDescription: string; // Descripcion del producto
  productPrice: number; // Precio del producto
  productBrand?: string; // Marca del producto (Opcional)
  productCategory: string; // Categoria del producto
  stockAmount: number; // Cantidad del producto disponible
  reviewsAmount: number; // Numero de reseñas del producto
  averageRating: number; // Rating promedio de las reseñas del producto
  leadImageURL: string; // Imagen principal del producto
  imagesCollectionURL: string[]; // Mas Imagenes del producto
  isFeatured: boolean; // Indica si el producto es destacado o no
}

const ProductSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    productSlug: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productBrand: { type: String },
    productCategory: { type: String, required: true },
    stockAmount: { type: Number, required: true },
    reviewsAmount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    leadImageURL: { type: String, default: "" },
    imagesCollectionURL: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<Product>("Product", ProductSchema);
export default ProductModel;
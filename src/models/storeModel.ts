import mongoose, { Schema, Document } from "mongoose";

interface StoreAddress {
  address: string; // Direccion de la tienda
  city: string; // Ciudad de la tienda
  department: string; // Departamento de la tienda
}

interface Store extends Document {
  sellerId: mongoose.Types.ObjectId; // Referencia al usuario vendedor que es dueño de la tienda
  sellerFirstName: string; // Nombre del vendedor de la tienda
  sellerLastName: string; // Apellido del vendedor de la tienda
  sellerPictureURL: string; // URL de la foto de perfil del vendedor de la tienda
  storeSlug: string; // Identificador de URL unico y descriptivo de la tienda
  storeName: string; // Nombre de la tienda
  storeDescription?: string; // Descripcion de la tienda (Opcional)
  storePhoneNumber: string; // Numero de telefono de la tienda
  storeAddress: StoreAddress; // Informacion de la direccion de la tienda
  storeImageURL: string; // URL de la foto de la tienda
}

const StoreAddressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  department: { type: String, required: true },
});

const StoreSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerFirstName: { type: String, required: true },
    sellerLastName: { type: String, required: true },
    sellerPictureURL: { type: String, required: true },
    storeSlug: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    storeDescription: { type: String },
    storePhoneNumber: { type: String, required: true },
    storeAddress: StoreAddressSchema,
    storeImageURL: { type: String, default: "" },
  },
  { timestamps: true }
);

const StoreModel = mongoose.model<Store>("Store", StoreSchema);
export default StoreModel;
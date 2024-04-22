import mongoose, { Schema, Document } from "mongoose";

interface ShippingAddress extends Document {
  userId: mongoose.Types.ObjectId; // Referencia de la ID del Usuario
  fullName: string; // Nombre y Apellido del usuario
  address: string; // Direccion de envio
  city: string; // Ciudad del envio
  department: string; // Departamento (region) del envio
  contactPhoneNumber: string; // Numero de contacto para el envio
}

const ShippingAddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    department: { type: String, required: true },
    contactPhoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const ShippingAddressModel = mongoose.model<ShippingAddress>("ShippingAddress", ShippingAddressSchema);
export default ShippingAddressModel;
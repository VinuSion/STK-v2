import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId; // ID del Producto
  productSlug: string; // Identificador de URL unico y descriptivo del producto
  productName: string; // Nombre del producto
  productLeadImage: string; // Imagen principal del producto
  productPrice: number; // Precio del producto
  quantity: number; // Cantidad del producto en el pedido
  itemPrice: number; // Precio total del item en el pedido
}

interface ShippingAddress {
  fullName: string; // Nombre y Apellido del usuario
  address: string; // Direccion de envio del usuario
  city: string; // Ciudad de envio del usuario
  department: string; // Departamento (region) de envio del usuario
  contactPhoneNumber: string; // Numero de contacto para el envio del usuario
}

interface Order extends Document {
  userId: mongoose.Types.ObjectId; // ID del usuario solicitando el pedido
  storeId: mongoose.Types.ObjectId; // ID de la tienda donde el usuario realizo el pedido
  storeSlug: string; // Identificador de URL unico y descriptivo de la tienda
  storeName: string; // Nombre de la tienda de donde se realizo el pedido
  storeImageURL: string; // Imagen de la tienda de donde se realizo el pedido
  orderStatus: 'Awaiting Seller Approval' | 'Waiting for Payment' | 'Waiting for Delivery' | 'Delivered' | 'Cancelled' | 'Rejected by Seller'; // Estado del pedido
  orderItems: OrderItem[]; // Array de los items del pedido
  shippingAddress: ShippingAddress; // Informacion de envio del pedido
  itemsPrice: number; // Precio total de los items del pedido
  shippingPrice: number; // Precio de envio del pedido
  totalPrice: number; // Precio total del pedido (itemsPrice + shippingPrice)
  paymentMethod: string; // Metodo de pago del pedido
  paidAt?: Date; // Fecha de realizacion del pago del pedido
  deliveredAt?: Date; // Fecha de envio del pedido
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productSlug: { type: String, required: true },
  productName: { type: String, required: true },
  productLeadImage: { type: String },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  itemPrice: { type: Number, required: true },
});

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  department: { type: String, required: true },
  contactPhoneNumber: { type: String, required: true },
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  storeSlug: { type: String, required: true, unique: true },
  storeName: { type: String, required: true },
  storeImageURL: { type: String },
  orderStatus: {
    type: String,
    enum: ['Awaiting Seller Approval', 'Waiting for Payment', 'Waiting for Delivery', 'Delivered', 'Cancelled', 'Rejected by Seller'],
    required: true,
  },
  orderItems: [OrderItemSchema],
  shippingAddress: ShippingAddressSchema,
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paidAt: { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true });

const OrderModel = mongoose.model<Order>("Order", OrderSchema);
export default OrderModel;
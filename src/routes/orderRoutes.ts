import express, { Request, Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/orderModel'
import Store from '../models/storeModel'
import Product from '../models/productModel'

const orderRouter = express.Router()

// Get a specific order
orderRouter.get(
  '/:orderId',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findOne({ _id: req.params.orderId })
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({ message: 'Lo sentimos, ese pedido no existe.' })
    }
  })
)

// Get All Orders from a specific User
orderRouter.get(
  '/user/:userId',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const allOrdersFromUser = await Order.find({ userId: userId })
    res.send(allOrdersFromUser)
  })
)

// Get All Orders from a Store by its ID
orderRouter.get(
  '/store/:storeId',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const storeId = req.params.storeId
    const allOrdersFromStore = await Order.find({ storeId: storeId })
    const store = await Store.findOne({ _id: storeId })

    if (!store) {
      res.status(404).send({ message: 'Lo sentimos, esa tienda no existe.' })
    } else {
      res.send({
        storeName: store.storeName,
        storeSlug: store.storeSlug,
        allOrdersFromStore: allOrdersFromStore,
      })
    }
  })
)

// Get All Orders from a Store by its slug
orderRouter.get(
  '/store-slug/:storeSlug',
  expressAsyncHandler(async (req: Request, res: Response) => {
    const storeSlug = req.params.storeSlug
    const store = await Store.findOne({ storeSlug: storeSlug })

    if (!store) {
      res.status(404).send({ message: 'Lo sentimos, esa tienda no existe.' })
    } else {
      const allOrdersFromStore = await Order.find({ storeId: store._id })
      res.send({
        storeName: store.storeName,
        storeSlug: store.storeSlug,
        allOrdersFromStore: allOrdersFromStore,
      })
    }
  })
)

// Create a new order
orderRouter.post(
  '/create',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const orderItems = req.body.orderItems

      // Create a map to track the total quantity of each product needed for the order
      const productQuantityMap = new Map()
      // Calculate the total quantity of each product needed for the order
      for (const item of orderItems) {
        const productId = item.productId
        const quantity = item.quantity
        if (!productQuantityMap.has(productId)) {
          productQuantityMap.set(productId, 0)
        }
        productQuantityMap.set(
          productId,
          productQuantityMap.get(productId) + quantity
        )
      }

      // Deduct the total quantity of each product needed for the order from the product stock
      for (const [productId, totalQuantity] of productQuantityMap.entries()) {
        const product = await Product.findById(productId)

        if (!product) {
          res
            .status(404)
            .send({ message: `Product with ID '${productId}' not found.` })
        } else {
          if (product.stockAmount < totalQuantity) {
            res
              .status(400)
              .send({
                message: `Insufficient stock for product '${product.productName}'.`,
              })
          }
          product.stockAmount -= totalQuantity
          // Save the updated product
          await product.save()
        }
      }

      // Create new order
      const newOrder = new Order({
        userId: req.body.userId,
        storeId: req.body.storeId,
        storeSlug: req.body.storeSlug,
        storeName: req.body.storeName,
        storeImageURL: req.body.storeImageURL,
        orderStatus: 'Awaiting Seller Approval',
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        paymentMethod: req.body.paymentMethod,
      })

      // Save new order to database
      const order = await newOrder.save()

      // Send response
      res.status(201).send(order)
    } catch (error) {
      console.error('Error during order creation: ', error)
      res
        .status(500)
        .send({ message: 'An error occurred during order creation.' })
    }
  })
)

// Update a specific order
orderRouter.put(
  '/update/:orderId',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params
      const newOrderData = req.body // Contains the updated order information

      // Check if the order status is 'Cancelled' or 'Rejected by Seller'
      if (
        newOrderData.orderStatus === 'Cancelled' ||
        newOrderData.orderStatus === 'Rejected by Seller'
      ) {
        const order = await Order.findById(orderId)
        if (!order) {
          res
            .status(404)
            .send({ message: 'Lo sentimos, ese pedido no existe.' })
        } else {
          const orderItems = order.orderItems
          // Create a map to track the total quantity of each product needed to be added back to the stock
          const productQuantityMap = new Map()
          // Calculate the total quantity of each product needed to be added back to the stock
          for (const item of orderItems) {
            const productId = item.productId
            const quantity = item.quantity
            if (!productQuantityMap.has(productId)) {
              productQuantityMap.set(productId, 0)
            }
            productQuantityMap.set(
              productId,
              productQuantityMap.get(productId) + quantity
            )
          }

          // Add back the total quantity of each product to the stock
          for (const [
            productId,
            totalQuantity,
          ] of productQuantityMap.entries()) {
            const product = await Product.findById(productId)
            if (!product) {
              res
                .status(404)
                .send({ message: `Product with ID '${productId}' not found.` })
            } else {
              // Add the quantity back to the available stock
              product.stockAmount += totalQuantity
              // Save the updated product
              await product.save()
            }
          }
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        newOrderData,
        { new: true }
      )

      if (updatedOrder) {
        res.send(updatedOrder) // Return the updated order data
      } else {
        res.status(404).send({ message: 'Lo sentimos, ese pedido no existe.' })
      }
    } catch (err) {
      console.error('Error updating order: ', err)
      res.status(500).send({
        message: 'An error occurred when updating a specific order.',
      })
    }
  })
)

export default orderRouter

import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ShippingAddress from "../models/shippingAddressModel";

const shippingRouter = express.Router();

// Get all shipping addresses from a given user
shippingRouter.get('/:userId', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find all shippingAddresses associated with the userId
    const shippingAddresses = await ShippingAddress.find({ userId });

    res.send(shippingAddresses); // Return the list of shippingAddresses even if its empty
  } catch (error) {
    console.error('Error fetching shippingAddresses: ', error);
    res.status(500).send({ message: 'An error occurred when fetching user shipping addresses.' });
  }
}));

// Create a shippingAddress
shippingRouter.post('/create', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    // Extract shippingAddress data from request body
    const { userId, fullName, address, city, department, contactPhoneNumber } = req.body;

    // Create new shippingAddress
    const newShippingAddress = new ShippingAddress({
      userId,
      fullName,
      address,
      city,
      department,
      contactPhoneNumber,
    });

    // Save new shippingAddress to database
    const shippingAddress = await newShippingAddress.save();
    res.status(201).send(shippingAddress);
  } catch (error) {
    console.error('Error creating shippingAddress: ', error);
    res.status(500).send({ message: 'An error occurred when creating a new shipping address.' });
  }
}));

// Update a specific shippingAddress by its id
shippingRouter.put('/update/:id', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedShippingAddressData = req.body; // Contains the updated shippingAddress information

    // Update the shippingAddress information in the database
    const updatedShippingAddress = await ShippingAddress.findByIdAndUpdate(id, updatedShippingAddressData, { new: true });

    if (updatedShippingAddress) {
      res.send(updatedShippingAddress); // Return the updated shippingAddress data
    } else {
      res.status(404).send({ message: 'No se encontró la dirección de envío.' });
    }
  } catch (error) {
    console.error('Error updating shippingAddress: ', error);
    res.status(500).send({ message: 'An error occurred when updating a shipping address.' });
  }
}));

// Delete a specific shippingAddress by its id
shippingRouter.delete('/delete/:id', expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete the shippingAddress from the database
    const deletedShippingAddress = await ShippingAddress.findByIdAndDelete(id);

    if (deletedShippingAddress) {
      res.send({ message: 'La dirección de envío ha sido eliminada exitosamente.' });
    } else {
      res.status(404).send({ message: 'No se encontró la dirección de envío.' });
    }
  } catch (error) {
    console.error('Error deleting shippingAddress: ', error);
    res.status(500).send({ message: 'An error occurred when deleting a shipping address.' });
  }
}));

export default shippingRouter;
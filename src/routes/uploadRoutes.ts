import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from 'streamifier';
import User from "../models/userModel";

const uploadRouter = express.Router();

const storage = multer.memoryStorage(); // Store uploaded files in memory.

// Define the file filter to allow only specified file types.
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Imagen invalida (solo .png, .jpeg y .webp permitido)"));
  }
};

// Creates the multer middleware with file size and file type filters.
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB file size limit.
  fileFilter,
});

uploadRouter.post(
  "/user/:userId",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).send({ message: "ID Usuario no fue enviado." });
      }

      const userFolderPath = `users/${userId}`;

      // Check if a folder with the user's ObjectID exists in Cloudinary.
      const folderExists = await cloudinary.api.sub_folders('', { root_folder: userFolderPath });

      // If the folder doesn't exist, create it.
      if (!folderExists.folders.some((folder: any) => folder.name === userId)) {
        await cloudinary.api.create_folder(userFolderPath);
      }

      // Check if there are files inside the user's folder.
      const folderContents = await cloudinary.api.resources({
        type: "upload",
        prefix: `${userFolderPath}/`, // Restrict to the user's folder.
      });

      // If files exist, delete them to replace with the new one.
      if (folderContents.resources.length > 0) {
        const publicIds = folderContents.resources.map(
          (resource: any) => resource.public_id
        );
        await cloudinary.api.delete_resources(publicIds);
      }

      // Uploads the file to Cloudinary in the user's folder.
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: userFolderPath, // Save to the user's folder.
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        if (req.file && req.file.buffer) {
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        } else {
          return res.status(400).send({
            message: "No subistes ninguna imagen. Intentelo nuevamente.",
          });
        }
      });

      // After a successful file upload.
      const publicUrl = result.secure_url;

      // Find the user in mongodb by ID.
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res
          .status(404)
          .send({ message: "Usuario no se pudo encontrar." });
      }

      // Update the user document with the pictureURL or create it if it doesnt exist.
      user.pictureURL = publicUrl;
      await user.save();

      res.send({ publicUrl });
    } catch (error) {
      console.error("Error uploading file to Cloudinary: ", error);
      res.status(500).send({
        message: "Error al subir la imagen. Por favor intentelo de nuevo.",
      });
    }
  }
);

export default uploadRouter;

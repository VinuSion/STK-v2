import mongoose, { Schema, Document } from "mongoose";

interface UserSettings {
  colorTheme: 'light' | 'dark' | 'system';
}

interface User extends Document {
  firstName: string; // Nombre
  lastName: string; // Apellido
  email: string; // Correo electronico
  password: string; // Contraseña
  isSeller: boolean;
  resetToken?: string; // Se utiliza para reestablecer/cambiar la contraseña
  pictureURL: string; // URL de la foto de perfil
  settings: UserSettings;
}

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, required: true, default: false },
    resetToken: { type: String },
    pictureURL: { type: String, default: "" },
    settings: { 
      colorTheme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;

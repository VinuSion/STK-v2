import mongoose, { Schema, Document } from "mongoose";

interface UserSettings {
  colorTheme: 'light' | 'dark' | 'system';
}

interface User extends Document {
  firstName: string; // Nombre del usuario
  lastName: string; // Apellido del usuario
  email: string; // Correo electronico del usuario
  password: string; // Contraseña del usuario
  isSeller: boolean; // Si el usuario es vendedor o no
  resetToken?: string; // Se utiliza para reestablecer/cambiar la contraseña del usuario
  pictureURL: string; // URL de la foto de perfil del usuario
  settings: UserSettings; // Configuracion de la cuenta del usuario
}

const UserSettingsSchema = new Schema({
  colorTheme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
});

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, required: true, default: false },
    resetToken: { type: String },
    pictureURL: { type: String, default: "" },
    settings: UserSettingsSchema,
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;

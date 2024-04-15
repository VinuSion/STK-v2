import jwt from "jsonwebtoken";

export const baseUrl = () => {
  return process.env.BASE_URL || "http://localhost:5000";
};
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const baseUrl = () => {
  return process.env.BASE_URL || "http://localhost:5000";
};

export const generateToken = (user: any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined in the environment variables.');
  }
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5d",
    }
  );
};

// export const isAuth = (req: Request, res: Response, next: NextFunction) => {
//   const authorization = req.headers.authorization;
//   if (authorization) {
//     const token = authorization.slice(7, authorization.length);
//     jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         res.status(401).send({ message: 'Invalid Token' });
//       } else {
//         req.user = decode;
//         next();
//       }
//     });
//   } else {
//     res.status(401).send({ message: 'No Token Supplied' });
//   }
// };

export const normalizeName = (name: string) => {
  const nameParts = name.split(/\s+/);
  const filteredNameParts = nameParts.filter((part) => part.trim() !== '');

  const formattedNameParts = filteredNameParts.map((part) =>
    part.toLowerCase() === 'la' ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  const normalizedName = formattedNameParts.join(' ');
  return normalizedName;
};

export const template = (resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
  </style>
</head>
<body style="background-color: #ffffff; font-family: 'Poppins', sans-serif; margin: 0; padding: 0;">
  <table
    align="center"
    role="presentation"
    cellspacing="0"
    cellpadding="0"
    border="0"
    width="100%"
    style="max-width: 600px; margin: 0 auto; padding: 20px 0 48px; border-collapse: collapse;"
  >
    <tr>
      <td style="text-align: center; padding: 20px 0;">
        <img
          alt="Artiheal"
          src="https://github.com/VinuSion/Artiheal/assets/56313573/3d61afd6-678f-4e6b-a374-e1bd03226948"
          width="230"
          height="70"
          style="display: block; outline: none; border: none; text-decoration: none; margin: 0 auto;"
        />
      </td>
    </tr>
    <tr>
      <td style="padding: 0 20px; text-align: center;">
        <p style="font-size: 16px; line-height: 26px; margin: 16px 0; text-align: justify;">
          Recientemente solicitaste un cambio de contraseña para tu cuenta en Artiheal. Si eres tú, puedes establecer una nueva contraseña aquí:
        </p>
        <a
          href="${resetLink}"
          target="_blank"
          style="background-color: #765eff; border-radius: 10px; color: #fff; font-size: 16px; text-decoration: none; text-align: center; display: inline-block; line-height: 100%; max-width: 100%; padding: 12px 24px; text-transform: none;"
        >
          Restablecer Contraseña
        </a>
        <p style="font-size: 16px; line-height: 26px; margin: 16px 0; text-align: justify;">
          Si no solicitaste un cambio de contraseña, has caso omiso a este mensaje. Para mantener tu cuenta segura, por favor no reenvíe este correo a nadie.
        </p>
        <p style="font-size: 16px; line-height: 26px; margin: 16px 0; text-align: left;">Cordialmente,<br />Artiheal</p>
        <hr style="width: 100%; border: none; border-top: 1px solid #eaeaea; border-color: #cccccc; margin: 20px 0;" />
        <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #8898aa;">
          © Artiheal - 2023 | Todos los derechos reservados
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
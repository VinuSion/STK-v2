import jwt from "jsonwebtoken";
import Review from "./models/reviewModel";

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

export const normalizeName = (name: string): string => {
  const nameParts = name.split(/\s+/);
  const filteredNameParts = nameParts.filter((part) => part.trim() !== '');

  const formattedNameParts = filteredNameParts.map((part) =>
    part.toLowerCase() === 'la' ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  const normalizedName = formattedNameParts.join(' ');
  return normalizedName;
};

export const generateRandomString = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const transformName = (input: string): string => {
  const specialCharacters = /['",.%&$^@#\-+={}]/g;
  const filteredStoreName = input.replace(specialCharacters, '');
  return filteredStoreName.toLowerCase().replace(/\s+/g, '-');
}

export const calculateAverageRating = async (productId: string) => {
  const reviews = await Review.find({ productId });
  const totalReviews = reviews.length;
  const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const newAverageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
  return { newAverageRating, totalReviews };
}

export const template = (resetLink: string): string => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
      .reset-link:hover {
        opacity: .8;
        transform: scale(1.02);
      }
    </style>
  </head>
  <body style="font-family: 'Poppins', sans-serif; margin: 0; padding: 0">
    <table
      align="center"
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px 0 48px;
        border-collapse: collapse;
      "
    >
      <tr>
        <td style="text-align: center; padding: 20px 0;">
          <img
            alt="StockStores Logo"
            src="https://res.cloudinary.com/stkv2/image/upload/v1715039510/vdw3crfbvumo4081r4oo.png"
            width="100"
            height="100"
            style="display: block; outline: none; border: none; text-decoration: none; margin: 0 auto;"
          />
        </td>
      </tr>
      <tr>
        <td style="padding: 0 20px; text-align: center">
          <p
            style="
              font-size: 16px;
              line-height: 26px;
              margin: 0;
              margin-bottom: 16px;
              text-align: justify;
            "
          >
            Recientemente solicitaste un cambio de contraseña para tu cuenta. Si
            eres tú, puedes establecer una nueva contraseña aquí:
          </p>
          <a
            href="${resetLink}"
            target="_blank"
            class="reset-link"
            style="
              background-color: #17ab75;
              color: white;
              cursor: pointer;
              border-radius: 10px;
              font-size: 16px;
              text-decoration: none;
              text-align: center;
              display: inline-block;
              line-height: 100%;
              max-width: 100%;
              padding: 12px 24px;
              text-transform: none;
            "
          >
            Restablecer Contraseña
          </a>
          <p
            style="
              font-size: 16px;
              line-height: 26px;
              margin: 16px 0;
              text-align: justify;
            "
          >
            Si no solicitaste un cambio de contraseña, has caso omiso a este
            mensaje. Para mantener tu cuenta segura, por favor no reenvíe este
            correo a nadie.
          </p>
          <p
            style="
              font-size: 16px;
              line-height: 26px;
              margin: 16px 0;
              text-align: left;
            "
          >
            Cordialmente,<br />🏪 Equipo STK
          </p>
          <hr
            style="
              width: 100%;
              border: none;
              border-top: 1px solid #eaeaea;
              border-color: #17ab75;
              margin: 20px 0;
            "
          />
          <p
            style="
              font-size: 12px;
              line-height: 24px;
              margin: 16px 0;
              color: #17ab75;
            "
          >
            © StockStores - 2024 | Todos los derechos reservados
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

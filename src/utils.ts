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
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #071d22;
          color: #ffffff;
        }

        .reset-link {
          color: #000000;
        }
      }

      @media (prefers-color-scheme: light) {
        body {
          background-color: #ffffff;
          color: #000000;
        }

        .reset-link {
          color: #ffffff;
        }
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
        <td style="text-align: center; padding-top: 20px">
          <svg
            width="300"
            height="80"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="2000"
            zoomAndPan="magnify"
            viewBox="0 0 1500 374.999991"
            height="500"
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
          >
            <defs>
              <g />
              <clipPath id="6e26d7ee77">
                <path
                  d="M 26 64 L 265 64 L 265 302 L 26 302 Z M 26 64 "
                  clip-rule="nonzero"
                />
              </clipPath>
              <clipPath id="01fd82ff7a">
                <path
                  d="M 0 176.636719 L 138.949219 37.6875 L 290.921875 189.664062 L 151.972656 328.609375 Z M 0 176.636719 "
                  clip-rule="nonzero"
                />
              </clipPath>
              <clipPath id="824165c7e1">
                <path
                  d="M 0 176.636719 L 138.949219 37.6875 L 290.921875 189.664062 L 151.972656 328.609375 Z M 0 176.636719 "
                  clip-rule="nonzero"
                />
              </clipPath>
            </defs>
            <g clip-path="url(#6e26d7ee77)">
              <g clip-path="url(#01fd82ff7a)">
                <g clip-path="url(#824165c7e1)">
                  <path
                    fill="#17ab75"
                    d="M 145.605469 232.246094 L 189.277344 188.574219 C 192.371094 185.480469 192.371094 180.402344 189.277344 177.308594 L 161.121094 149.152344 C 158.691406 146.722656 158.082031 143.246094 159.519531 140.152344 C 160.953125 137.0625 164.046875 135.292969 167.46875 135.625 L 240.347656 142.25 C 243.71875 142.527344 246.476562 144.84375 247.304688 148.101562 L 264.035156 210.546875 C 264.753906 213.363281 264.035156 216.179688 261.992188 218.222656 L 221.464844 258.746094 L 180.941406 299.273438 C 178.898438 301.316406 176.027344 302.089844 173.265625 301.316406 L 117.890625 286.464844 L 110.324219 284.421875 C 107.507812 283.703125 105.410156 281.605469 104.695312 278.789062 C 103.976562 275.972656 104.695312 273.15625 106.738281 271.113281 Z M 145.382812 133.75 L 184.308594 94.824219 C 186.351562 92.78125 187.125 89.910156 186.351562 87.148438 C 185.632812 84.332031 183.535156 82.234375 180.71875 81.519531 L 173.15625 79.476562 L 117.777344 64.621094 C 114.964844 63.90625 112.148438 64.621094 110.105469 66.664062 L 29.054688 147.714844 C 27.011719 149.757812 26.238281 152.628906 27.011719 155.390625 L 43.683594 217.890625 C 44.566406 221.203125 47.273438 223.46875 50.640625 223.742188 L 123.519531 230.367188 C 126.945312 230.699219 130.035156 228.933594 131.472656 225.839844 C 132.90625 222.75 132.300781 219.269531 129.871094 216.84375 L 101.710938 188.683594 C 98.621094 185.59375 98.621094 180.511719 101.710938 177.421875 Z M 145.382812 133.75 "
                    fill-opacity="1"
                    fill-rule="evenodd"
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(312.517249, 240.708198)">
                <g>
                  <path
                    d="M 58.976562 2.515625 C 88.824219 2.515625 107.167969 -11.6875 107.167969 -35.421875 C 107.167969 -55.382812 94.039062 -67.25 62.753906 -74.621094 C 43.515625 -79.117188 36.859375 -83.96875 36.859375 -91.703125 C 36.859375 -99.972656 44.234375 -105.007812 56.28125 -105.007812 C 69.40625 -105.007812 77.316406 -98.175781 77.316406 -86.847656 L 104.828125 -86.847656 C 104.828125 -112.199219 85.769531 -128.382812 55.921875 -128.382812 C 26.972656 -128.382812 8.992188 -114.179688 8.992188 -91.164062 C 8.992188 -70.664062 22.835938 -58.4375 52.324219 -52.144531 C 70.125 -48.367188 78.21875 -43.152344 78.21875 -34.34375 C 78.21875 -25.890625 70.664062 -21.039062 58.796875 -21.039062 C 44.953125 -21.039062 35.960938 -28.050781 35.960938 -40.097656 L 7.910156 -40.097656 C 7.910156 -14.023438 27.332031 2.515625 58.976562 2.515625 Z M 58.976562 2.515625 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(427.754175, 240.708198)">
                <g>
                  <path
                    d="M 59.15625 0 L 76.417969 0 L 76.417969 -23.734375 L 65.089844 -23.734375 C 54.300781 -23.734375 49.269531 -28.949219 49.269531 -39.917969 L 49.269531 -72.101562 L 75.160156 -72.101562 L 75.160156 -94.398438 L 49.269531 -94.398438 L 49.269531 -118.855469 L 28.050781 -118.855469 L 26.433594 -106.625 C 24.992188 -96.917969 22.296875 -94.398438 12.046875 -94.398438 L 3.597656 -94.398438 L 3.597656 -72.101562 L 21.9375 -72.101562 L 21.9375 -35.78125 C 21.9375 -12.765625 35.242188 0 59.15625 0 Z M 59.15625 0 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(511.709927, 240.708198)">
                <g>
                  <path
                    d="M 60.054688 2.515625 C 91.34375 2.515625 112.917969 -17.800781 112.917969 -47.289062 C 112.917969 -76.597656 91.34375 -96.917969 60.054688 -96.917969 C 28.589844 -96.917969 7.011719 -76.597656 7.011719 -47.289062 C 7.011719 -17.800781 28.589844 2.515625 60.054688 2.515625 Z M 33.984375 -47.289062 C 33.984375 -62.753906 44.773438 -73.542969 60.054688 -73.542969 C 75.339844 -73.542969 85.949219 -62.753906 85.949219 -47.289062 C 85.949219 -31.824219 75.339844 -21.039062 60.054688 -21.039062 C 44.773438 -21.039062 33.984375 -31.824219 33.984375 -47.289062 Z M 33.984375 -47.289062 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(631.6211, 240.708198)">
                <g>
                  <path
                    d="M 58.617188 2.515625 C 85.230469 2.515625 105.1875 -13.125 110.222656 -37.941406 L 83.609375 -37.941406 C 79.835938 -27.691406 70.484375 -21.039062 58.976562 -21.039062 C 44.234375 -21.039062 33.984375 -31.824219 33.984375 -47.289062 C 33.984375 -62.753906 44.234375 -73.542969 58.976562 -73.542969 C 69.765625 -73.542969 78.578125 -67.789062 83.070312 -58.257812 L 109.324219 -58.257812 C 105.007812 -81.632812 84.871094 -96.917969 58.617188 -96.917969 C 28.410156 -96.917969 7.011719 -76.238281 7.011719 -47.289062 C 7.011719 -18.160156 28.230469 2.515625 58.617188 2.515625 Z M 58.617188 2.515625 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(748.476046, 240.708198)">
                <g>
                  <path
                    d="M 13.664062 0 L 40.996094 0 L 40.996094 -35.960938 L 55.742188 -35.960938 L 76.597656 0 L 108.425781 0 L 81.273438 -45.132812 C 86.308594 -49.628906 90.265625 -55.921875 93.320312 -64.371094 L 104.289062 -94.398438 L 74.800781 -94.398438 L 68.148438 -73.902344 C 64.550781 -63.292969 59.515625 -60.414062 48.007812 -60.414062 L 40.996094 -60.414062 L 40.996094 -133.058594 L 13.664062 -133.058594 Z M 13.664062 0 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(861.555688, 240.708198)">
                <g>
                  <path
                    d="M 58.976562 2.515625 C 88.824219 2.515625 107.167969 -11.6875 107.167969 -35.421875 C 107.167969 -55.382812 94.039062 -67.25 62.753906 -74.621094 C 43.515625 -79.117188 36.859375 -83.96875 36.859375 -91.703125 C 36.859375 -99.972656 44.234375 -105.007812 56.28125 -105.007812 C 69.40625 -105.007812 77.316406 -98.175781 77.316406 -86.847656 L 104.828125 -86.847656 C 104.828125 -112.199219 85.769531 -128.382812 55.921875 -128.382812 C 26.972656 -128.382812 8.992188 -114.179688 8.992188 -91.164062 C 8.992188 -70.664062 22.835938 -58.4375 52.324219 -52.144531 C 70.125 -48.367188 78.21875 -43.152344 78.21875 -34.34375 C 78.21875 -25.890625 70.664062 -21.039062 58.796875 -21.039062 C 44.953125 -21.039062 35.960938 -28.050781 35.960938 -40.097656 L 7.910156 -40.097656 C 7.910156 -14.023438 27.332031 2.515625 58.976562 2.515625 Z M 58.976562 2.515625 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(976.792614, 240.708198)">
                <g>
                  <path
                    d="M 59.15625 0 L 76.417969 0 L 76.417969 -23.734375 L 65.089844 -23.734375 C 54.300781 -23.734375 49.269531 -28.949219 49.269531 -39.917969 L 49.269531 -72.101562 L 75.160156 -72.101562 L 75.160156 -94.398438 L 49.269531 -94.398438 L 49.269531 -118.855469 L 28.050781 -118.855469 L 26.433594 -106.625 C 24.992188 -96.917969 22.296875 -94.398438 12.046875 -94.398438 L 3.597656 -94.398438 L 3.597656 -72.101562 L 21.9375 -72.101562 L 21.9375 -35.78125 C 21.9375 -12.765625 35.242188 0 59.15625 0 Z M 59.15625 0 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(1060.748366, 240.708198)">
                <g>
                  <path
                    d="M 60.054688 2.515625 C 91.34375 2.515625 112.917969 -17.800781 112.917969 -47.289062 C 112.917969 -76.597656 91.34375 -96.917969 60.054688 -96.917969 C 28.589844 -96.917969 7.011719 -76.597656 7.011719 -47.289062 C 7.011719 -17.800781 28.589844 2.515625 60.054688 2.515625 Z M 33.984375 -47.289062 C 33.984375 -62.753906 44.773438 -73.542969 60.054688 -73.542969 C 75.339844 -73.542969 85.949219 -62.753906 85.949219 -47.289062 C 85.949219 -31.824219 75.339844 -21.039062 60.054688 -21.039062 C 44.773438 -21.039062 33.984375 -31.824219 33.984375 -47.289062 Z M 33.984375 -47.289062 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(1180.65954, 240.708198)">
                <g>
                  <path
                    d="M 13.664062 0 L 40.996094 0 L 40.996094 -41.714844 C 40.996094 -62.035156 50.527344 -69.585938 66.167969 -69.585938 L 76.597656 -69.585938 L 76.597656 -94.398438 L 66.347656 -94.398438 C 52.503906 -94.398438 43.695312 -90.625 37.578125 -81.8125 L 33.984375 -94.398438 L 13.664062 -94.398438 Z M 13.664062 0 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(1263.356902, 240.708198)">
                <g>
                  <path
                    d="M 58.257812 2.515625 C 81.453125 2.515625 99.792969 -9.351562 108.066406 -29.308594 L 80.375 -29.308594 C 75.878906 -23.015625 67.789062 -19.417969 58.796875 -19.417969 C 46.390625 -19.417969 36.679688 -26.433594 34.164062 -39.378906 L 109.863281 -39.378906 C 111.480469 -73.902344 90.984375 -96.917969 58.617188 -96.917969 C 28.050781 -96.917969 7.011719 -76.597656 7.011719 -47.289062 C 7.011719 -17.800781 27.871094 2.515625 58.257812 2.515625 Z M 34.34375 -56.640625 C 37.398438 -68.148438 46.75 -75.160156 58.796875 -75.160156 C 71.382812 -75.160156 80.375 -68.148438 83.429688 -56.640625 Z M 34.34375 -56.640625 "
                  />
                </g>
              </g>
            </g>
            <g fill="currentColor" fill-opacity="1">
              <g transform="translate(1380.032094, 240.708198)">
                <g>
                  <path
                    d="M 49.988281 2.515625 C 75.519531 2.515625 90.984375 -8.628906 90.984375 -26.613281 C 90.984375 -42.074219 79.476562 -51.964844 56.101562 -56.640625 C 39.917969 -59.875 34.882812 -62.574219 34.882812 -68.328125 C 34.882812 -73.902344 39.917969 -77.136719 48.007812 -77.136719 C 57.179688 -77.136719 62.753906 -73.003906 63.292969 -65.808594 L 89.363281 -65.808594 C 88.105469 -85.769531 73.363281 -96.917969 48.1875 -96.917969 C 22.835938 -96.917969 8.449219 -86.667969 8.449219 -68.328125 C 8.449219 -52.683594 19.238281 -43.332031 43.332031 -39.019531 C 57.898438 -36.5 64.011719 -32.726562 64.011719 -26.792969 C 64.011719 -21.21875 58.976562 -17.800781 50.347656 -17.800781 C 40.277344 -17.800781 34.164062 -22.65625 33.984375 -30.386719 L 7.191406 -30.386719 C 7.191406 -10.609375 24.09375 2.515625 49.988281 2.515625 Z M 49.988281 2.515625 "
                  />
                </g>
              </g>
            </g>
          </svg>
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

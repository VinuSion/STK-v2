import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      _id: '662e9ff190de30ba068ec9dd',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@mail.com',
      password: bcrypt.hashSync('password1'),
      isSeller: true,
      pictureURL: 'https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png',
      settings: {
        colorTheme: 'light',
      },
    },
    {
      _id: '662e9ff190de30ba068ec9df',
      firstName: 'David',
      lastName: 'Etinbruh',
      email: 'david@mail.com',
      password: bcrypt.hashSync('password2'),
      isSeller: true,
      pictureURL: 'https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png',
      settings: {
        colorTheme: 'dark',
      },
    },
    {
      _id: '662e9ff190de30ba068ec9e1',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@mail.com',
      password: bcrypt.hashSync('password3'),
      isSeller: false,
      pictureURL: '',
      settings: {
        colorTheme: 'dark',
      },
    },
    {
      _id: '662e9ff190de30ba068ec9e3',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@mail.com',
      password: bcrypt.hashSync('password4'),
      isSeller: false,
      pictureURL: '',
      settings: {
        colorTheme: 'system',
      },
    },
    {
      _id: '662e9ff190de30ba068ec9e5',
      firstName: 'James',
      lastName: 'Carson',
      email: 'james@mail.com',
      password: bcrypt.hashSync('password5'),
      isSeller: false,
      pictureURL: '',
      settings: {
        colorTheme: 'light',
      },
    },
  ],
  stores: [
    {
      _id: '662ed2b5018464a828769314',
      sellerId: '662e9ff190de30ba068ec9dd',
      sellerFirstName: 'John',
      sellerLastName: 'Doe',
      sellerPictureURL: 'https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png',
      storeSlug: 'tienda-mi-hermano-y-yo-y7litGv5Iq',
      storeName: 'Tienda Mi Hermano y Yo',
      storeDescription: 'La mejor tienda de barranquilla',
      storePhoneNumber: '3008972378',
      storeAddress: {
        address: 'Calle 30 Noseque #10-56',
        city: 'Barranquilla',
        department: 'Atlantico'
      },
      storeImageURL: 'https://muchosnegociosrentables.com/wp-content/uploads/2018/03/tienda-de-barrio-portada.jpg'
    },
    {
      _id: '662ed4b280858a4fbccf8a60',
      sellerId: '662e9ff190de30ba068ec9df',
      sellerFirstName: 'David',
      sellerLastName: 'Etinbruh',
      sellerPictureURL: 'https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png',
      storeSlug: 'la-parroquia-H2ftvX11BU',
      storeName: 'La Parroquia',
      storePhoneNumber: '3021982690',
      storeAddress: {
        address: 'Cra. 56 #34-09 Local 2',
        city: 'Barranquilla',
        department: 'Atlantico'
      },
      storeImageURL: 'https://www.america-retail.com/static//2022/08/tiendas-de-barrio-e1661266164434.jpg'
    },
  ],
  shippingAddresses: [
    {
      _id: '662ee62fec82b6455cb5ca4d',
      userId: '662e9ff190de30ba068ec9e1',
      fullName: 'Jane Smith',
      address: 'Cra. 23 #1-78 Piso Dos',
      city: 'Barranquilla',
      department: 'Atlantico',
      contactPhoneNumber: '3026737845',
    },
    {
      _id: '662ee7af010942f0e4fbcc93',
      userId: '662e9ff190de30ba068ec9e3',
      fullName: 'Alice Johnson',
      address: 'Calle 67 #2J8-89',
      city: 'Barranquilla',
      department: 'Atlantico',
      contactPhoneNumber: '3004516253',
    },
  ],
}

export default data;
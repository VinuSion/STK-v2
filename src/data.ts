import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
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
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@mail.com',
      password: bcrypt.hashSync('password2'),
      isSeller: false,
      pictureURL: '',
      settings: {
        colorTheme: 'dark',
      },
    },
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@mail.com',
      password: bcrypt.hashSync('password3'),
      isSeller: false,
      pictureURL: '',
      settings: {
        colorTheme: 'system',
      },
    },
  ],
}

export default data;
import { faker } from '@faker-js/faker';

export const mockUsers = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['Admin', 'Editor', 'Viewer']),
}));

export const mockProducts = Array.from({ length: 9 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  category: faker.commerce.department(),
  description: faker.commerce.productDescription(),
}));

// In-memory state
let users = [...mockUsers];
let products = [...mockProducts];

export const db = {
  getUsers: () => users,
  addUser: (user: unknown) => {
    const newUser = { ...(user ?? {}), id: faker.string.uuid() };
    users = [newUser, ...users];
    return newUser;
  },
  getProducts: () => products,
  addProduct: (product: unknown) => {
    const newProduct = { ...(product ?? {}), id: faker.string.uuid() };
    products = [newProduct, ...products];
    return newProduct;
  },
};

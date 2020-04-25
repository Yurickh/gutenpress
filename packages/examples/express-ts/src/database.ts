// This is here for entertainment and for example purposes only
// Please don't use this code for reference of anything in your life

export interface Order {
  id: string
  product: string
  value: number
}

export interface User {
  name: string
  phoneNumber: string
  orders: Order[]
}

type Database = {
  [id: string]: User
}

const DB = {
  admin: {
    name: 'Root user',
    phoneNumber: '+55000000',
    orders: [],
  },
} as Database

export const getUser = async (id: string): Promise<User> => DB[id]

const existsUser = async (id: string): Promise<boolean> =>
  (await getUser(id)) !== undefined

export const updateUser = async (
  id: string,
  user: Partial<User>,
): Promise<boolean> => {
  if (!(await existsUser(id))) return false

  DB[id] = {
    ...DB[id],
    ...user,
  }
  return true
}

export const deleteUser = async (id: string): Promise<boolean> => {
  if (!(await existsUser(id))) return false

  delete DB[id]
  return true
}

export const getOrdersForUser = async (userId: string): Promise<Order[]> =>
  DB[userId]?.orders || []

export const createOrderForUser = async (
  userId: string,
  order: Omit<Order, 'id'>,
): Promise<Order | undefined> => {
  if (!(await existsUser(userId))) return
  const orders = await getOrdersForUser(userId)

  const biggerId =
    orders.length === 0
      ? 0
      : Math.max(...orders.map((order) => parseInt(order.id)))
  const createdOrder = {
    ...order,
    id: String(biggerId + 1),
  }

  orders.push(createdOrder)

  return createdOrder
}

export const updateOrderForUser = async (
  userId: string,
  orderId: string,
  order: Partial<Order>,
): Promise<boolean> => {
  if (!(await existsUser(userId))) return false
  const orders = await getOrdersForUser(userId)

  const previousOrderIndex = orders.findIndex((order) => order.id === orderId)

  if (previousOrderIndex === -1) return false

  orders[previousOrderIndex] = {
    ...orders[previousOrderIndex],
    ...order,
    id: orders[previousOrderIndex].id,
  }

  return true
}

export const deleteOrderForUser = async (
  userId: string,
  orderId: string,
): Promise<boolean> => {
  if (!(await existsUser(userId))) return false
  const orders = await getOrdersForUser(userId)

  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) return false

  orders.splice(orderIndex, 1)
  return true
}

export const authenticate = async (
  username: string,
  password: string,
): Promise<boolean> => username === 'admin' && password === 'admin'

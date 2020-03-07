import { get, post, put, toRouter, wrap } from 'gutenpress'
import { login } from './actions/login'
import { authenticate } from './wrappers/authenticate'
import { getOrderById } from './actions/order/get'
import { createOrder } from './actions/order/create'
import { updateOrderById } from './actions/order/update'
import { contactDetails } from './actions/contact-details'

// TODO: add tests for types that ensure we scream if a method is placed in the wrong place
export default toRouter([
  post('/login', login),
  wrap(authenticate, [
    // You can declare endpoints inline
    get('/order/:id', getOrderById),
    post('/order', createOrder),
    put('/order/:id', updateOrderById),

    // Or import them from somewhere else
    contactDetails,
  ]),
])

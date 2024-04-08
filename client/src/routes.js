import Products from './views/Products/Products'
import Orders from './views/Orders/Orders'
import Users from './views/Users/Users'
import Dashboard from './views/dashboard/Dashboard'
import Cart from './views/Cart/Cart'

const routes = [
  //  Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Products },

  // Users
  { path: '/users', name: 'Users', element: Users },
 
  // Subscriptions
  { path: '/orders', name: 'Orders', element: Orders },
  // { path: '/products', name: 'Subscriptions', element: Products },
  { path: '/cart', name: 'Subscriptions', element: Cart },
]

export default routes

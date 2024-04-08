import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilDiamond,
  cilFile,
  cilList,
  cilHome,
  cilStorage,
  cilStar,
  cilUser,
  cilCart,
  cilOrder
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Products',
    to: '/dashboard',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Managements',
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/base',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/users',
      },
      // {
      //   component: CNavItem,
      //   name: 'Blocked Users',
      //   to: '/blocked-users',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Sub Admins',
      //   to: '/sub-admin',
      // },
    ]
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/orders',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Products',
  //   to: '/products',
  //   icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  // },  
  {
    component: CNavItem,
    name: 'Cart',
    to: '/cart',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
]

export default _nav

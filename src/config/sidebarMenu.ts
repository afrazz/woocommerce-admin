import {createElement} from 'react'

import {
   ShoppingCartOutlined,
   PieChartOutlined
} from "@ant-design/icons";

const SIDEBARMENU = [
    {
        key: 'orders',
        icon: createElement(ShoppingCartOutlined),
        label: `Orders`,
        path: '/dashboards/orders'
    },
    {
        key: 'default',
        icon: createElement(PieChartOutlined),
        label: `Others`,
        path: '/dashboards/default'
    }
]

export default SIDEBARMENU;
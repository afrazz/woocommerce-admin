import React, { useEffect, useRef } from "react";
import { Button, Table, Tag, Tooltip, Tour } from "antd";
import moment from "moment";
import { EyeFilled, FilterTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { TourProps, TableProps } from "antd";
import { saveToLocalStorage } from "utils/localstorage";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import {
  getOrders,
  setOrders,
  setorderTableParams,
  setOrderTour,
} from "store/slices/ordersSlice";
import { getQueryParams } from "utils/tableQueryParams";
import { OrdersListDataType } from "./interface";

type ColumnsType<T> = TableProps<T>["columns"];

const OrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orderTableParams, orders, loading, orderTourOpen } = useAppSelector(
    (state) => state.orders
  );

  const navigate = useNavigate();

  //-------------- Tours Setup
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const steps: TourProps["steps"] = [
    {
      title: "Status Filter",
      description: "Note: You can filter Status Of the Orders Here",
      target: () => ref1.current,
    },
    {
      title: "Pagination Issue For  WooCommerce API",
      description:
        "Note: WooCommerce API does not provide the total count of all data, which is why I have arbitrarily set the maximum results to 200. As a result, additional pagination pages may appear below.",
      target: () => ref2.current,
    },
  ];
  //----------------- Tours End

  // All Tables Columns
  const columns: ColumnsType<OrdersListDataType> = [
    {
      title: "Order ID",
      dataIndex: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "billing",
      render: (billing) => `${billing.first_name} ${billing.last_name}`,
    },
    {
      title: "Email & Phone",
      dataIndex: "billing",
      render: (billing) => `${billing.email}, ${billing.phone}`,
    },
    {
      title: "Order Created",
      dataIndex: "date_created",

      render: (date) => <>{moment(date).format("MMMM Do YYYY, h:mm:ss a")}</>,
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      render: (amount, item) => (
        <b>
          {item.currency}
          {amount}
        </b>
      ),
    },
    {
      title: "Total Items",
      dataIndex: "line_items",
      render: (line_items) => <b>{line_items?.length}</b>,
    },
    {
      title: "Status",
      dataIndex: "status",

      render: (status) => <Tag color="blue">{status}</Tag>,
      filterIcon: (filtered) => <FilterTwoTone ref={ref1} />,

      filters: [
        { text: "Any", value: "any" },
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "On Hold", value: "on-hold" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
        { text: "Refunded", value: "refunded" },
        { text: "Failed", value: "failed" },
        { text: "Trash", value: "trash" },
      ],
    },
    {
      title: "Actions",

      render: (_, item) => (
        <Tooltip title="View Order">
          <Button
            type="primary"
            icon={<EyeFilled />}
            onClick={() => navigate(`/dashboards/orders/${item.id}`)}
          >
            View Order
          </Button>
        </Tooltip>
      ),
    },
  ];

  // Fetching and dispatching Orders Data while any pagination or filters change
  useEffect(() => {
    const queries = getQueryParams(orderTableParams);
    dispatch(getOrders(queries));
  }, [
    orderTableParams.pagination?.current,
    orderTableParams.pagination?.pageSize,
    orderTableParams.filters,
  ]);

  // While Trigger This Function While any pagination, filters, sorters changes....
  const handleTableChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    // We will set new updated pagination, filters, sorters to our redux state
    dispatch(
      setorderTableParams({
        pagination,
        filters,
        ...sorter,
      })
    );

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== orderTableParams.pagination?.pageSize) {
      dispatch(setOrders([]));
    }
  };

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={orders}
        pagination={orderTableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: "auto" }}
      />
      <div className="float-end">
        <span ref={ref2}></span>
      </div>

      <Tour
        open={orderTourOpen}
        onClose={() => {
          // Tour Setup
          dispatch(setOrderTour(false));
          saveToLocalStorage("tourOpen", "true");
        }}
        steps={steps}
      />
    </>
  );
};

export default OrderList;

// import React, { useEffect, useRef, useState } from "react";
// import { Button, Table, Tag, Tooltip, Tour } from "antd";
// import type { GetProp, TableProps } from "antd";
// import orderServices from "services/orders";
// import moment from "moment";
// import { EyeFilled, FilterTwoTone, SearchOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// // Tours
// import type { TourProps } from "antd";
// import {
//   getItemFromLocalStorage,
//   saveToLocalStorage,
// } from "utils/localstorage";

// type ColumnsType<T> = TableProps<T>["columns"];
// type TablePaginationConfig = Exclude<
//   GetProp<TableProps, "pagination">,
//   boolean
// >;

// interface DataType {
//   id: number;
//   billing: {
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone: string;
//   };
//   date_created: string;
//   total: number;
//   status: string;
//   line_items: [{}];
// }

// interface TableParams {
//   pagination?: TablePaginationConfig;
//   sortField?: string;
//   sortOrder?: string;
//   filters?: Parameters<GetProp<TableProps, "onChange">>[1];
// }

// const getQueryParams = (params: TableParams) => {
//   const queryParams = {
//     per_page: params.pagination?.pageSize,
//     page: params.pagination?.current,
//     ...params.filters,
//   };
//   return queryParams;
//   // ...params,
// };

// const OrderList: React.FC = () => {
//   const [data, setData] = useState<DataType[]>();
//   const [loading, setLoading] = useState(false);
//   const [tableParams, setTableParams] = useState<TableParams>({
//     pagination: {
//       current: 1,
//       pageSize: 5,
//     },
//   });

//   // Tours setup
//   const [openTour, setOpenTour] = useState<boolean>(false);
//   const ref1 = useRef(null);
//   const steps: TourProps["steps"] = [
//     {
//       title: "Status Filter",
//       description: "You can filter Status Of the Order here",
//       target: () => ref1.current,
//     },
//   ];
//   // Tours End

//   const navigate = useNavigate();

//   const columns: ColumnsType<DataType> = [
//     {
//       title: "Order ID",
//       dataIndex: "id",
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "billing",
//       render: (billing) => `${billing.first_name} ${billing.last_name}`,
//     },
//     {
//       title: "Email & Phone",
//       dataIndex: "billing",
//       render: (billing) => `${billing.email}, ${billing.phone}`,
//     },
//     {
//       title: "Order Created",
//       dataIndex: "date_created",

//       render: (date) => <>{moment(date).format("MMMM Do YYYY, h:mm:ss a")}</>,
//     },
//     {
//       title: "Total Amount",
//       dataIndex: "total",
//       render: (amount) => <b>₹{amount}</b>,
//     },
//     {
//       title: "Total Items",
//       dataIndex: "line_items",
//       render: (line_items) => <b>{line_items?.length}</b>,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",

//       render: (status) => <Tag color="blue">{status}</Tag>,
//       filterIcon: (filtered) => <FilterTwoTone ref={ref1} />,

//       filters: [
//         { text: "Any", value: "any" },
//         { text: "Pending", value: "pending" },
//         { text: "Processing", value: "processing" },
//         { text: "On Hold", value: "on-hold" },
//         { text: "Completed", value: "completed" },
//         { text: "Cancelled", value: "cancelled" },
//         { text: "Refunded", value: "refunded" },
//         { text: "Failed", value: "failed" },
//         { text: "Trash", value: "trash" },
//       ],
//     },
//     {
//       title: "Actions",

//       render: (_, item) => (
//         <Tooltip title="View Order">
//           <Button
//             type="primary"
//             icon={<EyeFilled />}
//             onClick={() => navigate(`/dashboards/orders/${item.id}`)}
//           >
//             View Order
//           </Button>
//         </Tooltip>
//       ),
//     },
//   ];

//   const fetchData = async () => {
//     const paginationQueries = getQueryParams(tableParams);
//     console.log(paginationQueries);

//     setLoading(true);

//     const data = await orderServices.getOrder(paginationQueries);

//     console.log(data);
//     setData(data);
//     setLoading(false);
//     setTableParams({
//       ...tableParams,
//       pagination: {
//         ...tableParams.pagination,
//         total: 200,
//         pageSizeOptions: [1, 2, 3, 5, 10, 20, 50, 100],
//         // 200 is mock data, you should read it from server
//         // total: data.totalCount,
//       },
//     });
//     // Opening Tour
//     const isTourOpen = getItemFromLocalStorage("tourOpen");
//     if (!isTourOpen) {
//       setOpenTour(true);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // Tour
//   }, [
//     tableParams.pagination?.current,
//     tableParams.pagination?.pageSize,
//     tableParams.filters,
//   ]);

//   const handleTableChange: TableProps["onChange"] = (
//     pagination,
//     filters,
//     sorter
//   ) => {
//     setTableParams({
//       pagination,
//       filters,
//       ...sorter,
//     });

//     // `dataSource` is useless since `pageSize` changed
//     if (pagination.pageSize !== tableParams.pagination?.pageSize) {
//       setData([]);
//     }
//   };

//   return (
//     <>
//       <Table
//         columns={columns}
//         rowKey={(record) => record.id}
//         dataSource={data}
//         pagination={tableParams.pagination}
//         loading={loading}
//         onChange={handleTableChange}
//         scroll={{ x: "auto" }}
//       />
//       <Tour
//         open={openTour}
//         onClose={() => {
//           setOpenTour(false);
//           saveToLocalStorage("tourOpen", "true");
//         }}
//         steps={steps}
//       />
//     </>
//   );
// };

// export default OrderList;

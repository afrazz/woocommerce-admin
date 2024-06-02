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
          {item.currency} {amount}
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

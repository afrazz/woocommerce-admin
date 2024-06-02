import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, InputNumber, notification } from "antd";
import orderServices from "services/orders";
import { useAppDispatch } from "hooks/useStore";
import { getOrderById } from "store/slices/ordersSlice";

type FieldType = {
  quantity?: number;
};

interface IProps {
  initialValue: number;
  orderId: number;
  orderItemId: number;
  productId: number;
  orderDetails: any;
  closeForm: () => void;
}

const QuantityForm: React.FC<IProps> = ({
  initialValue,
  orderId,
  orderItemId,
  orderDetails,
  closeForm,
  //   items,
}) => {
  const [formLoading, setFormLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const dispatch = useAppDispatch();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setFormLoading(true);
    if (values.quantity) {
      const updatedLineItem = {
        id: orderItemId,
        quantity: values.quantity,
      };

      // Find the line item to update
      const lineItem = orderDetails.line_items.find(
        (item: any) => item.id === updatedLineItem.id
      );

      if (lineItem) {
        // Update the line item quantity
        lineItem.quantity = updatedLineItem.quantity;

        // Calculate the new subtotal and total prices
        const pricePerUnit = lineItem.price;
        const newSubtotal = pricePerUnit * lineItem.quantity;
        const newTotal = newSubtotal;

        lineItem.subtotal = newSubtotal.toFixed(2);
        lineItem.subtotal_tax = (
          ((newSubtotal / 100) * lineItem.subtotal_tax) /
          lineItem.subtotal
        ).toFixed(2);
        lineItem.total = newTotal.toFixed(2);
        lineItem.total_tax = (
          ((newTotal / 100) * lineItem.total_tax) /
          lineItem.total
        ).toFixed(2);
      }

      // Recalculate the overall order totals
      let newOrderSubtotal = 0;
      let newOrderTotal = 0;
      let newOrderTotalTax = 0;

      orderDetails.line_items.forEach((item: any) => {
        newOrderSubtotal += parseFloat(item.subtotal);
        newOrderTotal += parseFloat(item.total);
        newOrderTotalTax += parseFloat(item.total_tax);
      });

      orderDetails.subtotal = newOrderSubtotal.toFixed(2);
      orderDetails.total = newOrderTotal.toFixed(2);
      orderDetails.total_tax = newOrderTotalTax.toFixed(2);

      // Prepare the data to update
      const updatedOrderData = {
        line_items: orderDetails.line_items.map(
          ({
            id,
            quantity,
            subtotal,
            subtotal_tax,
            total,
            total_tax,
          }: any) => ({
            id,
            quantity,
            subtotal,
            subtotal_tax,
            total,
            total_tax,
          })
        ),
        subtotal: orderDetails.subtotal,
        total: orderDetails.total,
        total_tax: orderDetails.total_tax,
      };

      await orderServices.updateOrderById(orderId, updatedOrderData);

      dispatch(getOrderById(orderId));
      closeForm();
      setFormLoading(false);

      api["success"]({
        message: "Successfuly Updated Quantity",
        description:
          "Also Updated Order total, subtotal, tax total, orderItem Total etc...",
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ quantity: initialValue }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Quantity"
          name="quantity"
          style={{ width: "300px" }}
          rules={[
            {
              type: "number",
              message: "Please Enter Valid Number",
            },
            {
              required: true,
              message: "Please input Quantity!",
            },
          ]}
        >
          <InputNumber min={1} max={100} />
        </Form.Item>

        <Form.Item className="ml-6">
          <Button type="primary" htmlType="submit" loading={formLoading}>
            Update Quantity
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default QuantityForm;

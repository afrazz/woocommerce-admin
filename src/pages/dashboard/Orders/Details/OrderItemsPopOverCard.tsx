import { Button, Popover } from "antd";
import { useState } from "react";
import QuantityForm from "./QuantityForm";
import { EditFilled } from "@ant-design/icons";

const OrderItemsPopOverCard = ({ item, orderDetails, getOrderById }: any) => {
  // It's from Redux state.. it's inmuttable so that's why we need deep clone
  const orderDetailsDeepClone = JSON.parse(JSON.stringify(orderDetails));

  const [openQuantityForm, setOpenQuantity] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpenQuantity(newOpen);
  };

  const closeOpenQuantityForm = () => {
    setOpenQuantity(false);
  };
  return (
    <Popover
      content={
        <QuantityForm
          initialValue={item.quantity}
          orderId={orderDetails.id}
          orderItemId={item.id}
          productId={item.product_id}
          orderDetails={orderDetailsDeepClone}
          closeForm={closeOpenQuantityForm}
        />
      }
      // title="Update Quantity"
      trigger="click"
      open={openQuantityForm}
      onOpenChange={handleOpenChange}
    >
      <Button
        type="primary"
        icon={<EditFilled />}
        size="large"
        className="w-10/12"
      >
        Edit Quantity
      </Button>
    </Popover>
  );
};

export default OrderItemsPopOverCard;

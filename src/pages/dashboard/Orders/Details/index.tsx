import { Card, Col, Flex, Row, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import OrderItemsPopOverCard from "./OrderItemsPopOverCard";
import Loader from "components/ui/Loader";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { getOrderById } from "store/slices/ordersSlice";
import orderServices from "services/orders";

const orderStatus = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
  { value: "trash", label: "Trash" },
];

const Details = () => {
  const dispatch = useAppDispatch();

  const { singleOrder, loading } = useAppSelector((state) => state.orders);
  const [status, setStatus] = useState("");

  let { id } = useParams();

  const { Meta } = Card;

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [id]);

  const handleChange = async (value: string) => {
    await orderServices.updateOrderById(id, { status: value });

    setStatus(value);

    notification.success({
      message: `Updated Order to ${value}`,
    });
  };

  useEffect(() => {
    if (singleOrder) {
      setStatus(singleOrder.status);
    }
  }, [singleOrder]);

  return (
    <>
      {loading && !singleOrder?.id ? (
        <Loader />
      ) : (
        singleOrder?.id && (
          <>
            <Flex justify="space-between" wrap="wrap">
              <div>
                <h1>OrderID: #{singleOrder.id}</h1>
                <p>
                  Order Placed At:{" "}
                  <b className="text-black">
                    {moment(singleOrder.date_created).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </b>
                </p>
                <p>
                  Total Amount:{" "}
                  <b className="text-black">
                    {singleOrder.currency} {singleOrder.total}
                  </b>
                </p>
                <p>
                  Total Tax:{" "}
                  <b className="text-black">
                    {singleOrder.currency} {singleOrder.total_tax}
                  </b>
                </p>
              </div>

              <div>
                <h2>
                  Status:{" "}
                  <Select
                    defaultValue={singleOrder.status}
                    value={status}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={orderStatus}
                  />
                  {/* <Tag color="blue">{singleOrder.status}</Tag> */}
                </h2>
              </div>
            </Flex>

            <h2>Ordered Items:</h2>
            <Row>
              {singleOrder?.line_items.map((cur: any) => (
                <Col md={6} lg={6} sm={12} xs={24} key={cur.id}>
                  <Card
                    style={{ width: "100%" }}
                    cover={<img alt="product" src={cur.image.src} />}
                    actions={[
                      <OrderItemsPopOverCard
                        item={cur}
                        orderDetails={singleOrder}
                      />,
                    ]}
                  >
                    <Meta
                      title={cur.name}
                      description={
                        <>
                          <p>
                            Qty: <b className="text-black">{cur.quantity}</b>
                          </p>
                          <p>
                            Price:{" "}
                            <b className="text-black">
                              {singleOrder.currency} {cur.price}
                            </b>
                          </p>
                          <p>
                            Sub Total:{" "}
                            <b className="text-black">
                              {singleOrder.currency} {cur.subtotal}
                            </b>
                          </p>
                          <p>
                            Total:{" "}
                            <b className="text-black">
                              {singleOrder.currency} {cur.total}
                            </b>
                          </p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <Row gutter={16} className="mt-4">
              <Col md={12} lg={12} sm={12} xs={24}>
                <Card title="Billing Details">
                  {Object.entries(singleOrder.billing).map(([key, value]) => {
                    return (
                      <>
                        {key}: {value ? value : "-"}
                        <br />
                      </>
                    );
                  })}
                </Card>
              </Col>
              <Col md={12} lg={12} sm={12} xs={24}>
                <Card title="Shipping Details">
                  {Object.entries(singleOrder.shipping).map(([key, value]) => {
                    return (
                      <>
                        {key}: {value ? value : "-"}
                        <br />
                      </>
                    );
                  })}
                </Card>
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
};

export default Details;

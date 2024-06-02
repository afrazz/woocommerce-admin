import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification } from "antd";
import { Rule } from "antd/lib/form";
import React from "react";
import { useAppDispatch } from "hooks/useStore";
import { signIn } from "store/slices/authSlice";

const Login: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useAppDispatch();

  const initialCredential = {
    email: "",
    password: "",
  };

  const validationRules: { [key: string]: Rule[] } = {
    email: [
      {
        required: true,
        message: "Please input your email",
      },
      {
        type: "email",
        message: "Please enter a validate email!",
      },
    ],
    password: [
      {
        required: true,
        message: "Please input your password",
      },
    ],
  };

  const onLogin = (values: { email: string; password: string }) => {
    const { email, password } = values;

    dispatch(signIn({ email, password }));
  };

  return (
    <div className="h-screen bg-gray-300 flex justify-center items-center">
      {contextHolder}

      <Card
        title="Please Login As Admin"
        className="max-sm:w-11/12 w-2/4"
        bordered={false}
      >
        <Form
          layout="vertical"
          name="login-form"
          initialValues={initialCredential}
          onFinish={onLogin}
        >
          <Form.Item name="email" label="Email" rules={validationRules.email}>
            <Input prefix={<MailOutlined className="text-primary" />} />
          </Form.Item>
          <Form.Item
            name="password"
            label={
              <div>
                <span>Password</span>
              </div>
            }
            rules={validationRules.password}
          >
            <Input.Password
              prefix={<LockOutlined className="text-primary" />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              // loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
          {/* {otherSignIn ? renderOtherSignIn : null} */}
        </Form>
      </Card>
    </div>
  );
};

export default Login;

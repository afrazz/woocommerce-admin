import { Avatar, Dropdown, Layout, Space, theme } from "antd";
import type { MenuProps } from "antd";
import { signOut } from "store/slices/authSlice";
import { useAppDispatch } from "hooks/useStore";
import React from "react";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const { Header: AntdHeader } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuProps["items"] = [
    {
      label: <span onClick={() => dispatch(signOut())}>Logout</span>,
      key: "0",
    },
  ];

  return (
    <AntdHeader className="p-0 bg-white flex items-center justify-end px-4">
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Avatar
          style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
          size={"large"}
        >
          A
        </Avatar>
      </Dropdown>
    </AntdHeader>
  );
};

export default Header;

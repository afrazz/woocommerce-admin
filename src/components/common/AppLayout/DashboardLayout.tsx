import React, { ReactNode, Suspense, useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import SIDEBARMENU from "config/sidebarMenu";
import Header from "../Header";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "components/ui/Loader";

const { Content, Footer, Sider } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState("");

  let location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const { pathname } = location;
    const splitPathname = pathname.split("/");
    const findIndex = splitPathname.findIndex((cur) => cur === "dashboards");
    setSelectedKey(splitPathname[findIndex + 1]);
  }, [location]);

  const handleMenuSelect = ({ item }: { item: any }) => {
    navigate(item.props.path);
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuSelect}
          //   defaultSelectedKeys={["orders"]}

          selectedKeys={[selectedKey]}
          items={SIDEBARMENU}
        />
      </Sider>
      <Layout>
        <Header />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ecommerce Demo Admin panel ©{new Date().getFullYear()} Created by
          Afras
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

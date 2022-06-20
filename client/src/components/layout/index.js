import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined, BellOutlined } from "@ant-design/icons";
import Sider from "../sider";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../_actions/user_actions";
function MainLayout({ children }) {
  const dispatch = useDispatch();
  return (
    <Layout>
      <Sider />

      <Layout.Content style={{ paddingInline: "2%" }}>
        <Layout.Header
          style={{
            backgroundColor: "white",
            marginBottom: "2%",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              height: "100%",
              justifyContent: "flex-end",
              gap: "2%",
            }}
          >
            <Button
              type="link"
              ghost
              onClick={() => {
                dispatch(logoutUser()).then(() => {
                  window.location.href = "/login";
                });
              }}
              icon={<LogoutOutlined />}
            />
          </div>
        </Layout.Header>
        {children}
      </Layout.Content>
    </Layout>
  );
}

export default MainLayout;

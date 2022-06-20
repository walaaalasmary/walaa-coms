import React from "react";
import { Layout } from "antd";
import UserProfile from "../user-profile";
import SideMenu from "../side-menu";
import Logo from '../../assets/logo_transparent';
function Sider() {
  return (
    <Layout.Sider theme="light">
      <Logo />
      <UserProfile />
      <SideMenu />
    </Layout.Sider>
  );
}

export default Sider;

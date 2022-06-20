import React from "react";
import {
  DashboardFilled,
  SettingFilled,
  BankFilled,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { auth } from "../../_actions/user_actions";

function SideMenu() {
  var parts = window.location.href.split("/");
  var lastSegment = parts.pop() || parts.pop();
  const [userInfo, setUserInfo] = React.useState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(auth()).then((user) => {
      setUserInfo(user.payload);
    });
  }, []);
  const Menus = React.useCallback(() => {
    if (userInfo?.role)
      return (
        <>
          <Menu.Item
            onClick={(info) => (window.location.href = `/${info.key}`)}
            icon={<DashboardFilled />}
            key=""
          >
            Dashboard
          </Menu.Item>
          {["admin"].includes(userInfo?.role) && (
            <Menu.Item
              onClick={(info) => (window.location.href = `/${info.key}`)}
              icon={<UserSwitchOutlined />}
              key="users"
            >
              Users
            </Menu.Item>
          )}
          {["admin"].includes(userInfo?.role) && (
            <Menu.Item
              onClick={(info) => (window.location.href = `/${info.key}`)}
              icon={<BankFilled />}
              key="colleges"
            >
              Colleges
            </Menu.Item>
          )}
          {["admin", "dean"].includes(userInfo.role) && (
            <Menu.Item
              onClick={(info) => (window.location.href = `/${info.key}`)}
              icon={<BankFilled />}
              key="departments"
            >
              Departments
            </Menu.Item>
          )}
          {[
            "dean",
            "head-of-department",
            "reporter",
            "member",
            "head-of-committee",
          ].includes(userInfo?.role) && (
            <Menu.Item
              onClick={(info) => (window.location.href = `/${info.key}`)}
              icon={<BankFilled />}
              key="Commitees"
            >
              Commitees
            </Menu.Item>
          )}
          {[
            "dean",
            "head-of-department",
            "reporter",
            "member",
            "head-of-committee",
          ].includes(userInfo?.role) && (
            <Menu.Item
              onClick={(info) => (window.location.href = `/${info.key}`)}
              icon={<BankFilled />}
              key="meetings"
            >
              Meetings
            </Menu.Item>
          )}
          <Menu.Item
            onClick={(info) => (window.location.href = `/${info.key}`)}
            icon={<SettingFilled />}
            key="settings"
          >
            Settings
          </Menu.Item>
        </>
      );
    else return <></>;
  }, [userInfo]);
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[lastSegment]}
      style={{ height: "100%", borderRight: 0 }}
    >
      {Menus()}
    </Menu>
  );
}

export default SideMenu;

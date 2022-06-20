import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./Landing";
import LoginPage from "./Login";
import ResetPage from "./Reset-user";
import ResetPasswordPage from "./Reset-password";
import { Layout } from "antd";
import CollegePage from "./College";
import CommitteePage from "./Committee";
import MeetingsPage from "./Meetings";
import UsersPage from "./Users";
import DepartmentsPage from "./Department";
import SettingsPage from "./Settings";
import {
  ConfigProvider
} from 'antd'
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  ConfigProvider.config({
    theme: {
      primaryColor: '#73B098',

    },
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/reset" component={Auth(ResetPage, false)} />
          <Route
            exact
            path="/reset-password/:token"
            component={Auth(ResetPasswordPage, false)}
          />
          <Route exact path="/colleges" component={Auth(CollegePage, true)} />
          <Route exact path="/meetings" component={Auth(MeetingsPage, true)} />
          <Route exact path="/settings" component={Auth(SettingsPage, true)} />
          <Route
            exact
            path="/departments"
            component={Auth(DepartmentsPage, true)}
          />
          <Route exact path="/users" component={Auth(UsersPage, true)} />
          <Route
            exact
            path="/Commitees"
            component={Auth(CommitteePage, true)}
          />
        </Switch>
      </Layout>
    </Suspense>
  );
}

export default App;

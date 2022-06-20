import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Card, Checkbox, Typography } from "antd";
import { useDispatch } from "react-redux";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from '../assets/logo_transparent';
const { Title } = Typography;
function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  const initialUsername = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")
    : "";

  return (
    <Formik
      initialValues={{
        username: initialUsername,
        password: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .email("Username is invalid")
          .required("Username is required"),
        password: Yup.string()
          .min(4, "Password must be at least 4 characters")
          .required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.username,
            password: values.password,
          };

          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem("userId", response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem("rememberMe", values.username);
                } else {
                  localStorage.removeItem("rememberMe");
                }
                props.history.push("/");
              } else {
                setFormErrorMessage("Check out your Account or Password again");
              }
            })
            .catch((err) => {
              setFormErrorMessage("Check out your Account or Password again");
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "url('https://source.unsplash.com/random/?productivity,city')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "100%"
            }}
          >
            <Card>
              <Logo />
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                  alignSelf: "center",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                <Title
                  style={{
                    textAlign: "center",
                  }}
                  level={2}
                >
                  Log In
                </Title>
                <Form.Item required>
                  <Input
                    id="username"
                    prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Enter your username"
                    type="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.username && touched.username
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.username && touched.username && (
                    <div style={{ marginTop: "2%" }} className="input-feedback">
                      {errors.username}
                    </div>
                  )}
                </Form.Item>

                <Form.Item required>
                  <Input
                    id="password"
                    prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Enter your password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.password && touched.password && (
                    <div style={{ marginTop: "2%" }} className="input-feedback">
                      {errors.password}
                    </div>
                  )}
                </Form.Item>

                {formErrorMessage && (
                  <label>
                    <p
                      style={{
                        color: "#ff0000bf",
                        fontSize: "0.7rem",
                        border: "1px solid",
                        padding: "1rem",
                        borderRadius: "10px",
                      }}
                    >
                      {formErrorMessage}
                    </p>
                  </label>
                )}

                <Form.Item>
                  <Checkbox
                    id="rememberMe"
                    onChange={handleRememberMe}
                    checked={rememberMe}
                  >
                    Remember me
                  </Checkbox>
                  <a
                    className="login-form-forgot"
                    href="/reset"
                    style={{ float: "right" }}
                  >
                    Forgot password
                  </a>
                  <div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      style={{ minWidth: "100%" }}
                      disabled={isSubmitting}
                      onSubmit={handleSubmit}
                    >
                      Login
                    </Button>
                  </div>
                </Form.Item>
              </form>
            </Card>

          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);

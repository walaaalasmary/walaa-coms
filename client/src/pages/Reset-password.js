import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {  changePass } from "../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Typography } from "antd";
import { useDispatch } from "react-redux";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
const { Title } = Typography;

function ResetPasswordPage({ match }) {
  const dispatch = useDispatch();

  const [formErrorMessage, setFormErrorMessage] = useState("");

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(4, "Password must be at least 4 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .required("Required")
          .oneOf([Yup.ref("password"), null], "Passwords must match"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            password: values.password,
            token: match.params.token,
          };

          dispatch(changePass(dataToSubmit))
            .then((response) => {
              if (!response.payload.success)
                setFormErrorMessage("error, cant change password");
              else window.location.href = "/login";
            })
            .catch((err) => {
              setFormErrorMessage("Error in connection");
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
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: "30%",
                alignSelf: "center",
                justifyContent: "center",
                height: "100%",
                marginTop: "10%",
              }}
            >
              <Title
                style={{
                  textAlign: "center",
                }}
                level={2}
              >
                reset password
              </Title>
              <Form.Item required>
                <Input
                  id="password"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Enter your new password"
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
              <Form.Item required>
                <Input
                  id="confirmPassword"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Confirm the password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div style={{ marginTop: "2%" }} className="input-feedback">
                    {errors.confirmPassword}
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
                <a
                  className="login-form-forgot"
                  href="/login"
                  style={{ float: "right" }}
                >
                  Or go back to login
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
                    Reset Password
                  </Button>
                </div>
              </Form.Item>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(ResetPasswordPage);

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { resetPassword } from "../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Typography } from "antd";
import { useDispatch } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
const { Title } = Typography;

function ResetPage(props) {
  const dispatch = useDispatch();

  const [formErrorMessage, setFormErrorMessage] = useState("");

  return (
    <Formik
      initialValues={{
        username: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .email("Username is invalid")
          .required("Username is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.username,
          };

          dispatch(resetPassword(dataToSubmit))
            .then((response) => {
              if (!response.payload.success)
                setFormErrorMessage("Error in connection");
              else setFormErrorMessage("Email is sent if the email exists");
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
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
                Forgot Password
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
                  <div className="input-feedback">{errors.username}</div>
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

export default withRouter(ResetPage);

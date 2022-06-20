import React from "react";
import { Card, notification } from "antd";
import { Row, Col } from "antd";
import { Input, Avatar } from "antd";
import MainLayout from "../components/layout";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { auth, updateUser } from "../_actions/user_actions";
function SettingsPage() {
  const [UserForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [formErrorMessage, setFormErrorMessage] = React.useState("");

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(auth()).then((res) => {
      const record = res.payload;
      UserForm.setFieldsValue({
        college: record.college?._id,
        department: record.department?._id,
        university: record.university?._id,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        phoneNumber: record.phoneNumber,
        role: record.role,
        _id: record._id,
      });
    });
  }, [UserForm, dispatch]);

  return (
    <>
      <MainLayout>
        <Row gutter={0}>
          <Col span={24}>
            <Card>
              <Card.Meta title="User Profile" />
              <Row style={{ marginTop: "5%" }}>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Avatar size={250} icon={<UserOutlined />} />
                </Col>
                <Col span={12}>
                  <Form name="create-user" form={UserForm}>
                    <Form.Item noStyle name="_id">
                      <Input disabled type={"hidden"} />
                    </Form.Item>
                    <Form.Item disabled name="role">
                      <Select
                        disabled
                        placeholder="Choose role"
                        optionFilterProp="children"
                      ></Select>
                    </Form.Item>
                    <Form.Item name="firstName">
                      <Input placeholder="user first name" />
                    </Form.Item>
                    <Form.Item name="lastName">
                      <Input placeholder="user last name" />
                    </Form.Item>
                    <Form.Item name="email">
                      <Input type={"email"} placeholder="user email" />
                    </Form.Item>
                    <Form.Item name="phoneNumber">
                      <Input placeholder="Phone Number" />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      style={{ minWidth: "100%" }}
                      loading={confirmLoading}
                      onClick={async () => {
                        setConfirmLoading(true);
                        await dispatch(
                          updateUser({
                            _id: UserForm.getFieldValue("_id"),
                            firstName: UserForm.getFieldValue("firstName"),
                            lastName: UserForm.getFieldValue("lastName"),
                            email: UserForm.getFieldValue("email"),
                            university: UserForm.getFieldValue("university"),
                            college: UserForm.getFieldValue("college"),
                            department: UserForm.getFieldValue("department"),
                            phoneNumber: UserForm.getFieldValue("phoneNumber"),
                            role: UserForm.getFieldValue("role"),
                          })
                        ).then((response) => {
                          if (!response.payload.success)
                            notification.info({
                              message: `profile update was not successful`,
                              placement: "bottomRight",
                              type: "danger",
                            });
                          notification.info({
                            message: `profile update success`,
                            placement: "bottomRight",
                            type: "success",
                          });
                          setConfirmLoading(false);
                        });
                      }}
                    >
                      update profile
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card>
            <Card>
              <Card.Meta title="Change Password" />
              <Col span={24}>
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
                      .oneOf(
                        [Yup.ref("password"), null],
                        "Passwords must match"
                      ),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      let dataToSubmit = {
                        _id: UserForm.getFieldValue("_id"),
                        password: values.password,
                      };

                      dispatch(updateUser(dataToSubmit))
                        .then((response) => {
                          if (!response.payload.success)
                            notification.info({
                              message: `password change was not successful`,
                              placement: "bottomRight",
                              type: "danger",
                            });
                          else
                            notification.info({
                              message: `password change success`,
                              placement: "bottomRight",
                              type: "success",
                            });
                        })
                        .catch((err) => {
                          notification.info({
                            message: `password change was not successful`,
                            placement: "bottomRight",
                            type: "danger",
                          });
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
                          alignContent: "flex-start",
                          justifyContent: "flex-start",
                        }}
                      >
                        <form
                          onSubmit={handleSubmit}
                          style={{
                            height: "100%",
                            marginTop: "5%",
                          }}
                        >
                          <Form.Item required>
                            <Input
                              id="password"
                              prefix={
                                <LockOutlined
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
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
                              <div
                                style={{ marginTop: "2%" }}
                                className="input-feedback"
                              >
                                {errors.password}
                              </div>
                            )}
                          </Form.Item>
                          <Form.Item required>
                            <Input
                              id="confirmPassword"
                              prefix={
                                <LockOutlined
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              placeholder="Confirm the password"
                              type="password"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                errors.confirmPassword &&
                                touched.confirmPassword
                                  ? "text-input error"
                                  : "text-input"
                              }
                            />
                            {errors.confirmPassword && touched.confirmPassword && (
                              <div
                                style={{ marginTop: "2%" }}
                                className="input-feedback"
                              >
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
              </Col>
            </Card>
          </Col>
        </Row>
      </MainLayout>
    </>
  );
}

export default SettingsPage;

import React, { useRef } from "react";
import { Card } from "antd";
import { Row, Col } from "antd";
import {
  Input,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Menu,
  Dropdown,
} from "antd";
import MainLayout from "../components/layout";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ProTable from "@ant-design/pro-table";
import { useDispatch } from "react-redux";
import { colleges } from "../_actions/college_actions";
import {
  committees,
  createCommittee,
  updateCommittee,
  removeCommittee,
} from "../_actions/committee_actions";
import { users, auth } from "../_actions/user_actions";
import moment from "moment";
import { universities } from "../_actions/university_actions";
import { departments } from "../_actions/department_actions";

const { RangePicker } = DatePicker;

function CommitteePage() {
  const actionRef = useRef();
  const [CommitteeForm] = Form.useForm();
  const [userInfo, setUserInfo] = React.useState();
  const [Operation, setOperation] = React.useState("Create");
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [collegesData, setCollegesData] = React.useState([]);
  const [usersData, setUsersData] = React.useState([]);
  const [userEditLoading, setUserEditLoading] = React.useState(false);
  const [departmentsData, setDepartmentsData] = React.useState([]);
  const showModal = () => {
    setOperation("Create");
    setVisible(true);
  };
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch();
  const [universitiesData, setUniversitiesData] = React.useState([]);
  React.useEffect(() => {
    dispatch(auth()).then((user) => {
      setUserInfo(user.payload);
    });
  }, [dispatch]);
  const columns = [
    {
      title: "Name",
      dataIndex: "subject",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        placeholder: "Search committee",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "head of committee",
      width: "15%",
      render: (i) => {
        return <p>{i.headOfCommitte?.firstName}</p>;
      },
      search: false,
    },
    {
      title: "reporter",
      width: "15%",
      render: (i) => {
        return <p>{i.reporter?.firstName || "-"}</p>;
      },
      search: false,
    },
    {
      title: "# of meetings",
      width: "15%",
      render: (i) => {
        return <p>{i.meetings?.length ?? 0}</p>;
      },
      search: false,
    },
    {
      title: "Action",
      valueType: "option",
      render: (text, record, _, action) =>
        ["admin", "dean", "head-of-committee", "head-of-department"].includes(
          userInfo?.role
        ) && [
          <Dropdown.Button
            overlay={
              <Menu>
                <Menu.Item
                  type="link"
                  loading={userEditLoading}
                  key="editable"
                  onClick={() => {
                    setUserEditLoading(true);
                    dispatch(universities()).then((res) => {
                      setUniversitiesData(res.payload.universities);
                      dispatch(
                        colleges({ university: record.university?._id })
                      ).then((res) => {
                        setCollegesData(res.payload.colleges);
                        dispatch(
                          departments({ college: record.college?._id })
                        ).then((res) => {
                          setDepartmentsData(res.payload.departments);
                          dispatch(
                            users({ college: record.college?._id })
                          ).then((res) => {
                            setUsersData(res.payload.users);
                            CommitteeForm.setFieldsValue({
                              college: record.college?._id,
                              department: record.department?._id,
                              university: record.university?._id,
                              headOfCommittee: record.headOfCommitte?._id,
                              category: record.category,
                              beginEndPeriod: [
                                moment(record.beginPeriod),
                                moment(record.endPeriod),
                              ],
                              subject: record.subject,
                              reporter: record.reporter?._id,
                              members: record.members?.map((i) => i?._id),
                              _id: record._id,
                            });
                            setOperation("Update");
                            setUserEditLoading(false);
                            setVisible(true);
                          });
                        });
                      });
                    });
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  type="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  key="view"
                  onClick={() => {
                    setConfirmLoading(true);
                    dispatch(removeCommittee(record._id))
                      .then((res) => {
                        setConfirmLoading(false);
                        actionRef.current.reload();
                      })
                      .catch((res) => {
                        setConfirmLoading(false);
                      });
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          ></Dropdown.Button>,
        ],
    },
  ];

  return (
    <>
      <MainLayout>
        <Row gutter={0}>
          <Col span={24}>
            <Card>
              <Card.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title="Commitees"
                description="List of all commitees"
              />
            </Card>
          </Col>
          <Col span={24}>
            <ProTable
              columns={columns}
              request={async (params, sort, filter) => {
                const res = await dispatch(committees(params, sort, filter));
                return {
                  data: res.payload.committes,
                  success: res.payload.success,
                  total: res.payload.total,
                };
              }}
              actionRef={actionRef}
              setPagination={setPagination}
              pagination={pagination}
              editable={{
                type: "multiple",
              }}
              rowKey="_id"
              search={{
                labelWidth: "auto",
              }}
              dateFormatter="string"
              toolBarRender={() => [
                (userInfo?.role === "dean" ||
                  userInfo?.role === "head-of-department") && (
                  <Button
                    onClick={() => {
                      dispatch(universities()).then((res) => {
                        setUniversitiesData(res.payload.universities);
                        dispatch(colleges()).then((res) => {
                          setCollegesData(res.payload.colleges);
                          dispatch(departments()).then((res) => {
                            setDepartmentsData(res.payload.departments);
                            dispatch(users({ university: userInfo.university._id })).then(res => {
                              setUsersData(res.payload.users)
                              CommitteeForm.setFieldsValue({
                                university: userInfo.university?._id,
                                college: userInfo.college?._id,
                                department: userInfo.department?._id,
                              });
                              showModal();
                            })

                          });
                        });
                      });
                    }}
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    Create Committee
                  </Button>
                ),
              ]}
            />
          </Col>
        </Row>
      </MainLayout>
      <Modal
        title="Create Committee"
        visible={visible}
        onOk={CommitteeForm.submit}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setVisible(false);
          setOperation("Create");
          setConfirmLoading(false);
          CommitteeForm.resetFields();
        }}
      >
        <Form
          name="create-committee"
          form={CommitteeForm}
          onFinish={async () => {
            setConfirmLoading(true);
            if (Operation === "Create")
              await dispatch(
                createCommittee({
                  subject: CommitteeForm.getFieldValue("subject"),
                  beginPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[0],
                  endPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[1],
                  university: CommitteeForm.getFieldValue("university"),
                  college: CommitteeForm.getFieldValue("college"),
                  department: CommitteeForm.getFieldValue("department"),
                  headOfCommitte:
                    CommitteeForm.getFieldValue("headOfCommittee"),
                  reporter: CommitteeForm.getFieldValue("reporter"),
                  members: CommitteeForm.getFieldValue("members"),
                  category: CommitteeForm.getFieldValue("category"),
                })
              )
                .then(() => {
                  setVisible(false);
                  CommitteeForm.resetFields();
                  actionRef.current.reload();
                })
                .finally(() => {
                  setConfirmLoading(false);
                });
            if (Operation === "Update")
              await dispatch(
                updateCommittee({
                  _id: CommitteeForm.getFieldValue("_id"),
                  subject: CommitteeForm.getFieldValue("subject"),
                  beginPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[0],
                  endPeriod: CommitteeForm.getFieldValue("beginEndPeriod")[1],
                  university: CommitteeForm.getFieldValue("university"),
                  college: CommitteeForm.getFieldValue("college"),
                  department: CommitteeForm.getFieldValue("department"),
                  headOfCommitte:
                    CommitteeForm.getFieldValue("headOfCommittee"),
                  reporter: CommitteeForm.getFieldValue("reporter"),
                  members: CommitteeForm.getFieldValue("members"),
                })
              )
                .then(() => {
                  setVisible(false);
                  CommitteeForm.resetFields();
                  actionRef.current.reload();
                })
                .finally(() => {
                  setConfirmLoading(false);
                });
          }}
        >
          <Form.Item name="_id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item required name="category">
            <Select
              disabled={Operation === "update"}
              placeholder="Choose category"
            >
              <Select.Option value={"university"}>University</Select.Option>
              <Select.Option value={"college"}>College</Select.Option>
              <Select.Option value={"section"}>Section</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item required name="university">
            <Select
              showSearch
              placeholder="Choose university"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(colleges({ university: i })).then((res) => {
                  setCollegesData(res.payload.colleges);
                });
                dispatch(users()).then((res) => {
                  setUsersData(res.payload.users);
                });
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {universitiesData.map((university) => (
                <Select.Option value={university._id}>
                  {university.universityName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            required
            style={{
              display:
                CommitteeForm.getFieldValue("category") === "university"
                  ? "none"
                  : "block",
            }}
            name="college"
          >
            <Select
              disabled={collegesData.length < 1}
              showSearch
              placeholder="Choose college"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(departments({ college: i })).then((res) => {
                  setDepartmentsData(res.payload.departments);
                });
                dispatch(users({ college: i })).then((res) => {
                  setUsersData(res.payload.users);
                });
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {collegesData.map((college) => (
                <Select.Option value={college._id}>
                  {college.collegeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              display:
                CommitteeForm.getFieldValue("category") === "university"
                  ? "none"
                  : "block",
            }}
            name="department"
          >
            <Select
              disabled={departmentsData.length < 1}
              showSearch
              placeholder="Choose department"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentsData.map((department) => (
                <Select.Option value={department._id}>
                  {department.departmentName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item required name="subject">
            <Input placeholder="subject" />
          </Form.Item>
          <Form.Item required name="beginEndPeriod">
            <RangePicker />
          </Form.Item>
          <Form.Item required name="headOfCommittee">
            <Select
              disabled={usersData.length < 1}
              showSearch
              placeholder="Choose head of committee"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {usersData.map((user) => (
                <Select.Option value={user._id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="reporter">
            <Select
              disabled={usersData.length < 1}
              showSearch
              placeholder="Choose reporter"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {usersData.map((user) => (
                <Select.Option value={user._id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="members">
            <Select
              mode="tags"
              disabled={usersData.length < 1}
              showSearch
              placeholder="Choose members"
              optionFilterProp="children"

            >
              {usersData.map((user) => (
                <Select.Option value={user._id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CommitteePage;

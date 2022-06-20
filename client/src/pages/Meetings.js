import React, { useRef, useState } from "react";
import { Card } from "antd";
import { Row, Col } from "antd";
import {
  Input,
  Avatar,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import MainLayout from "../components/layout";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import ProTable from "@ant-design/pro-table";
import {
  ChatEngineWrapper,
  ChatSocket,
  ChatHeader,
  ChatFeed,
  ChatSettings,
} from "react-chat-engine";
import { useDispatch } from "react-redux";
import { colleges } from "../_actions/college_actions";
import {
  createMeeting,
  reportMeeting,
  meetings,
} from "../_actions/meeting_actions";
import { committees } from "../_actions/committee_actions";
import { auth, users } from "../_actions/user_actions";
import { universities } from "../_actions/university_actions";
import { departments } from "../_actions/department_actions";
function MeetingsPage() {
  const actionRef = useRef();
  const [MeetingForm] = Form.useForm();
  const [ReporterForm] = Form.useForm();
  const [Operation, setOperation] = React.useState("Create");
  const [userInfo, setUserInfo] = React.useState({});
  const [visible, setVisible] = React.useState(false);
  const [meeting, setMeeting] = React.useState({});
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [collegesData, setCollegesData] = React.useState([]);
  const [usersData, setUsersData] = React.useState([]);
  const [committeesData, setCommittesData] = React.useState([]);
  const [chatModal, setChatModal] = React.useState(false);
  const [repoterModal, setRepoterModal] = React.useState(false);
  const dispatch = useDispatch();
  const [departmentsData, setDepartmentsData] = React.useState([]);
  React.useEffect(() => {
    dispatch(auth()).then((user) => {
      setUserInfo(user.payload);
    });
  }, [dispatch]);
  const showModal = () => {
    setOperation("Create");
    setVisible(true);
  };
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const [universitiesData, setUniversitiesData] = React.useState([]);
  const columns = [
    {
      title: "Comittee",
      render: (i) => <p>{i.committe?.subject}</p>,
      formItemProps: {
        placeholder: "Search Meeting",
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      search: false,
    },
    {
      title: "Date",
      render: (i) => {
        const d = new Date(i.date);
        var datestring =
          ("0" + d.getDate()).slice(-2) +
          "-" +
          ("0" + (d.getMonth() + 1)).slice(-2) +
          "-" +
          d.getFullYear();

        return <p>{datestring}</p>;
      },
      search: false,
    },
    {
      title: "Time",
      render: (i) => <p>{i.time} hours</p>,
      dataIndex: "time",
      search: false,
    },
    {
      title: "Meeting room",
      dataIndex: "meetingRoom",
      search: false,
    },
    {
      title: "Members",
      key: "Link",
      dataIndex: "Link",
      hideInSearch: true,
      render: (text, record, _, action) => (
        <a href={text}>Click to view Members</a>
      ),
    },
    {
      title: "Action",
      valueType: "option",
      render: (text, record, _, action) =>
        [
          "dean",
          "head-of-department",
          "head-of-committee",
          "reporter",
          "member",
        ].includes(userInfo?.role) && [
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Button
            type="link"
            onClick={() => {
              setChatModal(true);
              setMeeting(record);
            }}
          >
            Join
          </Button>,
          userInfo.role === "reporter" ? (
            <Button
              type="link"
              onClick={() => {
                setMeeting(record);
                ReporterForm.setFieldsValue({
                  report: record.report,
                });
                setRepoterModal(true);
              }}
            >
              repoter
            </Button>
          ) : (
            <></>
          ),
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
                title="Meetings"
                description="List of all meetings"
              />
            </Card>
          </Col>
          <Col span={24}>
            <ProTable
              columns={columns}
              request={async (params, sort, filter) => {
                const res = await dispatch(meetings(params, sort, filter));
                return {
                  data: res.payload.meetings,
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
                userInfo?.role === "head-of-committee" && (
                  <Button
                    onClick={() => {
                      dispatch(universities()).then((res) => {
                        setUniversitiesData(res.payload.universities);
                        dispatch(colleges()).then((res) => {
                          setCollegesData(res.payload.colleges);
                          dispatch(departments()).then((res) => {
                            setDepartmentsData(res.payload.departments);
                            dispatch(committees()).then((res) => {
                              setCommittesData(res.payload.committees);
                              dispatch(users({ college: userInfo.college?._id })).then((res) => {
                                setUsersData(res.payload.users);
                                MeetingForm.setFieldsValue({
                                  university: userInfo.university?._id,
                                  college: userInfo.college?._id,
                                  department: userInfo.department?._id,
                                  committe: userInfo.committe?._id,
                                });
                              });

                            });
                            showModal();
                          });
                        });
                      });
                    }}
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    Create Meeting
                  </Button>
                ),
              ]}
            />
          </Col>
        </Row>
      </MainLayout>
      <Modal
        title="Create Meeting"
        visible={visible}
        onOk={async () => {
          setConfirmLoading(true);
          if (Operation === "Create")
            await dispatch(
              createMeeting({
                subject: MeetingForm.getFieldValue("subject"),
                meetingRoom: MeetingForm.getFieldValue("meetingRoom"),
                members: MeetingForm.getFieldValue("members"),
                university: MeetingForm.getFieldValue("university"),
                department: MeetingForm.getFieldValue("department"),
                committe: MeetingForm.getFieldValue("committee"),
                college: MeetingForm.getFieldValue("college"),
                date: MeetingForm.getFieldValue("date"),
                time: MeetingForm.getFieldValue("time"),
              })
            ).then(() => {
              setVisible(false);
              setConfirmLoading(false);
              MeetingForm.resetFields();
              actionRef.current.reload();
            });
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setVisible(false);
          setOperation("Create");
          MeetingForm.resetFields();
        }}
      >
        <Form name="create-meeting" form={MeetingForm}>
          <Form.Item name="university">
            <Select
              showSearch
              placeholder="Choose university"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(colleges({ university: i })).then((res) => {
                  setCollegesData(res.payload.colleges);
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
          <Form.Item name="college">
            <Select
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
          <Form.Item name="department">
            <Select
              showSearch
              placeholder="Choose department"
              optionFilterProp="children"
              onChange={(i) => {
                dispatch(committees({ department: i })).then((res) => {
                  setCommittesData(res.payload.committes);
                });
              }}
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
          <Form.Item name="committee">
            <Select
              disabled={!MeetingForm.getFieldValue("department")}
              showSearch
              placeholder="Choose committee"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {committeesData?.map((committe) => (
                <Select.Option value={committe._id}>
                  {committe.subject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subject">
            <Input placeholder="Meeting subject" />
          </Form.Item>
          <Form.Item name="meetingRoom">
            <Input placeholder="Meeting room" />
          </Form.Item>
          <Form.Item name="date">
            <DatePicker style={{ width: "100%" }} placeholder="meeting date" />
          </Form.Item>
          <Form.Item name="time">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="meeting time in hours"
            />
          </Form.Item>
          <Form.Item name="members">
            <Select
              disabled={!MeetingForm.getFieldValue("college")}
              mode="multiple"
              showSearch
              placeholder="Add Members"
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
        </Form>
      </Modal>
      <Modal
        width={"90%"}
        height={"90%"}
        centered
        visible={chatModal}
        onCancel={() => {
          setChatModal(false);
        }}
        footer={null}
        bodyStyle={{
          display: "flex",
          flexDirection: "row",
          paddingBottom: 0,
          paddingTop: "5%",
          height: "90%",
        }}
      >
        <ChatEngineWrapper>
          <ChatSocket
            projectID="daedec64-83a9-4c95-b048-2fa8474789ea"
            chatID={meeting.chatId}
            chatAccessKey={meeting.chatAccessKey}
            senderUsername={userInfo.email}
          />
          <ChatHeader />
          <ChatFeed activeChat={meeting.chatId} />
          <ChatSettings />
        </ChatEngineWrapper>
      </Modal>
      <Modal
        title="report on Meeting"
        centered
        visible={repoterModal}
        onCancel={() => {
          setRepoterModal(false);
          ReporterForm.resetFields();

        }}
        onOk={async () => {
          setConfirmLoading(true);
          await dispatch(
            reportMeeting(meeting._id, {
              report: ReporterForm.getFieldValue("report"),
            })
          ).then((res) => {
            setVisible(false);
            setConfirmLoading(false);
            actionRef.current.reload();
          });
        }}
        confirmLoading={confirmLoading}
      >
        <Form name="set-report" form={ReporterForm}>
          <Form.Item name="report">
            <Input.TextArea
              style={{ width: "100%" }}
              placeholder="meeting report"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default MeetingsPage;

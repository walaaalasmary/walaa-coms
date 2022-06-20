import React from "react";
import { BankFilled, UserOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Statistic, Row, Col } from "antd";
import { Table } from "antd";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import MainLayout from "../components/layout";
import { departments } from "../_actions/department_actions";
import { useDispatch } from "react-redux";
import { auth, users } from "../_actions/user_actions";
import { colleges } from "../_actions/college_actions";
import { committees } from "../_actions/committee_actions";
import { meetings } from "../_actions/meeting_actions";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function LandingPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState({})
  const [departmentsArray, setDepartments] = React.useState([]);
  const [committeesArray, setCommitteesArray] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState();
  const [meetingsArray, setMeetingsArray] = React.useState([]);
  const [usersNumber, setUserNumber] = React.useState(0);
  const [chartData, setChartData] = React.useState([]);
  const [collegesNumber, setCollegesNumber] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    let _userInfo = {}
    dispatch(auth()).then((res) => {
      setUserInfo(res.payload);
      _userInfo = { ...res.payload }
      Promise.all([
        dispatch(users()),
        dispatch(departments()),
        dispatch(colleges()),
        dispatch(committees()),
        dispatch(meetings()),
      ])
        .finally(() => {
          setLoading(false);
        })
        .then((res) => {
          setUserNumber(res[0].payload.users.length);
          setDepartments([...res[1].payload.departments]);
          setChartData(
            [...res[1].payload.departments].map((i) => {
              return { name: i.departmentName, value: i.members.length };
            })
          );
          setCollegesNumber(res[2].payload.colleges.length);
          setCommitteesArray(res[3].payload.committes);
          setMeetingsArray(res[4].payload.meetings);
          if (_userInfo.role !== 'head-of-department' || _userInfo.role !== 'head-of-committee') {
            setTableData({
              data: [...res[1].payload.departments],
              header: "latest departments",
              columns: [
                {
                  title: "Name",
                  dataIndex: "departmentName",
                },
                {
                  title: "University",
                  render: (department) => (
                    <p>{department.university?.universityName ?? "-"}</p>
                  ),
                },
                {
                  title: "College",
                  render: (department) => <p>{department.college?.collegeName ?? "-"}</p>,
                },
              ]
            });
          }
          else if (_userInfo.role === 'head-of-department') {
            setTableData({
              data: [...res[3].payload.commitees],
              header: "latest commitees",
              columns: [
                {
                  title: "subject",
                  dataIndex: "subject",
                },
                {
                  title: "University",
                  render: (committee) => (
                    <p>{committee.university?.universityName ?? "-"}</p>
                  ),
                },
                {
                  title: "College",
                  render: (committee) => <p>{committee.college?.collegeName ?? "-"}</p>,
                },
              ]
            });
          }
          else if (_userInfo.role === 'head-of-committee') {
            setTableData({
              data: [...res[3].payload.committes],
              header: "latest commitees",
              columns: [
                {
                  title: "subject",
                  dataIndex: "subject",
                },
                {
                  title: "University",
                  render: (committee) => (
                    <p>{committee.university?.universityName ?? "-"}</p>
                  ),
                },
                {
                  title: "College",
                  render: (committee) => <p>{committee.college?.collegeName ?? "-"}</p>,
                },
              ]
            });
          }
        });
    });
  }, [dispatch]);
  return (
    <MainLayout>
      <Row gutter={8}>
        <Col span={6}>
          <Card bordered>
            <Statistic
              title="Total of Users"
              value={usersNumber}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        {userInfo?.role === "admin" && (
          <Col span={6}>
            <Card>
              <Statistic
                title="Total of Colleges"
                value={collegesNumber}
                prefix={<BankFilled />}
              />
            </Card>
          </Col>
        )}
        {userInfo?.role !== "head-of-department" &&
          userInfo?.role !== "head-of-committee" &&
          userInfo?.role !== "member" &&
          userInfo?.role !== "reporter" && (
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total of Departments"
                  value={departmentsArray.length}
                  prefix={<BankFilled />}
                />
              </Card>
            </Col>
          )}
        <Col span={6}>
          <Card>
            <Statistic
              title="Total of Commitees"
              value={committeesArray.length}
              prefix={<BankFilled />}
            />
          </Card>
        </Col>
        {userInfo?.role !== "admin" && (
          <Col span={6}>
            <Card>
              <Statistic
                title="Total of Meetings"
                value={meetingsArray.length}
                prefix={<BankFilled />}
              />
            </Card>
          </Col>
        )}
      </Row>
      <Row gutter={8}>
        <Col span={16}>
          <Table
            title={(p) => <h3>{tableData.header}</h3>}
            columns={tableData.columns}
            dataSource={tableData.data}
            data
            loading={loading}
            pagination={false}
          />
        </Col>
        <Col span={8}>
          <Card
            style={{ height: "100%", width: "100%" }}
            bodyStyle={{ height: "100%" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={30}
                  fill="#8884d8"
                  outerRadius={40}
                >
                  {departmentsArray
                    .map((i) => {
                      return {
                        name: i.departmentName,
                        value: i.members.length,
                      };
                    })
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}

export default LandingPage;

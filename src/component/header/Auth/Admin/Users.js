import moment from "moment";
import {
  Form,
  Space,
  Table,
  Button,
  Descriptions,
  message,
  Popconfirm,
  Select,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteManyUser,
  deleteUser,
  editUserRequest,
  getAllUsers,
} from "../../../../redux/apiRequest";
import Loading from "../../../SupportTab/Loading";

import { Input } from "antd";
import { createAxios } from "../../../../redux/createInstance";
import { getAllUsersSuccess } from "../../../../redux/slice/userSlice";
const defaultExpandable = {
  expandedRowRender: (record) => <div>{record.description}</div>,
};

const MenuUser = ({ currentUser }) => {
  const [searchSelector, setSearchSelector] = useState("username");
  const [inputSearch, setInputSearch] = useState("");
  const [editUser, setEditUser] = useState(false);
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("large");
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState();
  const [top, setTop] = useState("none");
  const [bottom, setBottom] = useState("bottomRight");
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState();
  const [listUsers, setListUsers] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [newUserEdit, setNewUserEdit] = useState({
    id: "",
    username: "",
    email: "",
    money: "",
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, getAllUsersSuccess);

  useEffect(() => {
    getAllUsers(user?.accessToken, dispatch, axiosJWT).then((users) => {
      setIsLoading(false);
      setListUsers(users);
    });
  }, [updatedUser]);
  const { TextArea } = Input;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Admin",
      dataIndex: "admin",
      sorter: (a, b) => a.admin.localeCompare(b.admin),
    },
    {
      title: "Email",
      dataIndex: "email",
      filters: [
        {
          text: "Gmail",
          value: "gmail",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Icloud",
          value: "icloud",
        },
      ],
      onFilter: (value, record) => {
        const domain = record.email.split("@")[1];
        if (value === "gmail") {
          return domain === "gmail.com";
        } else if (value === "email") {
          return domain === "email.com";
        } else if (value === "icloud") {
          return domain === "icloud.com";
        }
        return false;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          className="bg-red-500 flex items-center"
          type="primary"
          onClick={() => {
            if (window.confirm(`B???n c?? ch???c ch???n mu???n x??a ${record.name} ?`)) {
              handleDeleteUser(record.id);
            } else {
              // N???u ng?????i d??ng ch???n Cancel
              // H???y b??? h??nh ?????ng c???a b???n ??? ????y
            }
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const text = "B???n c?? ch???c ch???n mu???n s???a?";
  const description = "are you sure...";
  // h??m x??c nh???n s???a user
  const confirmEdit = () => {
    handleEditUser();
    setEditUser(false);
    message.info("S???a th??nh c??ng");
  };

  const filteredData = listUsers.filter((item) => {
    return item[searchSelector]
      .toLowerCase()
      .includes(inputSearch.toLowerCase());
  });

  const data = [];
  if (filteredData) {
    filteredData.forEach((user, index) => {
      data.push({
        key: index,
        money: user.money,
        name: user.username,
        id: user._id,
        email: user.email,
        admin: user.isAdmin ? "Admin" : "Th??nh vi??n",
        isEdit: false,
        description: (
          <Descriptions
            className="bg-red"
            bordered
            title="Chi ti???t t??i kho???n"
            size={size}
            extra={
              <div className="flex gap-[2rem]">
                {editUser && (
                  <Popconfirm
                    placement="top"
                    title={text}
                    description={description}
                    onConfirm={confirmEdit}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ className: "my-ok-button-class" }}
                  >
                    <Button
                      className="bg-green-500 flex items-center"
                      type="primary"
                    >
                      Save
                    </Button>
                  </Popconfirm>
                )}
                <Button
                  className="bg-green-500 flex items-center"
                  type="primary"
                  onClick={() => {
                    data[index].isEdit = !data[index].isEdit;

                    setEditUser(!editUser);
                  }}
                >
                  {editUser ? "Cancel" : "Edit"}
                </Button>
              </div>
            }
          >
            <Descriptions.Item label="ID">{user._id}</Descriptions.Item>
            <Descriptions.Item label="T??n">
              {editUser ? (
                <TextArea
                  placeholder={user.username}
                  value={newUserEdit.username}
                  allowClear
                  onChange={(e) => {
                    setNewUserEdit({
                      ...newUserEdit,
                      username: e.target.value,
                    });
                  }}
                />
              ) : (
                user.username
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {editUser ? (
                <TextArea
                  placeholder={user.email}
                  value={newUserEdit.email}
                  allowClear
                  onChange={(e) => {
                    setNewUserEdit({
                      ...newUserEdit,
                      email: e.target.value,
                    });
                  }}
                />
              ) : (
                user.email
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Kh??a H???c">
              {/* {editUser ? (
                <TextArea placeholder={user.courses.length} allowClear />
              ) : user.courses.length < 1 ? (
                0
              ) : (
                user.courses.filter((course) => <span>course</span>)
              )} */}
              {user.courses.length}
            </Descriptions.Item>
            <Descriptions.Item label="Ti???n">
              {editUser ? (
                <TextArea
                  placeholder={`${user.money} $`}
                  allowClear
                  value={newUserEdit.money}
                  onChange={(e) => {
                    setNewUserEdit({
                      ...newUserEdit,
                      money: e.target.value,
                    });
                  }}
                />
              ) : (
                `${user.money} $`
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ch???c v???">
              {user.isAdmin ? "admin" : "th??nh vi??n"}
            </Descriptions.Item>
            <Descriptions.Item label="Th??ng tin chi ti???t">
              Th???i gian t???o nick:{" "}
              {moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
              <br />
              S???a ?????i g???n nh???t:{" "}
              {moment(user.updatedAt).format("DD/MM/YYYY HH:mm")}
              <br />
              T???ng s??? kh??a h???c ???? mua: {user.courses.length}
            </Descriptions.Item>
          </Descriptions>
        ),
      });
    });
  }
  // ph???n footer
  const selectedRows = data
    .filter((record, index) => selectedRowKeys.includes(index))
    .map((record) => record.id);

  const defaultFooter = () => {
    return (
      <div>
        <p>
          T???ng s??? t??i kho???n :{" "}
          <span style={{ color: "red", fontWeight: 600, fontSize: "1.8rem" }}>
            {listUsers.length}
          </span>
        </p>
        <p style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          T???ng s??? t??i kho???n ??ang ???????c ch???n :
          <span style={{ color: "red", fontWeight: 600, fontSize: "1.8rem" }}>
            {" "}
            {selectedRows.length}
          </span>
          {selectedRows.length > 0 && (
            <Button
              className="bg-red-500 flex items-center"
              type="primary"
              onClick={() => {
                if (window.confirm(`B???n c?? ch???c ch???n mu???n x??a ?`)) {
                  deleteManyUser(
                    currentUser.accessToken,
                    selectedRows,
                    axiosJWT
                  );
                  setUpdatedUser(selectedRows);
                  setSelectedRowKeys([]);
                } else {
                  // N???u ng?????i d??ng ch???n Cancel
                  // H???y b??? h??nh ?????ng c???a b???n ??? ????y
                }
              }}
            >
              X??a H??ng lo???t
            </Button>
          )}
        </p>
      </div>
    );
  };
  const scroll = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }
  const tableColumns = columns.map((item) => ({
    ...item,
    ellipsis,
  }));

  // Ph???n x??? l?? khi ng?????i d??ng nh??y v??o ph???n m??? r???ng
  const handleExpand = (expanded, record) => {
    // "expanded" (boolean) v?? "record" (?????i t?????ng d??? li???u c???a h??ng ???????c m??? r???ng)

    setEditUser(false);
    setNewUserEdit({
      id: record.id,
      username: record.name,
      email: record.email,
      money: record.money,
    });
    setSelectedRecord(expanded ? record : null);
  };
  const isRecordSelected = (record) => {
    return selectedRecord && selectedRecord.id === record.id;
  };
  const getRowClassName = (record, index) => {
    return isRecordSelected(record) ? "userAdmin__active" : "";
  };

  // Ph???n x??? l?? c???p nh???t ch???nh s??? user
  const handleEditUser = () => {
    // c???n th???n v?? khi nh??y n??t edit th?? t???t c??? c??c th??? s??? chuy???n sang ch??? ????? isedit b???ng true n??n. c?? th??? fix b???ng c??ch ch???nh l???i logic c???a onClick n??t edit. Ch??ng ta s??? ???n ho???c m??? n??t Save c???a ch??nh th??? ????
    editUserRequest(currentUser.accessToken, newUserEdit, axiosJWT);
    setUpdatedUser(newUserEdit);
  };
  //ph???n x??? l?? x??a user
  const handleDeleteUser = (id) => {
    deleteUser(currentUser.accessToken, id, axiosJWT);
    setUpdatedUser(id);
  };
  const tableProps = {
    bordered,
    loading,
    size,
    expandable: {
      ...defaultExpandable,
      onExpand: handleExpand,
      expandRowByClick: false,
    },

    showHeader,
    footer: showfooter ? defaultFooter : undefined,
    rowSelection: {
      type: "checkbox",
      selectedRowKeys,
      onChange: setSelectedRowKeys,
    },
    rowClassName: getRowClassName,
    scroll,
    tableLayout,
  };
  return (
    <>
      {isLoading && (
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <Loading />
        </div>
      )}
      <div className="my-[2rem]">
        <Form.Item label="Fields" className="w-[30rem]">
          <Select
            value={searchSelector}
            onChange={(value) => {
              setSearchSelector(value);
            }}
          >
            <Select.Option value="username">username</Select.Option>
            <Select.Option value="email">email</Select.Option>

            <Select.Option value="_id">id</Select.Option>
          </Select>
        </Form.Item>
        <div className="flex h-[3rem] gap-5 items-center">
          <label htmlFor="inputSearch">Search: </label>
          <input
            id="inputSearch"
            className="border border-[#333] outline-none h-full w-[40rem]  rounded-xl px-3"
            value={inputSearch}
            onChange={(e) => {
              setInputSearch(e.target.value);
            }}
          ></input>
        </div>
      </div>

      <Form
        layout="inline"
        className="components-table-demo-control-bar"
        style={{
          marginBottom: 16,
        }}
      ></Form>
      <Table
        {...tableProps}
        pagination={{
          position: [top, bottom],
        }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
      />
    </>
  );
};
export default MenuUser;

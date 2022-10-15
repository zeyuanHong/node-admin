import { Fragment, useEffect, useReducer } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  List,
  Card,
  Checkbox,
} from "antd";
import { getAdminUserList } from "../../api/service";
import { formatDate } from "../../util/tool";
import config from "../../config";
import {
  addCreateAdminUser,
  updateAdminUser,
  delAdminUser,
} from "../../api/service";

const ROLE_MAP = {
  normal: "普通管理员",
  admin: "超级管理员",
};

const initState = {
  page: 1,
  data: [],
  isModalOpen: false,
  role: "normal",
  authority: config.normal,
  id: "", // 如果id有值则是更新数据，没有值则是添加数据
};

const reducer = function (state = initState, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
};

function Adminuser() {
  const [form] = Form.useForm(); // 创建一个form表单对象,还需要给form赋值具体的表单实例
  const [state, dispatch] = useReducer(reducer, initState);
  // 删除数据
  const handleDel = (id) => {
    delAdminUser({ id }, (res) => {
      init();
      message.info("添加成功");
    });
  };
  const columns = [
    {
      title: "ID", // 表头名称
      dataIndex: "id", // 渲染数据的键，会把对应的value渲染到该表头下面
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "密码",
      dataIndex: "password",
    },
    {
      title: "角色",
      dataIndex: "role",
      render(value) {
        return ROLE_MAP[value];
      },
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render(value, rowData) {
        // value 是当前dataIndex对应的值，rowData是整行数据对象
        return formatDate(value, "YYYY-MM-DD hh:mm:ss");
      },
    },
    {
      title: "编辑",
      render: (_, record) => (
        <Fragment>
          <Button onClick={() => onUpdate(record)}>更新</Button>
          <Popconfirm
            title="你确定是否要删除?"
            onConfirm={() => handleDel(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="danger">删除</Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  useEffect(function () {
    init();
  }, []);
  const init = () => {
    getAdminUserList({ page: 1 }, (res) => {
      console.log(res);
      dispatch({
        data: res.data[0].data,
      });
    });
  };

  // 点击显示修改用户信息的弹窗并把输入填充到form表单
  const onUpdate = (row) => {
    form.setFieldsValue({
      username: row.username,
      password: row.password,
      repassword: "",
      role: row.role,
    });
    dispatch({
      isModalOpen: true,
      id: row.id,
    });
  };

  // 由于form输入的内容会保留，每次点击添加则要把数据设置为"",需要获取form的实例，调用实例的setFiledsValue方法设置form表单默认值。
  const handleShow = () => {
    form.setFieldsValue({
      username: "",
      password: "",
      repassword: "",
      role: "",
    });
    dispatch({
      isModalOpen: true,
      id: "",
    });
  };

  const handleCancel = () => {
    dispatch({
      isModalOpen: false,
    });
  };

  const handleChangeRole = (value) => {
    let obj = {
      role: value,
    };
    // authority 权限如果没有设置，则是等于选择角色的权限，如果设置了authority，则不用管role的权限。
    if (!state.authority) {
      obj.authority = config[value];
    }
    dispatch(obj);
  };

  // 修改权限
  const onChangeAut = (data) => {
    console.log(data);
  };

  // 获取表单输入内容，并提交到后端
  const onFinish = (values) => {
    if (!state.id) {
      // 添加管理员
      if (values.password !== values.repassword) {
        return message.error("两次密码输入不一致");
      }
      addCreateAdminUser({ ...values, authority: "" }, () => {
        init();
        message.info("添加成功");
        handleCancel();
      });
    } else {
      updateAdminUser({ ...values, authority: "", id: state.id }, () => {
        init();
        message.info("更新成功");
        handleCancel();
      });
    }
  };
  return (
    <Fragment>
      <p>
        <Button type="primary" onClick={handleShow}>
          添加
        </Button>
      </p>
      <Table rowKey="id" columns={columns} dataSource={state.data} />
      <Modal
        title="添加管理员"
        open={state.isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input disabled={state.id} />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "管理员密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          {!state.id && (
            <Form.Item
              label="确认密码"
              name="repassword"
              rules={[{ required: true, message: "请确认密码!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请选择角色!" }]}
          >
            <Select value={state.role} onChange={handleChangeRole}>
              {Object.keys(ROLE_MAP).map((key) => (
                <Select.Option key={key} value={key}>
                  {ROLE_MAP[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="权限配置"
            rules={[{ required: true, message: "请选择角色!" }]}
          >
            <List
              grid={{
                column: 1,
              }}
              dataSource={Object.keys(state.authority)}
              renderItem={(key) => (
                <List.Item>
                  <Card title={state.authority[key].title}>
                    {Object.keys(state.authority[key])
                      .filter((item) => item !== "title")
                      .map((item) => (
                        <Checkbox
                          checked={state.authority[key][item]}
                          onChange={() => onChangeAut()}
                        >
                          {item}
                        </Checkbox>
                      ))}
                  </Card>
                </List.Item>
              )}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}

export default Adminuser;

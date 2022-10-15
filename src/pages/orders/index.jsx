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
} from "antd";
import { getOrdersList, updateOrders } from "../../api/service";
import { staticUrl } from "../../api/api";
import { formatDate } from "../../util/tool";


const ORDER_MAP = {
  0: "未付款",
  1: "已付款",
  2: "已发货",
  3: "已收货",
  4: "已评价",
};


const initState = {
  page: 1,
  data: [],
  total: 0,
  isModalOpen: false,
  id: "", // 如果id有值则是更新数据，没有值则是添加数据
};

const reducer = function (state = initState, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
};

function Order() {
  const [form] = Form.useForm(); // 创建一个form表单对象,还需要给form赋值具体的表单实例
  const [state, dispatch] = useReducer(reducer, initState);
 
  const columns = [
    {
      title: "订单id", // 表头名称
      dataIndex: "orderid", // 渲染数据的键，会把对应的value渲染到该表头下面
    },
    {
      title: "订单金额",
      dataIndex: "allprice",
    },
    {
      title: "快递名称",
      dataIndex: "EMSname",
    },
    {
      title: "快递单号",
      dataIndex: "EMS",
    },
    {
      title: "收货地址",
      dataIndex: "address",
      render(data) {
        let dt = ''
        try {
          dt = JSON.parse(data)
          dt = [dt.name, dt.tel, dt.address].join(",")
        } catch (e) {
          dt = data // 如果解析失败，就直接返回原数据
        }
        return dt
      }
    },
    {
      title: "订单状态",
      dataIndex: "status",
      render(value) {
        return ORDER_MAP[value]
      }
    },
    {
      title: "下单时间",
      dataIndex: "createtime",
      render(value, rowData) {
        // value 是当前dataIndex对应的值，rowData是整行数据对象
        return formatDate(value, "YYYY-MM-DD hh:mm:ss");
      },
    },
    {
      title: "编辑",
      render: (_, record) => (
        <Fragment>
          {record.status === 1 && ( // 如果订单状态是已付款，才显示发货按钮
            <Button type="primary" onClick={() => onUpdate(record)}>
              发货
            </Button>
          )}
        </Fragment>
      ),
    },
  ];

  useEffect(function () {
    init();
  }, [state.page]);
  const init = () => {
    getOrdersList({ page: state.page }, (res) => {
      dispatch({
        data: res.data[0].data,
        total: res.data[1].data[0].count,//获取总条数
      })
    })
  }

  // 点击显示修改用户信息的弹窗并把输入填充到form表单
  const onUpdate = (row) => {
    form.setFieldsValue({ //重置上次输入的数据
      EMSname: '',
      EMS: '',
    })
    dispatch({
      isModalOpen: true,
      id: row.orderid,
    })
  }
  

  const handleCancel = () => {
    dispatch({
      isModalOpen: false,
    })
  }
  
  // 获取表单输入内容，并提交到后端
  const onFinish = (values) => {
    updateOrders({...values,status:2,orderid:state.id},()=>{ // 发货后订单状态改为2
      init() // 更新成功后重新获取数据
      message.success("发货成功")
      handleCancel() // 关闭弹窗
    })
  }

  const proColumns = [
    {
      title: "商品id", // 表头名称
      dataIndex: "id", // 渲染数据的键，会把对应的value渲染到该表头下面
    },
    {
      title: "商品标题",
      dataIndex: "title",
    },
    {
      title: "主图",
      dataIndex: "goodImg",
      render(_, row) {
        let img = row.goodImg.replace('https','http') // 由于https证书问题，这里把https替换成http
        if (row.img) {
          img = staticUrl + row.img
        }
        return <img src={img} height="60" alt="" />;
      },
    },
    {
      title: "单价",
      dataIndex: "price",
    },
    {
      title: "数量",
      dataIndex: "num",
    },
    {
      title: "下单时间",
      dataIndex: "createTime",
      render(value, rowData) {
        // value 是当前dataIndex对应的值，rowData是整行数据对象
        return formatDate(value, "YYYY-MM-DD hh:mm:ss");
      },
    },
  ]

  const handleExpand = (row) => {
    let dt = []
    if (row.prolist) {
      dt = JSON.parse(row.prolist)
    }
    return (
      <Table rowKey="id" columns={proColumns} dataSource={dt} />
    )

  }

  return (
    <Fragment>

      <Table rowKey="orderid"
        columns={columns}
        dataSource={state.data}
        expandedRowRender={handleExpand}
        pagination={
          {
            current: state.page, //当前页数
            pageSize: 20, //每页条数
            total: state.total, //总条数
            showSizeChanger: false, //是否可以改变 pageSize
            onChange(page, pageSize) { //页码改变的回调，参数是改变后的页码及每页条数
              dispatch({ page, pageSize })
            }
          }
        } />
      <Modal
        title="发货"
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
            label="快递名称"
            name="EMSname"
            rules={[{ required: true, message: "请输入快递名称!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="EMS"
            name="EMS"
            rules={[{ required: true, message: "请输入快递单号!" }]}
          >
            <Input />
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

export default Order;

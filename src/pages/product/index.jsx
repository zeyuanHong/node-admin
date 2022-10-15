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
    Row,
    Col,
    InputNumber,
} from "antd";
import { formatDate } from "../../util/tool";
import {
    getPro,
    getAllProType,
    addpro,
    getDetail,
    updatepro,
    delPro,
    deldetailimg
} from "../../api/service";
import Uploadimg from "../../components/uploadImg"; //图片上传组件
import MyEditor from "../../components/wangEditor"; // 富文本编辑器
import { staticUrl } from "../../api/api";


const initState = {
    page: 1,
    pageSize: 10,
    orderbytype: 'id',
    key: '',
    skey: '',
    total: 0,
    data: [],
    isModalOpen: false,
    typeData: [],//商品分类数据
    type1SelectId: '',
    type2SelectId: '',
    mainSelectId: '',
    secondSelectId: '',
    imgList: '', // 商品主图列表
    html: "", // 富文本编辑器内容

};

const reducer = function (state = initState, action) {
    if (action) {
        return { ...state, ...action };
    }
    return state;
};

function Product() {
    const [form] = Form.useForm(); // 创建一个form表单对象,还需要给form赋值具体的表单实例
    const [state, dispatch] = useReducer(reducer, initState);

    // 删除数据
    const handleDel = (row) => {
        // 删除商品的同时还需要删除商品对应的图片(主图和详情图片)
        let arr = [];
        arr = row.img.split(",");
        getDetail({ id: row.id }, (res) => { //首先要把图片给删除
            const data = res.data[0].data[0].detail;
            // 用正则匹配出所有的图片路径
            let reg =
                /(?<=\<img src="https:\/\/8i98\.com\/apidoc\/)vapi\/\d+\/[\w-]+.[A-z]+(?=" alt="" data-href="" style=""\/\>)/g;
            let imgs = data.match(reg) || [];
            arr = [...arr, ...imgs];
            deldetailimg({ file: arr }, () => "");

            delPro({ id: row.id }, (res) => {
                init();
                message.info("删除成功")
            })
        });
    };

    const columns = [
        {
            title: "ID", // 表头名称
            dataIndex: "id", // 渲染数据的键，会把对应的value渲染到该表头下面
        },
        {
            title: "商品图片",
            dataIndex: "img",
            render(img) {
                if (img) {
                    let imgArr = img.split(',') //有多个图片的话,要把它逗号分隔成数组
                    return (
                        <Fragment>
                            {
                                imgArr.map(item => {
                                    return (
                                        <img key={item}
                                            src={staticUrl + item}
                                            alt="商品图片"
                                            style={{ width: 50, height: 50 }} />
                                    )
                                })
                            }
                        </Fragment>
                    )
                }
            }
        },
        {
            title: "商品名称",
            dataIndex: "title",
        },
        {
            title: "价格",
            dataIndex: "price",
        },
        {
            title: "折扣",
            dataIndex: "discount",
        },
        {
            title: "尺寸",
            dataIndex: "size",
        },
        {
            title: "颜色",
            dataIndex: "color",
        },
        {
            title: "销量",
            dataIndex: "sales",
        },
        {
            title: "库存",
            dataIndex: "stock",
        },
        {
            title: "分类",
            dataIndex: "typeid",
            render(typeid) {
                for (let i = 0; i < state.typeData.length; i++) {
                    if (state.typeData[i].id === typeid) {
                        return state.typeData[i].title;
                    }
                }
            },
        },
        {
            title: "添加时间",
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
                    <Button onClick={() => onUpdate(record)}>更新</Button>
                    <Popconfirm
                        title="你确定是否要删除?"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => handleDel(record)}
                    >
                        <Button type="danger">删除</Button>
                    </Popconfirm>
                </Fragment>
            ),
        },
    ];
    // 获取商品分类
    useEffect(function () {
        getAllProType(res => {
            const data = res.data[0].data
            // 需要找出默认的主id
            let mainId = data.filter((item) => item.typelevel === 0)[0].id
            dispatch({
                typeData: data,
                type1SelectId: mainId,
                type2SelectId: "",
            })
        })
    }, [])

    // 获取商品列表
    useEffect(function () {
        init();
        // console.log(state.data)
    }, [state.type2SelectId, state.page, state.key])
    const init = () => {
        getPro({
            page: state.page,
            key: state.key,
            typeid: state.type2SelectId,
            orderbytype: state.orderbytype
        }, (res) => {
            dispatch({
                data: res.data[0].data,
                total: res.data[0].data[0].total,
            });

        });
    };

    // 点击显示修改用户信息的弹窗并把输入填充到form表单
    const onUpdate = (row) => {
        getDetail({ id: row.id }, res => {
            const data = res.data[0].data[0]
            form.setFieldsValue({
                ...data
            })
            // 根据typeid找对应的主分类id,先找二级分类的fatherid，然后取第一个fatherid作为他的主id
            let fahterIdStr = "";
            for (let i = 0; i < state.typeData.length; i++) {
                let item = state.typeData[i];
                if (item.id === row.typeid) {
                    fahterIdStr = item.fatherid;
                    break;
                }
            }
            fahterIdStr = fahterIdStr.split("-")[0];

            dispatch({
                isModalOpen: true,
                id: data.id,
                imgList: data.img,
                mainSelectId: Number(fahterIdStr),
                secondSelectId: data.typeid,
                html: data.detail,
            })
        })

    }

    // 由于form输入的内容会保留，每次点击添加则要把数据设置为"",需要获取form的实例，调用实例的setFiledsValue方法设置form表单默认值。
    const handleShow = () => {
        form.setFieldsValue({
            title: "",
            price: "",
            discount: "",
            weight: "",
            stock: "",
            color: "",
            brand: "",
            popular: "",
            sales: "",
            typeid: "",
        });
        dispatch({
            isModalOpen: true,
            id: "",
            mainSelectId: "",
            secondSelectId: "",
            imgList: "",
            html: "",
        });
    };

    const handleCancel = () => {
        dispatch({
            isModalOpen: false,
        })
    };

    // 获取表单输入内容，并提交到后端
    const onFinish = (values) => {
        if (!state.id) {
            // 添加商品
            addpro(
                {
                    ...values,
                    img: state.imgList,
                    detail: state.html,
                    typeid: state.secondSelectId,
                },
                () => {
                    init();
                    message.info("添加成功");
                    handleCancel();
                }
            );
        } else {
            updatepro(
                {
                    ...values,
                    img: state.imgList,
                    detail: state.html,
                    typeid: state.secondSelectId,
                    id: state.id,
                },
                () => {
                    init();
                    message.info("更新成功");
                    handleCancel();
                }
            );
        }
    };
    const handleSearch = () => {
        dispatch({
            key: state.skey,
        })
    }

    // 选择主分类
    const handleType = (key, value) => {
        // console.log(key, value)
        dispatch({
            [key]: value,
        })
    };

    // 子组件传递上传图片数据到父组件的方法
    const setImgList = (str) => {
        dispatch({
            imgList: str
        })
    }

    // 富文本组件传递参数给该函数
    const setEditorHtml = (str) => {
        console.log(str);
        dispatch({
            html: str,
        });
    };

    return (
        <Fragment>
            <Row style={{ marginBottom: "15px" }}>
                <Col span={4}>
                    <Button type="primary" onClick={handleShow}>
                        添加
                    </Button>
                </Col>
                <Col span={6}>
                    <Input
                        placeholder="输入商品关键词"
                        onChange={e => dispatch({ skey: e.target.value })} /* 把搜索框输入的值用skey保存 */
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={handleSearch}>
                        搜索
                    </Button>
                </Col>

                <Col span={10} > {/* 二级联动选择框 */}
                    <Select  /* 一级选择框 */
                        onChange={value => handleType("type1SelectId", value)}
                        value={state.type1SelectId}
                        style={{ width: "100px" }}
                    >
                        {
                            state.typeData
                                .filter(item => item.typelevel === 0) /* 一级目录刷选出来 */
                                .map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.title}
                                    </Select.Option>
                                ))
                        }
                    </Select>

                    <Select  /* 二级选择框 */
                        onChange={value => handleType("type2SelectId", value)}
                        value={state.type2SelectId}
                        style={{ width: "100px" }}
                    >
                        <Select.Option value="">所有</Select.Option>
                        {state.typeData
                            .filter(
                                (item) =>
                                    item.typelevel === 1 &&
                                    item.fatherid.search(state.type1SelectId) > -1 /* 二级目录刷选出来 */
                            )
                            .map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.title}
                                </Select.Option>
                            ))}
                    </Select>
                </Col>
            </Row>


            <Table
                rowKey="id"
                columns={columns}
                dataSource={state.data}
                pagination={{
                    current: state.page, // 当前页码
                    pageSize: state.pageSize, // 每页显示的条数
                    total: state.total,
                    onChange(page, pageSize) {
                        // 点击页码触发的函数
                        dispatch({
                            page,
                            pageSize,
                        });
                    },
                }}
            />
            <Modal
                title="添加商品"
                open={state.isModalOpen}
                onCancel={handleCancel}
                footer={false}
                width={700}
            >
                <Form  /* 添加商品的表单 */
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="商品名称"
                        name="title"
                        rules={[{ required: true, message: "商品名称!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="商品价格"
                        name="price"
                        rules={[{ required: true, message: "商品价格!" }]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="折扣"
                        name="discount"
                        rules={[{ required: true, message: "请输入商品折扣!" }]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="权重"
                        name="weight"
                        rules={[{ required: true, message: "请输入商品权重!" }]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="库存"
                        name="stock"
                        rules={[{ required: true, message: "请输入商品库存!" }]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item label="颜色" name="color">
                        <Input placeholder="多个颜色以,分割" />
                    </Form.Item>

                    <Form.Item label="商品尺寸" name="size">
                        <Input placeholder="多个尺寸以,分割" />
                    </Form.Item>
                    <Form.Item label="品牌" name="brand">
                        <Input />
                    </Form.Item>
                    <Form.Item label="流行度" name="popular">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="销量" name="sales">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="主分类"
                        rules={[{ required: true, message: "请选择主分类!" }]}
                    >
                        <Select
                            onChange={(value) => handleType("mainSelectId", value)}
                            value={state.mainSelectId}
                            style={{ width: "100px" }}
                        >
                            {state.typeData
                                .filter((item) => item.typelevel === 0)
                                .map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.title}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="二级分类"
                        rules={[{ required: true, message: "请选择分类!" }]}
                    >
                        <Select
                            onChange={(value) => handleType("secondSelectId", value)}
                            value={state.secondSelectId}
                            style={{ width: "100px" }}
                        >
                            {state.typeData
                                .filter(
                                    (item) =>
                                        item.typelevel === 1 &&
                                        item.fatherid.search(state.mainSelectId) > -1
                                )
                                .map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.title}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="主图" name="">
                        <Uploadimg imgList={state.imgList} setImgList={setImgList} />
                    </Form.Item>
                    <div>
                        <MyEditor htmlCon={state.html} setEditorHtml={setEditorHtml} />
                    </div>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                        <Button type="primary" htmlType="submit" style={{ marginLeft: "60px", marginTop: "10px" }}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    );
}

export default Product;

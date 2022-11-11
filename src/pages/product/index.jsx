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
	id: '',
	isModalOpen: false,
	typeData: [],//博客分类数据
	imgList: '', // 博客主图列表
	html: "", // 富文本编辑器内容

}

const BLOG_TYPE = [
	{ text: "技术", value: "1" },
	{ text: "随笔", value: "2" },
	{ text: "笔记", value: "3" },
];

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
		// 删除博客的同时还需要删除博客对应的图片(主图和详情图片)
		let arr = [];
		arr = row.img.split(",");
		getDetail({ id: row.id }, (res) => { //首先要把图片给删除
			// console.log(res)
			const data = res[0].content
			// 用正则匹配出所有的图片路径
			let reg =
				/(?<=\<img src="http:\/\/127.0.0.1:3080\.com\/apidoc\/)vapi\/\d+\/[\w-]+.[A-z]+(?=" alt="" data-href="" style=""\/\>)/g;
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
			title: "博客图片",
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
											alt="博客图片"
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
			title: "博客标题",
			dataIndex: "title",
		},
		{
			title: "博客简介",
			dataIndex: "introduction",
		},
		{
			title: "作者",
			dataIndex: "nick",
		},
		{
			title: "分类",
			dataIndex: "blog_type",
			render(typeid) {
				// console.log('----'+typeid)
				for (let i = 0; i < BLOG_TYPE.length; i++) {
					if (BLOG_TYPE[i].value === typeid) {
						return BLOG_TYPE[i].text;
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


	// 获取博客列表
	useEffect(function () {
		init();
		// console.log(state.data)
	}, [state.type2SelectId, state.page, state.key])
	const init = () => {
		getPro({
			page: state.page,
			key: state.key,
		}, (res) => {
			dispatch({
				data: res.data,
				total: res.total,
			});

		});
	};

	// 点击显示修改用户信息的弹窗并把输入填充到form表单
	const onUpdate = (row) => {
		getDetail({ id: row.id }, res => {
			const data = res[0]
			form.setFieldsValue({
				...data
			})


			dispatch({
				isModalOpen: true,
				id: data.id,
				imgList: data.img,
				html: data.content,
			})
		})

	}

	// 由于form输入的内容会保留，每次点击添加则要把数据设置为"",需要获取form的实例，调用实例的setFiledsValue方法设置form表单默认值。
	const handleShow = () => {
		form.setFieldsValue({
			title: "",
			introduction: "",
			blog_type: "",
		});
		dispatch({
			isModalOpen: true,
			id: "",
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
		console.log(values)
		if (!state.id) {
			// 添加博客
			addpro(
				{
					...values,
					img: state.imgList,
					content: state.html,
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
					content: state.html,
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
				title="添加博客"
				open={state.isModalOpen}
				onCancel={handleCancel}
				footer={false}
				width={700}
			>
				<Form  /* 添加博客的表单 */
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="off"
					form={form}
				>
					<Form.Item
						label="博客标题"
						name="title"
						rules={[{ required: true, message: "博客名称!" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="博客简介"
						name="introduction"
						rules={[{ required: true, message: "博客简介!" }]}
					>
						<Input.TextArea />
					</Form.Item>

					<Form.Item
						label="博客分类"
						name="blog_type"
						rules={[{ required: true, message: "请选择博客分类!" }]}
					>
						<Select style={{ width: "100px" }}>
							{BLOG_TYPE.map((item) => (
								<Select.Option key={item.value} value={item.value}>
									{item.text}
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

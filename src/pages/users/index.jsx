import { Fragment, useEffect, useReducer } from "react";
import { Table, Button, Input, Avatar, Row, Col } from "antd";
import { formatDate } from "../../util/tool";
import { usersList } from "../../api/service";
import { staticUrl } from "../../api/api";

const initState = {
    page: 1, //当前页数
    pageSize: 20, //每页条数
    data: [],
    total: 0, //总条数
    key: '',
    skey: ''
};

const reducer = function (state = initState, action) {
    if (action) {
        return { ...state, ...action };
    }
    return state;
};

function Adminuser() {
    const [state, dispatch] = useReducer(reducer, initState);
    const columns = [
        {
            title: "ID", // 表头名称
            dataIndex: "id", // 渲染数据的键，会把对应的value渲染到该表头下面
        },
        {
            title: "用户昵称",
            dataIndex: "nick",
        },
        {
            title: "头像",
            dataIndex: "avatar",
            render(avatar, row) {
                if (!avatar) { //如果用户没有上传头像，就显示默认头像
                    return <Avatar src="https://joeschmoe.io/api/v1/random" />
                }
                if (row.avatarType === 1) { //微信用户,头像的src直接用
                    return <Avatar src={avatar} />
                }
                return <Avatar src={staticUrl + avatar} /> //web用户，头像的src需要拼接
            }
        },
        {
            title: "邮箱",
            dataIndex: "email",
        },
        {
            title: "余额",
            dataIndex: "mymoney",
        },
        {
            title: "用户类型",
            dataIndex: "avatartype",
            render(data) {
                if (data === '1') { //根据data判断用户类型
                    return '微信用户'
                }
                return 'web用户'
            }
        },
        {
            title: "创建时间",
            dataIndex: "creattime",
            render(value, rowData) {
                // value 是当前dataIndex对应的值，rowData是整行数据对象
                return formatDate(value, "YYYY-MM-DD hh:mm:ss");
            },
        },
    ];
    useEffect(function () {
        init();
    }, [state.page, state.pageSize,state.skey]); //页码,每页条数,输入值改变时重新请求数据
    const init = () => {
        usersList({ page: state.page, pageSize: state.pageSize, key: state.key }, (res) => { //调用usersList接口 获取会员列表
            console.log(res);
            dispatch({
                data: res.data[0].data,
                total: res.data[1].data[0].total,
            });
        });
    };
    const handleSearch = () => { //点击搜索，需要把page初始化为第1页
        dispatch({
            page: 1,
            skey: state.key //把输入框的值赋值给skey
        })
    };
    return (
        <Fragment>
            <Row style={{ marginBottom: "15px" }}>
                <Col span={6}>
                    <Input onChange={e => dispatch({ key: e.target.value })} /> {/* 获取输入的值 */}
                </Col>
                <Col span={4} style={{marginLeft:"10px"}}>
                    <Button type="primary" onClick={handleSearch}>
                        搜索
                    </Button>
                </Col>
            </Row>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={state.data}
                pagination={
                    {
                        current: state.page, //当前页数
                        pageSize: state.pageSize, //每页条数
                        total: state.total, //总条数
                        onChange(page, pageSize) { //页码改变的回调，参数是改变后的页码及每页条数
                            dispatch({ page, pageSize })
                        }
                    }
                }
            />
        </Fragment>
    );
}

export default Adminuser;

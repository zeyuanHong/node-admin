import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { Fragment, useEffect, useReducer } from "react";
// import * as echarts from "echarts";
import { getAdminUserList,getPro } from "../../api/service";
import styles from "./index.module.scss";

const initState = {
  blogCount: 0,
  userCount: 0,
  userEmail:'',
};

const reducer = function (state = initState, action) {
  if (action) {
    return { ...state, ...action };
  }
  return state;
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  useEffect(function () {
    getAdminUserList({page:1},(res) => { //从后端获取购买订单的数据
      dispatch({
        // blogCount: res.data.length,
        userCount: res.length,
      });
    });

    getPro({},(res) => {
      // 取到sessionstorage里面userinfo里的email值
      let email = JSON.parse(sessionStorage.getItem('userinfo')).email
      dispatch({
        blogCount: res.total,
        userEmail:email
      });
    })
  }, []);
  
  
  return (
    <Fragment>
      <div className={styles.statistic}>
        <Row gutter={24}>
            <Col span={9}>
            <Card>
              <Statistic
                title="当前登录的用户"
                value={state.userEmail}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
              />
            </Card>
          </Col>

          <Col span={7}>
            <Card>
              <Statistic
                title="博客数量"
                value={state.blogCount}
                precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="篇"
              />
            </Card>
          </Col>
        
          <Col span={7}>
            <Card>
              <Statistic
                title="用户数量"
                value={state.userCount}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="人"
              />
            </Card>
          </Col>
        </Row>
      </div>
    
    <div style={{fontSize:'60px',fontWeight:'bold',textAlign:'center',marginTop:'60px'}}>欢迎进入博客后端管理系统</div>
    </Fragment>
  );
};

export default Home;

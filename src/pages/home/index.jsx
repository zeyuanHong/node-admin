import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { Fragment, useEffect, useReducer } from "react";
import * as echarts from "echarts";
import { getOrdersEchartData } from "../../api/service";
import styles from "./index.module.scss";

const initState = {
  orderCount: 0,
  totalPrice: 0,
  userCount: 0,
  eChartData: [],
  myChart: '', // echart实例
  countChart: '',
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
    getOrdersEchartData((res) => { //从后端获取购买订单的数据
      let myChart = echarts.init(document.getElementById("main"));
      const chartData = res.data[0].data
      const chartArr = {}
      
      chartData.forEach(item => { //遍历数据，把数据转换成echart需要的格式
        let key = item.createtime.substring(0,10)
        if(!chartArr[key]){ //原本没有这个时间的数据,则新增
          chartArr[key] = {
            price:item.allprice,
            count:1
          }
        }else{ //原本有这个时间的数据，则累加
            chartArr[key].price += item.allprice
            chartArr[key].count++
          }
      })
      
      dispatch({
        orderCount: res.data[1].data[0].total,
        totalPrice: res.data[2].data[0].total,
        userCount: res.data[3].data[0].total,
        eChartData: chartArr,
        myChart: myChart, // 第一次渲染完成就初始化echart对象。
        countChart: echarts.init(document.getElementById("maincount")),
      });
    });
  }, []);
  
  useEffect(
    function () {
      // echart实例的setOption方法可以按图标配置显示图标。
      if (!state.myChart || !state.countChart) return // 如果没有echart实例，就不执行下面的代码。
      let xData = Object.keys(state.eChartData);
      
      // 绘制销售额图表 
      state.myChart.setOption({
        title: {
          text: "销售额统计",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "销售额",
            type: "line",
            stack: "Total",
            data: xData.map((key) => state.eChartData[key].price),
          },
        ],
      });
      
      // 绘制订单数量统计图表
      state.countChart.setOption({
        title: {
          text: "订单统计",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单量",
            type: "line",
            stack: "Total",
            data: xData.map((key) => state.eChartData[key].count),
          },
        ],
      });
    },
    [state.eChartData]
  );
  
  return (
    <Fragment>
      <div className={styles.statistic}>
        <Row gutter={24}>
          <Col span={8}>
            <Card>
              <Statistic
                title="订单数量"
                value={state.orderCount}
                precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="单"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="销售额"
                value={state.totalPrice}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<ArrowDownOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="会员数量"
                value={state.userCount}
                precision={2}
                valueStyle={{
                  color: "#cf1322",
                }}
                prefix={<ArrowDownOutlined />}
                suffix="人"
              />
            </Card>
          </Col>
        </Row>
      </div>
      {/* 两个图标的dom */}
      <div id="main" className={styles.echart}></div>
      <div id="maincount" className={styles.echart}></div>
    </Fragment>
  );
};

export default Home;

import "./index.scss"; // 引入样式
let nodeArr = []; // 加载的对象存到数组里面
export function showLoading() {
  // 创建加载动画dom
  let divMask = document.createElement("div");
  let spanIcon = document.createElement("span");
  divMask.className = "loadingMask";
  spanIcon.className = "iconfont icon-loading";
  divMask.appendChild(spanIcon);
  document.querySelector("#loading").appendChild(divMask);
  let index = setTimeout(() => {
    for (let i = 0; i < nodeArr.length; i++) {
      if ((index = nodeArr[i].index)) {
        let data = nodeArr.splice(i, 1)[0];
        document.querySelector("#loading").removeChild(data.node);
      }
    }
    alert("请求超时");
  }, 60000);
  nodeArr.push({ index, node: divMask }); // 把定时器索引和dom存入数组
}

export function hideLoading() {
  // 删除加强动画dom
  // 请求完成调用方法，则从nodeArr数组删除一个元素
  if (nodeArr.length > 0) {
    let data = nodeArr.splice(0, 1)[0];
    clearTimeout(data.index);
    document.querySelector("#loading").removeChild(data.node);
  }
}

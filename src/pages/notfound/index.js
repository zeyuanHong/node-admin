import { Link } from "react-router-dom";
export default function Notfound() {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>页面不存在！</h3>
      <p>
        <Link to="/login">请点击返回登录页面</Link>
      </p>
    </div>
  );
}

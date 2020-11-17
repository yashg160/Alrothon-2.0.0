import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link } from 'react-router-dom'
import "./Login.css";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 11,
    span: 16,
  },
};
async function submit() {
  message.success('Sucessfully Login');
}
const Login = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="center-tag">
      <div className="opacity">
        <p>Login</p>
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Link to='/dashboard'><Button onClick={submit} type="primary" shape="round" htmlType="submit">
              LOGIN
            </Button></Link>

          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
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
					onFinishFailed={onFinishFailed}>
					<Form.Item
						label="Username"
						name="username"
						rules={[
							{
								required: true,
								message: "Please input your username!",
							},
						]}>
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
						]}>
						<Input.Password />
					</Form.Item>

					<Form.Item {...tailLayout}>
						<Button type="primary" shape="round">
							LOGIN
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Login;

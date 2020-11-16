import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
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
		offset: 8,
		span: 16,
	},
};

const Login = ({ history }) => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const onFinish = (values) => {
		console.log("Success:", values);
		setName(values.username);
		setPassword(values.password);
		console.log(name, password);
		history.push("/dashboard");
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
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

			<Form.Item {...tailLayout} name="remember" valuePropName="checked">
				<Checkbox>Remember me</Checkbox>
			</Form.Item>

			<Form.Item {...tailLayout}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default Login;

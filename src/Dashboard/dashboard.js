import React, { useState, useEffect } from "react";
import { PageHeader, Tabs, Button, Statistic, Descriptions } from "antd";

const { TabPane } = Tabs;

export default function Dashboard({ history }) {
	const [state, setState] = useState({ loading: false, data: null });

	useEffect(() => {
		getDevices();
	}, []);

	async function getDevices() {
		const rawResponse = await fetch("http://localhost:5000/power/devices");
		const response = await rawResponse.json();
		console.log(response);
	}
	return (
		<React.Fragment>
			<PageHeader
				className="site-page-header-responsive"
				onBack={() => history.goBack()}
				title="Dashboard"
				subTitle="Stats At A Glance"
				extra={[<Button key="1">Log Out</Button>]}
				footer={
					<Tabs defaultActiveKey="1" animated>
						<TabPane tab="Details" key="1" />
						<TabPane tab="Rule" key="2" />
					</Tabs>
				}>
				<Content extra={extraContent}>{renderContent()}</Content>
			</PageHeader>
		</React.Fragment>
	);
}

const renderContent = (column = 2) => (
	<Descriptions size="small" column={column}>
		<Descriptions.Item label="User">Admin</Descriptions.Item>
		<Descriptions.Item label="Status">Logged In</Descriptions.Item>
		{/* <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
		<Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item> */}
	</Descriptions>
);

const extraContent = (
	<div
		style={{
			display: "flex",
			width: "max-content",
			justifyContent: "flex-end",
		}}>
		<Statistic
			title="Status"
			value="Pending"
			style={{
				marginRight: 32,
			}}
		/>
		<Statistic title="Bill" prefix="$" value={100.08} />
	</div>
);

const Content = ({ children, extra }) => {
	return (
		<div className="content">
			<div className="main">{children}</div>
			<div className="extra">{extra}</div>
		</div>
	);
};

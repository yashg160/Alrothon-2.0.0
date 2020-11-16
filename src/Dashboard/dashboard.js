import React, { useState, useEffect } from "react";
import {
	PageHeader,
	Tabs,
	Button,
	Statistic,
	Descriptions,
	Card,
	Typography,
} from "antd";
import { Line } from "react-chartjs-2";
import { fetchUsageData } from "../redux/ActionCreators";
import { connect } from "react-redux";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

function Dashboard({ history, usage, fetchUsageData }) {
	const [active, setActive] = useState("devices");

	return (
		<React.Fragment>
			<PageHeader
				className="site-page-header-responsive"
				onBack={() => history.goBack()}
				title="Dashboard"
				subTitle="Stats At A Glance"
				extra={[<Button key="1">Log Out</Button>]}
				footer={
					<Tabs
						defaultActiveKey="devices"
						animated
						onChange={(activeKey) => setActive(activeKey)}>
						<TabPane tab="Devices" key="devices" />
						<TabPane tab="Usage" key="usage" />
					</Tabs>
				}>
				<Content extra={extraContent}>{renderContent()}</Content>
			</PageHeader>
			{active === "devices" ? (
				<DevicesContent />
			) : active === "usage" ? (
				<UsageContent usage={usage} fetchData={fetchUsageData} />
			) : null}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	usage: state.usage,
});

export default connect(mapStateToProps, { fetchUsageData })(Dashboard);

function UsageContent({ fetchData, usage }) {
	const [state, setState] = useState({ chartData: null });
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		let chartValues = [],
			labels = [],
			iteration = 1,
			lastHourPower = 0;
		if (!usage.loading) {
			for (const stamp of usage.data) {
				lastHourPower += stamp.energyConsumed;
				if (iteration % 12 === 0) {
					chartValues.push(lastHourPower.toFixed(2));
					labels.push(labels.length + 1);
					lastHourPower = 0;
				}
				iteration++;
			}

			const maxLine = Array(chartValues.length).fill(70);
			const data = {
				labels: labels,
				datasets: [
					{
						label: "Total Consumed Power",
						data: chartValues,
						fill: true,
						backgroundColor: "rgba(34, 40,49, 0.2)",
						borderColor: "rgb(34, 40, 49)",
					},
					{
						label: "Maximum Set Threshold",
						data: maxLine,
						fill: true,
						backgroundColor: "rgba(255, 0,0, 0)",
						borderColor: "rgb(255, 0, 0)",
					},
				],
			};
			setState({ ...state, chartData: data });
		}
	}, [usage]);

	if (usage.loading) return null;
	return (
		<React.Fragment>
			<Card style={{ width: 800, width: 800 }}>
				<Line
					data={state.chartData}
					options={{
						title: {
							text: "Total Power Consumed Over Hours",
							display: true,
							fullWidth: true,
						},
						maintainAspectRatio: true,
						legend: {
							fullWidth: true,
							align: "center",
						},
						scales: {
							gridLines: false,
							unitStepSize: 1,
						},
					}}
				/>
			</Card>
		</React.Fragment>
	);
}

function DevicesContent({}) {
	const [state, setState] = useState({ loading: false, devices: [] });
	useEffect(() => {
		getDevices();
	}, []);

	async function getDevices() {
		setState({ ...state, loading: true });
		const rawResponse = await fetch("http://localhost:5000/power/devices");
		const response = await rawResponse.json();
		console.log(response);
		setState({ ...state, devices: response.data, loading: false });
	}

	if (state.loading) return null;
	return (
		<Card title="Your Devices">
			{state.devices.map((device) => (
				<Card
					type="inner"
					title={<Title level={5}>{device.deviceName}</Title>}
					extra={<a href="#">Device Usage</a>}>
					<Text>
						Updated At {new Date(device.updatedAt).toString()}
					</Text>
					<br />
					<Text>
						Device Added {new Date(device.createdAt).toString()}
					</Text>
					<br />
					<Text disabled>Device ID {device.deviceId}</Text>
				</Card>
			))}
		</Card>
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

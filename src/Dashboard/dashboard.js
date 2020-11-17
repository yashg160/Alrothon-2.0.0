import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import {
	PageHeader,
	Tabs,
	Button,
	Statistic,
	Descriptions,
	Card,
	Typography,
	Table,
	message,
} from "antd";
import { Line } from "react-chartjs-2";
import { fetchUsageData } from "../redux/ActionCreators";
import { connect } from "react-redux";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

function Dashboard({ history, usage, fetchUsageData, threshold }) {
	const [active, setActive] = useState("devices");
	const [bill, setBill] = useState(0);
	const [threshCross, setThreshCross] = useState(false);
	function showThresholdCross() {
		setThreshCross(true);
		setTimeout(() => setThreshCross(false), 2000);
	}

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
			<Statistic title="Bill" prefix="$" value={bill} />
		</div>
	);

	return (
		<React.Fragment>
			<PageHeader
				className="site-page-header-responsive"
				title="Dashboard"
				subTitle="Stats At A Glance"
				extra={[
					<Button
						key="1"
						onClick={() => window.location.replace("/")}>
						Log Out
					</Button>,
				]}
				footer={
					<Tabs
						defaultActiveKey="devices"
						animated
						onChange={(activeKey) => setActive(activeKey)}>
						<TabPane tab="Devices" key="devices" />
						<TabPane tab="Usage" key="usage" />
						<TabPane tab="Last Month Bill" key="lastMonth" />
					</Tabs>
				}>
				<Content extra={extraContent}>{renderContent()}</Content>
			</PageHeader>
			{threshCross
				? message.error(
					"Maximum threshold crossed. Please check your power usage."
				)
				: null}
			{active === "devices" ? (
				<DevicesContent usage={usage} fetchData={fetchUsageData} />
			) : active === "usage" ? (
				<UsageContent
					usage={usage}
					fetchData={fetchUsageData}
					threshold={threshold}
					showThresholdCross={showThresholdCross}
					setBill={(bill) => setBill(bill)}
				/>
			) : active === "lastMonth" ? (
				<LastMonthBill
					usage={usage}
					fetchData={fetchUsageData}
					setBill={(bill) => setBill(bill)}
				/>
			) : null}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	usage: state.usage,
});

export default connect(mapStateToProps, { fetchUsageData })(Dashboard);

function UsageContent({
	fetchData,
	usage,
	threshold,
	showThresholdCross,
	setBill,
}) {
	const [state, setState] = useState({
		chartData: null,
		tableData: [],
		savingData: false,
	});
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		let chartValues = [],
			labels = [],
			iteration = 1,
			lastHourPower = 0;
		if (!usage.loading) {
			let bill = 0;
			for (const stamp of usage.data) {
				lastHourPower += stamp.energyConsumed;
				if (iteration % 12 === 0) {
					bill = bill + lastHourPower * 1;
					chartValues.push(lastHourPower.toFixed(2));
					labels.push(labels.length + 1);
					lastHourPower = 0;
				}
				iteration++;
				if (lastHourPower > threshold) showThresholdCross();
			}
			setBill(bill);
			const maxLine = Array(chartValues.length).fill(threshold);
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
			// Create table data
			let tableData = [];
			for (let i = 0; i < chartValues.length; i++) {
				tableData.push({
					power: chartValues[i],
					hours: labels[i],
				});
			}
			setState({ ...state, tableData: tableData, chartData: data });
		}
	}, [usage]);

	function saveData() {
		const ws = XLSX.utils.json_to_sheet(state.tableData);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, {
			bookType: "xlsx",
			type: "array",
		});
		const data = new Blob([excelBuffer], {
			type:
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
		});
		FileSaver.saveAs(data, "data.xlsx");
	}

	const tableColumns = [
		{
			title: "Power Consumed",
			dataIndex: "power",
			key: "power",
		},
		{
			title: "Hour",
			dataIndex: "hours",
			key: "hours",
			render: (text) => <Text disabled>{text}</Text>,
		},
	];

	if (usage.loading) return null;
	return (
		<React.Fragment>
			<Card style={{ width: "100%", height: 300 }}>
				<Line
					data={state.chartData}
					options={{
						title: {
							text: "Total Power Consumed Over Hours",
							display: true,
							fullWidth: true,
						},
						maintainAspectRatio: false,
						legend: {
							fullWidth: true,
							align: "center",
						},
						scales: {
							gridLines: false,
							unitStepSize: 1,
						},
					}}
					height={300}
				/>
			</Card>
			<Card>
				<Button
					style={{ alignContent: "right" }}
					type="primary"
					onClick={() => saveData()}
					disabled={state.savingData}>
					Download Data
				</Button>
			</Card>
			<Card style={{ width: "100%", height: 200 }}>
				<Table
					dataSource={state.tableData}
					columns={tableColumns}
					pagination={{ position: ["topCenter", "bottomCenter"] }}
				/>
			</Card>
		</React.Fragment>
	);
}
function LastMonthBill({ fetchData, usage, setBill }) {
	const [state, setState] = useState({
		chartData: null,
		tableData: [],
		savingData: false,
	});
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		let chartValues = [],
			labels = [],
			iteration = 1,
			lastHourPower = 0;
		if (!usage.loading) {
			let bill = 0;
			for (const stamp of usage.data) {
				const createdAt = new Date(stamp.createdAt);
				if (createdAt.getMonth() === 9) {
					console.log(createdAt);
					lastHourPower += stamp.energyConsumed;
					if (iteration % 4 === 0) {
						bill = bill + lastHourPower * 1;
						chartValues.push(lastHourPower.toFixed(2));
						labels.push(labels.length + 1);
						lastHourPower = 0;
					}
					iteration++;
				}
			}
			setBill(bill.toFixed(2));
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
				],
			};
			// Create table data
			let tableData = [];
			for (let i = 0; i < chartValues.length; i++) {
				tableData.push({
					power: chartValues[i],
					hours: labels[i],
				});
			}
			setState({ ...state, tableData: tableData, chartData: data });
		}
	}, [usage]);

	if (usage.loading) return null;
	return (
		<React.Fragment>
			<Card style={{ width: "100%", height: 300 }}>
				<Line
					data={state.chartData}
					options={{
						title: {
							text: "Total Power Consumed Over Hours",
							display: true,
							fullWidth: true,
						},
						maintainAspectRatio: false,
						legend: {
							fullWidth: true,
							align: "center",
						},
						scales: {
							gridLines: false,
							unitStepSize: 1,
						},
					}}
					height={300}
				/>
			</Card>
		</React.Fragment>
	);
}
function DeviceUsageContent({ device, id, fetchData, usage }) {
	console.log(device);
	const [state, setState] = useState({
		chartData: null,
		tableData: [],
		savingData: false,
	});
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
				// console.log(stamp)
				if (stamp.deviceId._id == id) {
					lastHourPower += stamp.energyConsumed;
					if (iteration % 12 === 0) {
						chartValues.push(lastHourPower.toFixed(2));
						labels.push(labels.length + 1);
						lastHourPower = 0;
					}
					iteration++;
				}
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
			// Create table data
			let tableData = [];
			for (let i = 0; i < chartValues.length; i++) {
				tableData.push({
					power: chartValues[i],
					hours: labels[i],
				});
			}
			setState({ ...state, tableData: tableData, chartData: data });
		}
	}, [usage]);

	function saveData() {
		const ws = XLSX.utils.json_to_sheet(state.tableData);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, {
			bookType: "xlsx",
			type: "array",
		});
		const data = new Blob([excelBuffer], {
			type:
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
		});
		FileSaver.saveAs(data, "data.xlsx");
	}

	const tableColumns = [
		{
			title: "Power Consumed",
			dataIndex: "power",
			key: "power",
		},
		{
			title: "Hour",
			dataIndex: "hours",
			key: "hours",
			render: (text) => <Text disabled>{text}</Text>,
		},
	];

	if (usage.loading) return null;
	return (
		<React.Fragment>
			<Card title={device} style={{ width: "100%", height: 500 }}>
				<Line
					data={state.chartData}
					options={{
						title: {
							text: "Total Power Consumed Over Hours",
							display: true,
							fullWidth: true,
						},
						maintainAspectRatio: false,
						legend: {
							fullWidth: true,
							align: "center",
						},
						scales: {
							gridLines: false,
							unitStepSize: 1,
						},
					}}
					height={300}
				/>
			</Card>
			<Card>
				<Button
					style={{ alignContent: "right" }}
					type="primary"
					onClick={() => saveData()}
					disabled={state.savingData}>
					Download Data
				</Button>
			</Card>

			<Card style={{ width: "100%", height: 200 }}>
				<Table
					dataSource={state.tableData}
					columns={tableColumns}
					pagination={{ position: ["topCenter", "bottomCenter"] }}
				/>
			</Card>
		</React.Fragment>
	);
}

function DevicesContent({ fetchData, usage }) {
	const [state, setState] = useState({ loading: false, devices: [] });
	const [active, setActive] = useState("devices");
	const [device, setDevice] = useState("");
	useEffect(() => {
		getDevices();
	}, []);
	console.log(active);

	async function getDevices() {
		setState({ ...state, loading: true });
		const rawResponse = await fetch("http://localhost:5000/power/device");
		const response = await rawResponse.json();
		console.log(response);
		if (response.status == false) {
			setState({ ...state, devices: null, loading: false });
		} else {
			setState({ ...state, devices: response.data, loading: false });
		}
	}
	async function setId(event) {
		var id = event.target.getAttribute("data-id");
		var device = event.target.getAttribute("data-device");
		setActive(id);
		setDevice(device);
		console.log(device);
	}

	if (state.loading) return null;
	return (
		<Card title="Your Devices">
			{active === "devices" ? (
				state.devices ? (
					state.devices.map((device) => (
						<Card
							type="inner"
							title={<Title level={5}>{device.deviceName}</Title>}
							extra={
								<a
									data-id={device._id}
									data-device={device.deviceName}
									onClick={setId}>
									Device Usage
								</a>
							}>
							<Text>
								Updated At{" "}
								{new Date(device.updatedAt).toString()}
							</Text>
							<br />
							<Text>
								Device Added{" "}
								{new Date(device.createdAt).toString()}
							</Text>
							<br />
							<Text disabled>Device ID {device.deviceId}</Text>
						</Card>
					))
				) : (
						""
					)
			) : (
					<div>
						<LeftCircleFilled
							onClick={() => setActive("devices")}
							style={{ fontSize: "25px", paddingBottom: "20px" }}
						/>
						<DeviceUsageContent
							device={device}
							id={active}
							usage={usage}
							fetchData={fetchData}
						/>
					</div>
				)}
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

const Content = ({ children, extra }) => {
	return (
		<div className="content">
			<div className="main">{children}</div>
			<div className="extra">{extra}</div>
		</div>
	);
};

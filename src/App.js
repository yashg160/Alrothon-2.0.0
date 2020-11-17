import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/dashboard";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/store";
import Threshold from "./Threshold/Threshold";
import { useState } from "react";

function App() {
	const store = ConfigureStore();
	const [threshold, setThresh] = useState(50);
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route
						exact
						path="/dashboard"
						component={() => <Dashboard threshold={threshold} />}
					/>
					<Route
						exact
						path="/threshold"
						component={() => <Threshold setThreshold={setThresh} />}
					/>
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;

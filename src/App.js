import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/dashboard";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/store";
import Threshold from "./Threshold/Threshold";

function App() {
	const store = ConfigureStore();
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/dashboard" component={Dashboard} />
					<Route exact path="/threshold" component={Threshold} />
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;

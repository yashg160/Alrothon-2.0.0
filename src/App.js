import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/dashboard";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/store";

function App() {
	const store = ConfigureStore();
	console.log(store);
	return (
		<Provider store={store}>
			<Router>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/dashboard" component={Dashboard} />
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;

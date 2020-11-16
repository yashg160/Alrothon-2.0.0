import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import "antd/dist/antd.css";

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Login} />
			</Switch>
		</Router>
	);
}

export default App;

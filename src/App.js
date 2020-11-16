import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/dashboard";
import "antd/dist/antd.css";
import Threshold from "./Threshold/Threshold";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route path="/threshold" component={Threshold} />
      </Switch>
    </Router>
  );
}

export default App;

import React, { Component } from "react";
import { Card, InputNumber, Button } from "antd";
import "./Threshold.css";
class Threshold extends Component {
  state = {
    ThresholdValue: "",
  };
  onChange(value) {
    console.log("changed", value);
  }

  render() {
    return (
      <div className="Threshold-center">
        <div className="site-card-wrapper">
          <Card title="Threshold Power Consumption" bordered={false}>
            <div className="Value-inline">
              <p>Enter The New Threshold Value</p>
              <InputNumber
                min={0}
                max={100}
                defaultValue={0}
                onChange={this.onChange}
              />
            </div>
            <br />

            <Button type="primary" shape="" htmlType="submit">
              UPDATE
            </Button>
          </Card>
        </div>
      </div>
    );
  }
}

export default Threshold;
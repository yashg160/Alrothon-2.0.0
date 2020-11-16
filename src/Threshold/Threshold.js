import React, { Component } from "react";
import { Card, InputNumber, Button } from "antd";
import "./Threshold.css";
class Threshold extends Component {
  state = {
    ThresholdValue: "",
  };

  render() {
    console.log(this.state);
    return (
      <div className="Threshold-center">
        <div className="site-card-wrapper">
          <Card
            title="Threshold Power Consumption"
            bordered={false}
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            <div className="Value-inline">
              <p>Enter The New Threshold Value</p>
              <InputNumber
                min={0}
                max={100}
                defaultValue={0}
                onChange={(value) => this.setState({ ThresholdValue: value })}
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

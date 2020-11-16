import React, { Component } from "react";
import { Card, InputNumber, Button } from "antd";
import "./Threshold.css";
import { updateThreshold } from "../redux/ActionCreators";
import { connect } from "react-redux";
class Threshold extends Component {

	constructor(props) {
		super(props);
	}
	onChange(value) {
		this.props.updateThreshold(value);
	}
  
  render() {

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
                defaultValue={this.props.threshold.threshold}
								onChange={(value) => this.onChange(value)}
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

const mapStateToProps = (state) => ({
	threshold: state.threshold,
});

export default connect(mapStateToProps, { updateThreshold })(Threshold);

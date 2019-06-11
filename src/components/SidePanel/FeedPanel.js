import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

class FeedPanel extends Component {
	getClick = () => {
		this.props.setCurrentChannel(null);
	};

	render() {
		return (
			<Menu.Menu className="menu" onClick={() => this.getClick()}>
				<Menu.Item>
					<span>
						<Icon name="columns" /> FEED
					</span>
				</Menu.Item>
			</Menu.Menu>
		);
	}
}

export default connect(
	null,
	{ setCurrentChannel, setPrivateChannel }
)(FeedPanel);

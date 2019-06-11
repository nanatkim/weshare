import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import { connect } from "react-redux";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

const Chat = ({
	currentUser,
	currentChannel,
	isPrivateChannel,
	userPosts,
	primaryColor,
	secondaryColor
}) => (
	<Grid className="app" style={{ background: secondaryColor }}>
		<Grid.Column width={3}>
			<SidePanel
				key={currentUser && currentUser.id}
				currentUser={currentUser}
				currentChannel={currentChannel}
				primaryColor={primaryColor}
			/>
		</Grid.Column>
		<Grid.Column width={8}>
			<Messages
				key={currentChannel && currentChannel.id}
				currentChannel={currentChannel}
				currentUser={currentUser}
				isPrivateChannel={isPrivateChannel}
			/>
		</Grid.Column>
		<Grid.Column width={4}>
			<MetaPanel
				key={currentChannel && currentChannel.name}
				userPosts={userPosts}
				currentChannel={currentChannel}
				isPrivateChannel={isPrivateChannel}
			/>
		</Grid.Column>
	</Grid>
);

const mapStateToProps = state => ({
	currentUser: state.user.currentUser,
	currentChannel: state.channel.currentChannel,
	isPrivateChannel: state.channel.isPrivateChannel,
	userPosts: state.channel.userPosts,
	primaryColor: state.colors.primaryColor,
	secondaryColor: state.colors.secondaryColor
});

export default connect(mapStateToProps)(Chat);

import React, { Component } from "react";
import firebase from "../../firebase";
import {
	Card,
	Icon,
	Image,
	Label,
	Button,
	Segment,
	Form,
	List
} from "semantic-ui-react";

const formatDate = data => {
	if (data === undefined) return "";
	let newData = data.split("T");
	let date = newData[0];
	let time = newData[1].split(".");
	return (
		date
			.split("-")
			.reverse()
			.join("/") +
		" - " +
		time[0]
	);
};

export default class Feed extends Component {
	state = {
		user: this.props.currentUser,
		color: this.props.color,
		postComment: "",
		postsRef: firebase.database().ref("posts")
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleClick = post => {
		if (post.likes.numero === 0) {
			let users = [];
			users.push(this.state.user.uid);
			post.likes = {
				numero: post.likes.numero,
				users
			};
			post.likes.numero += 1;
		} else {
			let index = post.likes.users.indexOf(this.state.user.uid);
			if (index > -1) {
				post.likes.users.splice(index, 1);
				post.likes.numero -= 1;
			} else {
				post.likes.users.push(this.state.user.uid);
				post.likes.numero += 1;
			}
		}

		console.log(post);
		this.state.postsRef
			.child(post.id)
			.update(post)
			.then(() => {
				this.setState({ color: !this.state.color });
			})
			.catch(err => {
				console.error(err);
			});
	};

	checkColor = post => {
		if (
			post.likes.numero !== 0 &&
			post.likes.users.indexOf(this.state.user.uid) > -1
		) {
			return true;
		} else {
			return false;
		}
	};

	addComment = () => {
		const { postComment, user, postsRef } = this.state;
		const { post } = this.props;
		console.log(this.state.user);

		if (post.comments === undefined) {
			let newPost = {
				...post,
				comments: [
					{
						user: { id: user.uid, name: user.displayName },
						text: postComment
					}
				]
			};

			console.log(newPost);

			postsRef
				.child(post.id)
				.update(newPost)
				.then(() => {
					this.setState({ postComment: "" });
				})
				.catch(err => {
					console.error(err);
				});
		} else {
			post.comments.push({
				user: { id: user.uid, name: user.displayName },
				text: postComment
			});

			postsRef
				.child(post.id)
				.update(post)
				.then(() => {
					this.setState({ postComment: "" });
				})
				.catch(err => {
					console.error(err);
				});
		}
	};

	render() {
		const { post } = this.props;
		const { postComment } = this.state;

		return (
			<Segment key={post.id}>
				<Label as="a" color="red" ribbon>
					{post.tags.map(tag => {
						return (
							<Label color="red" key={tag}>
								<Icon name="hashtag" />
								{tag}
							</Label>
						);
					})}
				</Label>
				<Card
					fluid
					onKeyPress={e => {
						if (e.shiftKey && e.key === "Enter") this.addComment();
					}}
				>
					<Card.Content>
						<Image
							floated="left"
							size="mini"
							src={post.createdBy.avatar}
						/>
						<Card.Header>{post.createdBy.name}</Card.Header>
						<Card.Meta>{formatDate(post.date)}</Card.Meta>
						<Card.Description>{post.content}</Card.Description>
					</Card.Content>
					<Card.Content extra>
						<List divided relaxed>
							{post.comments &&
								post.comments.map(comment => {
									return (
										<List.Item>
											<List.Content>
												<List.Header as="a">
													{comment.user.name}
												</List.Header>
												<List.Description as="p">
													{comment.text}
												</List.Description>
											</List.Content>
										</List.Item>
									);
								})}
						</List>
						<Form>
							<Form.Field>
								<input
									name="postComment"
									placeholder="Comente alguma coisa top"
									value={postComment}
									onChange={this.handleChange}
								/>
							</Form.Field>
							<Form.Button
								color="blue"
								inverted
								onClick={this.addComment}
							>
								Comentar
							</Form.Button>
						</Form>
						<Button as="div" labelPosition="left" floated="right">
							<Label as="a" basic pointing="right">
								{post.likes.numero}
							</Label>
							<Button
								color={this.checkColor(post) ? "red" : "grey"}
								onClick={e => this.handleClick(post)}
							>
								<Icon name="heart" />
							</Button>
						</Button>
					</Card.Content>
				</Card>
			</Segment>
		);
	}
}

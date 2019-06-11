import React from "react";
import firebase from "../../firebase";
import { Icon, Form, Dropdown, Grid } from "semantic-ui-react";
import Tags from "./Tags";
import Post from "./Post";

class Feed extends React.Component {
	state = {
		posts: [],
		tags: [],
		tagOptions: [],
		postsRef: firebase.database().ref("posts"),
		tagsRef: firebase.database().ref("tags"),
		usersRef: firebase.database().ref("users"),
		user: this.props.currentUser,
		postContent: "",
		postTags: []
	};

	componentDidMount() {
		this.addListeners();
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	addListeners = () => {
		this.state.usersRef.child(this.state.user.uid).on("value", snap => {
			const user = snap.val();
			if (user !== null) {
				this.setState({ myUser: user });
			}
		});

		let loadedPosts = [];
		this.state.postsRef.on("child_added", snap => {
			let myTags = this.state.myUser.tags;
			if (myTags !== undefined) {
				// eslint-disable-next-line
				snap.val().tags.map(tag => {
					if (
						myTags.indexOf(tag) > -1 ||
						this.state.user.photoURL === snap.val().createdBy.avatar
					) {
						loadedPosts.push(snap.val());
					}
				});
			}
			this.setState({ posts: loadedPosts.reverse() });
		});

		let loadedTags = [];
		this.state.tagsRef.on("child_added", snap => {
			loadedTags.push(snap.val());
			this.setState({ tags: loadedTags, tagOptions: loadedTags });
		});
	};

	removeListeners = () => {
		this.state.postsRef.off();
		this.state.tagsRef.off();
		this.state.usersRef.off();
	};

	addPost = () => {
		const {
			postsRef,
			tagsRef,
			postContent,
			postTags,
			user,
			tags
		} = this.state;

		console.log(postTags);
		// eslint-disable-next-line
		postTags.map(tag => {
			const foundTag = tags.find(t => t.value === tag);
			if (foundTag === undefined) {
				const tkey = tagsRef.push().key;
				const newTag = {
					key: tkey,
					text: tag,
					value: tag
				};

				console.log(newTag);

				tagsRef
					.child(tkey)
					.update(newTag)
					.catch(err => {
						console.error(err);
					});
			}
		});

		const pkey = postsRef.push().key;
		const newPost = {
			id: pkey,
			content: postContent,
			tags: postTags,
			date: new Date(),
			likes: {
				numero: 0,
				users: []
			},
			createdBy: {
				name: user.displayName,
				avatar: user.photoURL
			}
		};

		postsRef
			.child(pkey)
			.update(newPost)
			.then(() => {
				this.setState({ postContent: "", postTags: [] });
			})
			.catch(err => {
				console.error(err);
			});
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleTag = (e, { value }) => {
		console.log(value);
		return this.setState({ postTags: value });
	};

	handleTagAdd = (e, { value }) => {
		return this.setState({
			tagOptions: [{ text: value, value }, ...this.state.tagOptions]
		});
	};

	render() {
		const { tagOptions, postTags, postContent, posts } = this.state;
		return (
			<Grid>
				<Grid.Column width={12}>
					<Form>
						<Form.TextArea
							name="postContent"
							placeholder="O que está acontecendo?"
							value={postContent}
							onChange={this.handleChange}
						/>
						<Form.Field>
							<Dropdown
								fluid
								name="postTags"
								placeholder="Tags"
								search
								selection
								multiple
								allowAdditions
								value={postTags}
								options={tagOptions}
								onChange={this.handleTag}
								onAddItem={this.handleTagAdd}
							/>
						</Form.Field>
						<Form.Button
							color="green"
							inverted
							onClick={this.addPost}
						>
							<Icon name="checkmark" /> Postar
						</Form.Button>
					</Form>
					{posts.map(post => {
						return (
							<Post
								key={post.id}
								color={this.state.color}
								post={post}
								currentUser={this.state.user}
							/>
						);
					})}
				</Grid.Column>
				<Grid.Column width={4}>
					<Tags currentUser={this.state.user} />
				</Grid.Column>
			</Grid>
		);
	}
}

export default Feed;

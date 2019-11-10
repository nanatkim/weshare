import React, { Component } from "react";
import firebase from "../../firebase";
import { Icon, Form, Dropdown, Segment, Label } from "semantic-ui-react";

export default class Tags extends Component {
	state = {
		tags: [],
		tagOptions: [],
		tagsRef: firebase.database().ref("tags"),
		usersRef: firebase.database().ref("users"),
		user: this.props.currentUser,
		formTags: []
	};

	async componentDidMount() {
		this.state.usersRef.child(this.state.user.uid).on("value", snap => {
			const user = snap.val();
			if (user !== null) {
				this.setState({ myUser: user });
			}
		});

		this.addListeners();
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	addListeners = () => {
		let loadedTags = [];
		this.state.tagsRef.on("child_added", snap => {
			loadedTags.push(snap.val());
			this.setState({ tags: loadedTags, tagOptions: loadedTags });
		});
	};

	removeListeners = () => {
		this.state.tagsRef.off();
		this.state.usersRef.off();
	};

	handleTag = (e, { value }) => {
		console.log(value);
		return this.setState({ formTags: value });
	};

	handleTagAdd = (e, { value }) => {
		return this.setState({
			tagOptions: [{ text: value, value }, ...this.state.tagOptions]
		});
	};

	addTags = () => {
		const { myUser, usersRef, tagsRef, formTags, user, tags } = this.state;

		console.log(formTags);
		// eslint-disable-next-line
		formTags.map(tag => {
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

		let userUpdate = {};
		if (myUser.tags !== undefined) {
			// eslint-disable-next-line
			formTags.map(tag => {
				const foundTag = myUser.tags.find(t => t === tag);
				if (
					foundTag === undefined &&
					!(myUser.tags.indexOf(foundTag) > -1)
				) {
					myUser.tags.push(tag);
				}
			});

			usersRef
				.child(user.uid)
				.update(myUser)
				.then(() => {
					this.setState({ formTags: [] });
				})
				.catch(err => {
					console.error(err);
				});
		} else {
			userUpdate = {
				name: user.displayName,
				avatar: user.photoURL,
				tags: formTags
			};

			usersRef
				.child(user.uid)
				.update(userUpdate)
				.then(() => {
					this.setState({ formTags: [] });
				})
				.catch(err => {
					console.error(err);
				});
		}
	};

	deleteTag = tag => {
		const { myUser, usersRef, user } = this.state;
		var index = myUser.tags.indexOf(tag);
		if (index !== -1) myUser.tags.splice(index, 1);
		console.log(myUser.tags);

		usersRef
			.child(user.uid)
			.update(myUser)
			.then(() => {
				this.setState({ formTags: [] });
			})
			.catch(err => {
				console.error(err);
			});
	};

	render() {
		const { formTags, tagOptions, myUser } = this.state;
		return (
			<React.Fragment>
				<h3>Adicionar Tags</h3>
				<Form>
					<Form.Field>
						<Dropdown
							fluid
							name="formTags"
							placeholder="Tags"
							search
							selection
							multiple
							allowAdditions
							value={formTags}
							options={tagOptions}
							onChange={this.handleTag}
							onAddItem={this.handleTagAdd}
						/>
					</Form.Field>
					<Form.Button color="blue" inverted onClick={this.addTags}>
						Add
					</Form.Button>
				</Form>
				<Segment>
					<h4>My tags</h4>
					{myUser &&
						myUser.tags &&
						myUser.tags.map(tag => {
							return (
								<Label key={tag} color="red" horizontal>
									{tag}
									<Icon
										name="delete"
										onClick={e => this.deleteTag(tag)}
									/>
								</Label>
							);
						})}
				</Segment>
			</React.Fragment>
		);
	}
}

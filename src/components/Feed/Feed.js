import React from "react";
import firebase from "../../firebase";
import {
    Card,
    Icon,
    Image,
    Label,
    Button,
    Segment,
    Form,
    Dropdown
} from "semantic-ui-react";
import matthew from "../Images/matthew.png";

class Feed extends React.Component {
    state = {
        posts: [],
        tags: [],
        tagOptions: [],
        postsRef: firebase.database().ref("posts"),
        tagsRef: firebase.database().ref("tags"),
        user: this.props.currentUser,
        color: false,
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
        let loadedPosts = [];
        this.state.postsRef.on("child_added", snap => {
            loadedPosts.push(snap.val());
            this.setState({ posts: loadedPosts });
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
        if (this.state.postTags.length > value.length) {
            // an item has been removed
            const difference = this.state.postTags.filter(
                x => !value.includes(x)
            );
            console.log(difference); // this is the item
            return false;
        }
        console.log(value);
        return this.setState({ postTags: value });
    };

    handleTagAdd = (e, { value }) => {
        return this.setState({
            tagOptions: [{ text: value, value }, ...this.state.tagOptions]
        });
    };

    handleClick = () => this.setState({ color: !this.state.color });

    render() {
        const { color, tagOptions, postTags, postContent, posts } = this.state;
        console.log(posts);
        return (
            <React.Fragment>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <Form.TextArea
                            name="postContent"
                            placeholder="O que está acontecendo?"
                            value={postContent}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Dropdown
                            fluid
                            name="postTags"
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
                </Form>
                <Button color="green" inverted onClick={this.addPost}>
                    <Icon name="checkmark" /> Adicionar
                </Button>
                <Button color="red" inverted onClick={this.closeModal}>
                    <Icon name="remove" /> Cancelar
                </Button>
                {posts.map(post => {
                    return (
                        <Segment raised key={post.id}>
                            <Label as="a" color="red" ribbon>
                                {post.createdBy.name}
                            </Label>
                            <Image
                                floated="right"
                                size="mini"
                                src={post.createdBy.avatar}
                            />
                            {post.content}
                        </Segment>
                    );
                })}
                <Segment raised>
                    <Label as="a" color="red" ribbon>
                        Tag
                    </Label>
                    <Image floated="right" size="mini" src={matthew} />
                    Muita coisa acontecendo aqui
                </Segment>
                <Segment>
                    <Label as="a" color="red" ribbon>
                        Tag
                    </Label>
                    <Card fluid>
                        <Card.Content>
                            <Image floated="left" size="mini" src={matthew} />
                            <Card.Header>Steve Sanders</Card.Header>
                            <Card.Meta>Friends of Elliot</Card.Meta>
                            <Card.Description>
                                Steve wants to add you to the group{" "}
                                <strong>best friends</strong>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Label as="a" color="teal" tag>
                                Tag
                            </Label>
                            <Label as="a" color="teal" tag>
                                Tag
                            </Label>
                            <Label as="a" color="teal" tag>
                                Tag
                            </Label>
                            <Button
                                as="div"
                                labelPosition="left"
                                floated="right"
                            >
                                <Label as="a" basic pointing="right">
                                    2,048
                                </Label>
                                <Button
                                    color={color ? "red" : "grey"}
                                    onClick={this.handleClick}
                                >
                                    <Icon name="heart" />
                                </Button>
                            </Button>
                        </Card.Content>
                    </Card>
                </Segment>
                <Card.Group>
                    <Card fluid color="red" header="Option 1" />
                    <Card fluid color="orange" header="Option 2" />
                    <Card fluid color="yellow" header="Option 3" />
                    <Card fluid>
                        <Card.Content>
                            <Image floated="left" size="mini" src={matthew} />
                            <Card.Header>Steve Sanders</Card.Header>
                            <Card.Meta>Friends of Elliot</Card.Meta>
                            <Card.Description>
                                Steve wants to add you to the group{" "}
                                <strong>best friends</strong>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Label as="a" color="teal" tag>
                                Tag
                            </Label>
                            <Label as="a" color="teal" tag>
                                Tag
                            </Label>
                            <Label as="a" color="teal" tag>
                                Tag
                            </Label>
                            <Button
                                as="div"
                                labelPosition="left"
                                floated="right"
                            >
                                <Label as="a" basic pointing="right">
                                    2,048
                                </Label>
                                <Button
                                    color={color ? "red" : "grey"}
                                    onClick={this.handleClick}
                                >
                                    <Icon name="heart" />
                                </Button>
                            </Button>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </React.Fragment>
        );
    }
}

export default Feed;

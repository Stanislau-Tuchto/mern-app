import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import {addPost} from '../../actions/postActions';

class PostForm extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			errors: ''
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps(newProps, nextContent) {
		if (Object.keys(newProps.errors).length) {
			this.setState({errors: newProps.errors.response.data.text});
		}
	}

	onSubmit(e) {
		e.preventDefault();

		const {user} = this.props.auth;

		const newPost = {
			text: this.state.text,
			name: user.name,
			avatar: user.avatar
		};

		this.props.addPost(newPost, this.props.post.posts.limit, this.props.post.posts.page);
		this.setState({text: ''});
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	render() {
		return (
				<div className="post-form mb-3">
					<div className="card card-info">
						<div className="card-header bg-info text-white">Say Something...</div>
						<div className="card-body">
							<form onSubmit={this.onSubmit}>
								<div className="form-group">
									<TextAreaFieldGroup
											placeholder="Create a post"
											name="text"
											value={this.state.text}
											onChange={this.onChange}
											error={this.state.errors}
									/>
								</div>
								<button type="submit" className="btn btn-dark">
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
		);
	}
}

PostForm.propTypes = {
	addPost: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	post: state.post,
	errors: state.errors
});

export default connect(mapStateToProps, {addPost})(PostForm);

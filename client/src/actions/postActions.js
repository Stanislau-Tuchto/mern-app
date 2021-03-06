import {
	// ADD_POST,
	POST_LOADING,
	GET_POSTS,
	GET_POST,
	DELETE_POST,
	CLEAR_ERROR,
	POST_NEW_POST,
	FETCH_POSTS,
	FETCH_POST,
	DELETE_POST_BY_ID,
	DELETE_COMMENT,
	ADD_COMMENT,
	ADD_LIKE,
	POST_LOADING_OFF
} from './types';

export const addPost = (post, perPage, page) => ({
	type: POST_NEW_POST,
	payload: {post, perPage, page}
});
//receiveAddPost action is deprecated because pagination
// export const receiveAddPost = post => ({
// 	type: ADD_POST,
// 	payload: post
// });

export const getPosts = (perPage = 10, page = 1) => ({
	type: FETCH_POSTS,
	payload: {perPage, page}
});

export const receivePosts = posts => ({
	type: GET_POSTS,
	payload: posts
});

export const getPost = id => ({
	type: FETCH_POST,
	payload: id
});

export const receivePost = post => ({
	type: GET_POST,
	payload: post
});

export const deletePost = (id, perPage, page) => ({
	type: DELETE_POST_BY_ID,
	payload: {id, perPage, page}
});

export const receiveDeletePost = id => ({
	type: DELETE_POST,
	payload: id
});

export const deleteComment = (postId, commentId) => ({
	type: DELETE_COMMENT,
	payload: {postId, commentId}
});

export const addComment = (postId, commentData) => ({
	type: ADD_COMMENT,
	payload: {postId, commentData}
});


export const addLike = (id, perPage, page) => ({
	type: ADD_LIKE,
	payload: {id, perPage, page}
});

export const setPostLoading = () => ({
	type: POST_LOADING
});

export const deletePostLoading = () => ({
	type: POST_LOADING_OFF
});

export const clearError = () => ({
	type: CLEAR_ERROR
});

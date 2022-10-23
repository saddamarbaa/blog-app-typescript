const Bearer = 'Bearer ' + localStorage.getItem('accessToken')
let API_BASE_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_BASE_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

window.onload = () => {
	getPost()
}

const getPostIdParam = () => {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	return urlParams.get('id')
}

const getPost = () => {
	const postId = getPostIdParam()
	const fetchUrl = `${API_BASE_URL}/api/v1/posts/${postId}`
	buildPost([], true)
	fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: Bearer,
		},
	})
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				// throw new Error(response.statusText);
				throw new Error('Something went wrong')
			}
		})
		.then((data) => {
			buildPost(data.data.post, false, false)
		})
		.catch((error) => {
			buildPost({}, false, true)
			console.log('Fetch Error :-S', error)
		})
}

const buildPost = (post, isLoading = false, isApiFail = false) => {
	const isAdmin = localStorage.getItem('isAdmin')
	const {
		_id: id,
		title,
		content,
		postImage,
		createdAt: postDate,
		updatedAt,
	} = post
	let image = `${API_BASE_URL}${postImage}`

	const pageHeader = document.querySelector('.page__header')

	if (!isLoading && !isApiFail) {
		pageHeader.style.background = `url('${image}') no-repeat center/contain`
		document.querySelector('.post--text-empty  >p').innerHTML = ''
		document.querySelector(
			'#individual__post--date',
		).innerHTML = `Published on: ${postDate.split('T')[0]}`
		document.querySelector('#individual__post--content >p').innerHTML = content
		document.querySelector('#individual__post--title').innerHTML = title

		if (isAdmin === 'true') {
			const deletePostButton = document.getElementById(
				'individual__post-delete',
			)
			const updatePostButton = document.getElementById(
				'individual__post-update',
			)
			const deletePostContainer = document.getElementById(
				'delete-post-container',
			)
			deletePostContainer.classList = 'navigation'
			deletePostButton.innerHTML = 'Delete'
			updatePostButton.innerHTML = 'Edit'
			updatePostButton.href = `/edit-post.html?id=${id}`
		}
	} else {
		document.querySelector('.post--text-empty  >p').innerHTML = isLoading
			? 'Loading'
			: isApiFail
			? 'an error occurred, please try again later'
			: ''
	}
}

function handleDeletePost() {
	const postId = getPostIdParam()
	const fetchUrl = `${API_BASE_URL}/api/v1/posts/${postId}`
	fetch(fetchUrl, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
		},
	})
		.then((response) => {
			return response.json()
		})
		.then((response) => {
			if (
				response?.success &&
				response.status >= 200 &&
				response.status < 300
			) {
				location.href = '/'
			} else {
				console.log(response)
				throw new Error(response?.message)
			}
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error)
			if (error?.message === 'jwt expired') {
				handleRefreshTokenExpiration()
			} else {
				alert(error?.message)
			}
		})
}

function handleRefreshTokenExpiration() {
	fetch(API_BASE_URL + '/api/v1/auth/refresh-token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			refreshToken: localStorage.getItem('refreshToken'),
		}),
	})
		.then((response) => {
			return response.json()
		})
		.then((response) => {
			if (
				response?.success &&
				response.status === 200 &&
				response?.data?.user?.refreshToken &&
				response?.data?.user?.accessToken
			) {
				localStorage.setItem('refreshToken', response?.data?.user?.refreshToken)
				localStorage.setItem('accessToken', response?.data?.user?.accessToken)
				handleDeletePost()
			} else {
				throw new Error(response?.message)
			}
		})
		.catch((error) => {
			// console.log('Fetch Error :-S', error)
			alert(error?.message)
			location.href = '/login.html'
		})
}

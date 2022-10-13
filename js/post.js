const Bearer = 'Bearer ' + localStorage.getItem('token')
let API_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
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
	const fetchUrl = `${API_URL}/api/v1/posts/${postId}`
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
			buildPost(data.data.post, false)
		})
		.catch((error) => {
			buildPost({}, false, true)
			console.log('Fetch Error :-S', error)
		})
}

const deletePost = () => {
	const postId = getPostIdParam()
	const fetchUrl = `${API_URL}/api/v1/posts/${postId}`
	fetch(fetchUrl, {
		method: 'DELETE',
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
			// delete the data then the  redirect user to the home page
			location.href = '/login.html'
		})
		.catch((error) => {
			alert('You Are Unauthorized To Delete This Post')
			localStorage.removeItem('token')
			location.href = '/login.html'
			console.log('Fetch Error :-S', error)
		})
}

const buildPost = (post, isLoading = false, isApiFail = false) => {
	const isAdmin = localStorage.getItem('isAdmin')
	const { _id: id, title, content, postImage, createdAt, updatedAt } = post
	let image = `${API_URL}/static/${postImage}`
	const postDate = createdAt

	const pageHeader = document.querySelector('.page__header')
	pageHeader.style.background = `url('${image}') no-repeat center/contain`
	document.querySelector('#individual__post--title').innerHTML = isLoading
		? 'Loading'
		: isApiFail
		? 'an error occurred, please try again later'
		: title

	if (!isLoading && !isApiFail) {
		document.querySelector(
			'#individual__post--date',
		).innerHTML = `Published on: ${postDate}`
		document.querySelector('#individual__post--content >p').innerHTML = content

		if (isAdmin === 'true') {
			console.log(isAdmin)
			const deletePostButton = document.getElementById(
				'individual__post-delete',
			)
			const deletePostContainer = document.getElementById(
				'delete-post-container',
			)
			deletePostContainer.classList = 'navigation'
			deletePostButton.innerHTML = 'Delete'
		}
	}
}

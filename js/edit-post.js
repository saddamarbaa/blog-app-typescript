let API_BASE_URL = 'http://localhost:8000'
const title = document.getElementById('form-post-title-edit')
const content = document.getElementById('form-post-content-edit')
const fileInputElement = document.getElementById('form-post-image-edit')
const editPostForm = document.getElementById('editPostForm')

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
	fetch(fetchUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
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
			title.value = data?.data?.post?.title || ''
			content.value = data?.data?.post?.content || ''
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error)
		})
}

editPostForm.addEventListener('submit', (event) => {
	event.preventDefault()
	handleUpdatePost()
})

const handleUpdatePost = () => {
	const postId = getPostIdParam()
	const fetchUrl = `${API_BASE_URL}/api/v1/posts/${postId}`
	let formData = new FormData()

	formData.append('postImage', fileInputElement.files[0])
	formData.append('title', title.value || '')
	formData.append('content', content.value || '')

	fetch(fetchUrl, {
		method: 'PATCH',
		body: formData,
		headers: {
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
				handleUpdatePost()
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

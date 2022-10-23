const newPostForm = document.getElementById('newPostForm')
let API_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

newPostForm.addEventListener('submit', (event) => {
	event.preventDefault()
	let formData = new FormData() // Currently empty
	const title = document.getElementById('form-post-title').value
	const content = document.getElementById('form-post-content').value
	const fileInputElement = document.getElementById('form-post-image')
	formData.append('postImage', fileInputElement.files[0])
	formData.append('title', title)
	formData.append('content', content)
	handleCreatePost(formData)
})

const handleRefreshTokenExpiration = () => {
	fetch(API_URL + '/api/v1/auth/refresh-token', {
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
				let formData = new FormData() // Currently empty
				const title = document.getElementById('form-post-title').value
				const content = document.getElementById('form-post-content').value
				const fileInputElement = document.getElementById('form-post-image')
				formData.append('postImage', fileInputElement.files[0])
				formData.append('title', title)
				formData.append('content', content)
				handleCreatePost(formData)
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

const handleCreatePost = (formData) => {
	fetch(API_URL + '/api/v1/posts', {
		method: 'POST',
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

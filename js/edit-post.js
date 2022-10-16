const Bearer = 'Bearer ' + localStorage.getItem('token')
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
			title.value = data?.data?.post?.title || ''
			content.value = data?.data?.post?.content || ''
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error)
		})
}

editPostForm.addEventListener('submit', (event) => {
	const postId = getPostIdParam()
	const fetchUrl = `${API_BASE_URL}/api/v1/posts/${postId}`
	event.preventDefault()
	let formData = new FormData()
	formData.append('postImage', fileInputElement.files[0])
	formData.append('title', title.value || '')
	formData.append('content', content.value || '')

	fetch(fetchUrl, {
		method: 'PATCH',
		body: formData,
		headers: {
			Authorization: Bearer,
		},
	})
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error('Something went wrong')
			}
		})
		.then((data) => {
			location.href = '/'
		})
		.catch((error) => {})
})

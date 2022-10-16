const newPostForm = document.getElementById('newPostForm')
const Bearer = 'Bearer ' + localStorage.getItem('token')
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

const handleCreatePost = (formData) => {
	fetch(API_URL + '/api/v1/posts', {
		method: 'POST',
		body: formData,
		headers: {
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
			// console.log(data)
			location.href = '/'
		})
		.catch((error) => {})
}

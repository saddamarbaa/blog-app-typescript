const registerForm = document.getElementById('create-account')
const Bearer = 'Bearer ' + localStorage.getItem('token')
let API_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

registerForm.addEventListener('click', (event) => {
	event.preventDefault()
	const user = document.getElementById('registerForm')
	const payload = {
		name: user.name.value,
		email: user.email.value,
		password: user.password.value,
		confirmPassword: user.password.value,
	}

	registerUser(payload)
})

const registerUser = (payload) => {
	fetch(API_URL + '/api/v1/auth/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: Bearer,
		},
		body: JSON.stringify(payload),
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
				alert(response?.message)
				location.href = `/login.html?existingEmail=${payload.email}&registered=true`
			} else {
				throw new Error(
					response?.message || 'Something went wrong please try again',
				)
			}
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error)
			alert(error?.message)
		})
}

const redirectTLoginPage = () => (location.href = '/login.html')

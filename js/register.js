const registerForm = document.getElementById('create-account')
const Bearer = 'Bearer ' + localStorage.getItem('token')
let API_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

registerForm.addEventListener('click', (event) => {
	console.log(22)
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
			if (response.ok) {
				return response.json()
			} else {
				throw new Error('Something went wrong')
			}
		})
		.then((data) => {
			// console.log(data)
			location.href = `/login.html?existingEmail=${payload.email}&registered=true`
		})
		.catch((error) => {
			alert('Auth Failed')
			// location.href = `/login.html?existingEmail=${payload.email}`
		})
}

const redirectTLoginPage = () => (location.href = '/login.html')

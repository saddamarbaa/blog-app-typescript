const loginForm = document.getElementById('loginForm')
const Bearer = 'Bearer ' + localStorage.getItem('token')
let API_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

loginForm.addEventListener('submit', (event) => {
	event.preventDefault()

	const user = document.loginform
	const payload = {
		email: user.email.value,
		password: user.password.value,
	}

	loginfetch(payload)
})

const loginfetch = (payload) => {
	fetch(API_URL + '/api/v1/auth/login', {
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
			localStorage.setItem('token', data?.data?.user?.token)
			console.log(data?.data?.user)
			localStorage.setItem('isAdmin', data?.data?.user?.role === 'admin')
			location.href = '/'
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error)
		})
}

const redirectToRegisterPage = () => (location.href = '/register.html')

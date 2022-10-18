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
			return response.json()
		})
		.then((response) => {
			if (
				response?.success &&
				response.status === 200 &&
				response?.data?.user?.refreshToken &&
				response?.data?.user?.accessToken
			) {
				localStorage.setItem('token', response?.data?.user?.accessToken)
				localStorage.setItem('refreshToken', response?.data?.user?.refreshToken)
				localStorage.setItem('accessToken', response?.data?.user?.accessToken)
				localStorage.setItem('isAdmin', response?.data?.user?.role === 'admin')
				location.href = '/'
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

const redirectToRegisterPage = () => (location.href = '/register.html')

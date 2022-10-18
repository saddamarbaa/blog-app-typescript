let API_BASE_URL = 'http://localhost:8000'

window.onload = () => {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	const token = urlParams.get('token')
	const id = urlParams.get('id')
	localStorage.removeItem('token')
	localStorage.removeItem('accessToken')
	localStorage.removeItem('refreshToken')

	fetch(API_BASE_URL + `/api/v1/auth/verify-email/${id}/${token}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
				alert('Your account has been successfully verified . Please Login')
				location.href = `/login.html`
			} else {
				throw new Error(
					response?.message || 'Something went wrong please try again',
				)
			}
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error.message)
			alert(error?.message || 'Email verification fail ')
			location.href = `/login.html`
		})
}

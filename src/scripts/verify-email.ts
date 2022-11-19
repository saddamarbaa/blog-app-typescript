import { sendFetchHttpRequest } from '../utils/helper.js'
import { ApiResponse } from '../interfaces/index.js'

window.onload = async () => {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	const token = urlParams.get('token')
	const id = urlParams.get('id')
	localStorage.removeItem('token')
	localStorage.removeItem('accessToken')
	localStorage.removeItem('refreshToken')
	try {
		await sendFetchHttpRequest<ApiResponse<{}>>(
			`/api/v1/auth/verify-email/${id}/${token}`,
		)
		alert('Your account has been successfully verified . Please Login')
		location.href = `/login.html`
	} catch (error: unknown) {
		const errorMessage =
			(error as { message?: string })?.message || 'Email verification fail'
		console.log('Fetch Error :-S', errorMessage)
		alert(errorMessage)
		location.href = `/login.html`
	}
}

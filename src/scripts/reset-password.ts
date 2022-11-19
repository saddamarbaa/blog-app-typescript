import { resetPasswordValidationFields } from '../constants/index.js'
import { FormValidator, sendFetchHttpRequest } from '../utils/helper.js'
import { ApiResponse } from '../interfaces/index.js'

const resetPasswordForm = document.getElementById(
	'resetPasswordForm',
) as HTMLFormElement

const validator = new FormValidator(
	resetPasswordForm,
	resetPasswordValidationFields,
	handleResetPassword,
)
validator.initialize()

async function handleResetPassword() {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	const token = urlParams.get('token')
	const id = urlParams.get('id')
	localStorage.removeItem('token')
	localStorage.removeItem('accessToken')
	localStorage.removeItem('refreshToken')

	const payload = {
		password: resetPasswordForm.password.value,
		confirmPassword: resetPasswordForm['confirm-password'].value,
	}

	try {
		const response = await sendFetchHttpRequest<ApiResponse<{}>>(
			`/api/v1/auth/reset-password/${id}/${token}`,
			'POST',
			payload,
		)
		if (response?.success && response.status === 200) {
			alert(response?.message)
			location.href = '/login.html'
		} else {
			throw new Error(
				response?.message || 'Something went wrong please try again',
			)
		}
	} catch (error: unknown) {
		console.log('Fetch Error :-S', error)
		alert((error as { message?: string })?.message)
	}
}

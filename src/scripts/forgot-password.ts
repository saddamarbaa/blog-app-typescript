import { forgotPasswordValidationFields } from '../constants/index.js'
import { ApiResponse } from '../interfaces/index.js'
import { FormValidator, sendFetchHttpRequest } from '../utils/helper.js'

const forgotPasswordForm = document.getElementById(
	'forgotPassword',
) as HTMLFormElement

const validator = new FormValidator(
	forgotPasswordForm,
	forgotPasswordValidationFields,
	handleForgotPassword,
)
validator.initialize()

async function handleForgotPassword() {
	const payload = {
		email: forgotPasswordForm.email.value,
	}

	try {
		const response = await sendFetchHttpRequest<ApiResponse<{}>>(
			'/api/v1/auth/forget-password',
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

const redirectTLoginButton = document.getElementById(
	'redirectTLoginPage',
) as HTMLParagraphElement

redirectTLoginButton.addEventListener(
	'click',
	() => (location.href = '/login.html'),
)

export {}

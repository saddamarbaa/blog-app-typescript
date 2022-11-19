import { loginValidationFields as fields } from '../constants/index.js'
import { FormValidator, sendFetchHttpRequest } from '../utils/helper.js'
import { ApiResponse } from '../interfaces/index.js'

const loginForm = document.getElementById('loginForm') as HTMLFormElement

const validator = new FormValidator(loginForm, fields, handleLogin)
validator.initialize()

async function handleLogin() {
	const payload = {
		email: loginForm.email.value,
		password: loginForm.password.value,
	}

	try {
		const response = await sendFetchHttpRequest<
			ApiResponse<{
				user: {
					refreshToken: string
					accessToken: string
					role: string
				}
			}>
		>('/api/v1/auth/login', 'POST', payload)

		if (
			response?.success &&
			response.status === 200 &&
			response?.data?.user?.refreshToken &&
			response?.data?.user?.accessToken
		) {
			localStorage.setItem('refreshToken', response?.data?.user?.refreshToken)
			localStorage.setItem('accessToken', response?.data?.user?.accessToken)
			localStorage.setItem('isAdmin', response?.data?.user?.role)
			location.href = '/'
		}
	} catch (error: unknown) {
		console.log('Fetch Error :-S', error)
		alert((error as { message?: string })?.message)
	}
}

const redirectToForgotPasswordPageButton = document.getElementById(
	'redirectToForgotPasswordPageButton',
) as HTMLParagraphElement

const redirectToRegisterPageButton = document.getElementById(
	'redirectToRegisterPageButton',
) as HTMLParagraphElement

redirectToRegisterPageButton.addEventListener(
	'click',
	() => (location.href = '/register.html'),
)

redirectToForgotPasswordPageButton.addEventListener(
	'click',
	() => (location.href = '/forget-password.html'),
)

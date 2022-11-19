import { registerValidationFields as fields } from '../constants/index.js'
import { FormValidator, sendFetchHttpRequest } from '../utils/helper.js'
import { ApiResponse } from '../interfaces/index.js'

const registerForm = document.getElementById('registerForm') as HTMLFormElement

const validator = new FormValidator(registerForm, fields, handleSignUp)
validator.initialize()

async function handleSignUp() {
	const payload = {
		name: (document.getElementById('name') as HTMLInputElement).value,
		email: registerForm.email.value,
		password: registerForm.password.value,
		confirmPassword: registerForm['confirm-password'].value,
		acceptTerms: registerForm.checkbox.checked,
	}

	try {
		const response = await sendFetchHttpRequest<ApiResponse<{}>>(
			'/api/v1/auth/signup',
			'POST',
			payload,
		)
		alert(response?.message)
		location.href = `/login.html?existingEmail=${payload.email}&registered=true`
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

class FormValidator {
	constructor(form, fields) {
		this.form = form
		this.fields = fields
	}

	initialize() {
		console.log('form', this.form)
		console.log('fields', this.fields)

		this.validateOnEntry()
		this.validateOnSubmit()
	}

	handleApiCall() {
		let isAlVaild = true
		for (const property in this.fields) {
			if (!this.fields[property]?.isVaild) {
				isAlVaild = false
			}
		}

		if (isAlVaild) {
			handleSignUp()
		}
	}

	validateOnSubmit() {
		let self = this
		this.form.addEventListener('submit', (e) => {
			e.preventDefault()
			Object.keys(self.fields).forEach((field) => {
				const input = document.querySelector(`#${field}`)
				self.validateFields(input)
			})
			this.handleApiCall()
		})
	}

	validateOnEntry() {
		let self = this
		Object.keys(self.fields).forEach((field) => {
			const input = document.querySelector(`#${field}`)
			input.addEventListener('input', (event) => {
				self.validateFields(input)
			})
		})
	}

	validateFields(field) {
		// Check presence of values
		if (field.value.trim() === '') {
			this.setStatus(field, `${field.name} cannot be blank`, 'error')
		} else {
			this.setStatus(field, null, 'success')
		}

		if (
			field.value.trim() &&
			field.name === 'password' &&
			field.value.length < 6
		) {
			this.setStatus(field, `Password must be at least 6 characters`, 'error')
		} else if (
			field.value.trim() &&
			field.name === 'name' &&
			field.value.length < 3
		) {
			this.setStatus(field, `Name must be at least 3 characters`, 'error')
		}

		// check for a valid email address
		if (field.type === 'email') {
			const re =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (re.test(field.value)) {
				this.setStatus(field, null, 'success')
			} else {
				this.setStatus(field, 'Please provide a valid email address', 'error')
			}
		}

		// Password confirmation edge case
		if (field.id === 'confirm-password') {
			const passwordField = this.form.querySelector('#password')
			if (field.value.trim() == '') {
				this.setStatus(field, 'Password confirmation required', 'error')
			} else if (field.value != passwordField.value) {
				this.setStatus(field, 'Password does not match', 'error')
			} else {
				this.setStatus(field, null, 'success')
			}
		}
	}

	setStatus(field, message, status) {
		const errorMessage = field.parentElement.querySelector('.error-message')

		if (status === 'success') {
			this.fields[field.name].isVaild = true

			field.nextElementSibling.nextElementSibling.classList.remove(
				'icon-error-show',
			)
			field.nextElementSibling.classList.add('icon-success')
			if (errorMessage) {
				errorMessage.innerText = ''
			}
			field.nextElementSibling.classList.remove('hidden')
			field.parentElement.classList.remove('input-invalid')
			field.parentElement.previousElementSibling.innerText = ''
			field.placeholder = field.name
			field.parentElement.classList.add('input-success')
		}

		if (status === 'error') {
			field.parentElement.classList.remove('input-success')
			field.nextElementSibling.classList.remove('icon-success')
			field.nextElementSibling.nextElementSibling.classList.add(
				'icon-error-show',
			)

			this.fields[field.name].isVaild = false

			field.placeholder = ''
			field.parentElement.previousElementSibling.innerText = message
			field.parentElement.previousElementSibling.classList.add('error')
			field.parentElement.classList.add('input-invalid')
		}
	}
}

const registerForm = document.getElementById('registerForm')
const fields = {
	name: {
		value: 'name',
		isVaild: false,
	},
	email: {
		value: 'email',
		isVaild: false,
	},
	password: {
		value: 'password',
		isVaild: false,
	},
	'confirm-password': {
		value: 'confirm-password',
		isVaild: false,
	},
}

let API_URL = 'http://localhost:8000'

const validator = new FormValidator(registerForm, fields)
validator.initialize()

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

function handleSignUp() {
	const payload = {
		name: registerForm.name.value,
		email: registerForm.email.value,
		password: registerForm.password.value,
		confirmPassword: registerForm['confirm-password'].value,
		acceptTerms: registerForm.checkbox.checked,
	}

	fetch(API_URL + '/api/v1/auth/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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

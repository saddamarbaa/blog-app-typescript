import { ApiResponse, FieldT, ValidatorInterface } from '../interfaces/index.js'

export let API_BASE_URL = 'http://localhost:8000'

let Bearer = ''
if (
	typeof window !== 'undefined' &&
	window.location.href.indexOf('netlify') != -1
) {
	Bearer = 'Bearer ' + localStorage?.getItem('accessToken') || ''
}

if (
	typeof window !== 'undefined' &&
	window.location.href.indexOf('netlify') != -1
) {
	API_BASE_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

export function sendXMLHttpRequest<T>(
	endpoint: string,
	method = 'GET',
	data = null,
): Promise<T> {
	const promisifiedResponse: Promise<T> = new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		xhr.open(method, `${API_BASE_URL}${endpoint}`)
		xhr.responseType = 'json'
		if (data) xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.onload = () => {
			let response = xhr.response
			if (
				response?.success &&
				response.status >= 200 &&
				response.status < 300
			) {
				resolve(xhr.response)
			} else {
				reject(xhr.response)
			}
		}
		xhr.onerror = () => {
			reject(new Error('Failed to send request'))
		}
		xhr.send(JSON.stringify(data))
	})
	return promisifiedResponse
}

export function sendFetchHttpRequest<T>(
	endpoint: string,
	method = 'GET',
	data: any = null,
	headers: any = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: Bearer,
	},
	isFormData = false,
): Promise<T> {
	return fetch(`${API_BASE_URL}${endpoint}`, {
		method: method,
		headers: headers,
		body:
			data && isFormData
				? data
				: data && !isFormData
				? JSON.stringify(data)
				: null,
	})
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				return response.json().then((errorData) => {
					throw new Error(
						errorData.message || 'an error occurred, please try again later',
					)
				})
			}
		})
		.catch((error) => {
			throw new Error(
				error?.message || 'Something went wrong , please try again later',
			)
		})
}

export const getPostIdParam = () => {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	return urlParams.get('id')
}

export const handleRefreshTokenExpiration = async (
	cb?: () => void,
): Promise<void> => {
	const fetchUrl = '/api/v1/auth/refresh-token'
	try {
		const response: ApiResponse<{
			user: {
				refreshToken: string
				accessToken: string
			}
		}> = await sendFetchHttpRequest(fetchUrl, 'POST', {
			refreshToken: localStorage.getItem('refreshToken') || '',
		})
		if (
			response?.success &&
			response.status === 200 &&
			response?.data?.user?.refreshToken &&
			response?.data?.user?.accessToken
		) {
			localStorage.setItem('refreshToken', response?.data?.user?.refreshToken)
			localStorage.setItem('accessToken', response?.data?.user?.accessToken)
			if (cb) {
				cb()
			}
		} else {
			throw new Error(response?.message)
		}
	} catch (error: any) {
		console.log('Fetch Error :-S', error)
		alert(error?.message)
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('accessToken')
		location.href = 'login.html'
	}
}

export class FormValidator implements ValidatorInterface {
	constructor(
		private form: HTMLFormElement,
		public fields: FieldT,
		private callBack: () => void,
	) {
		this.form = form
		this.fields = fields
		this.callBack = callBack
	}

	initialize(this: FormValidator) {
		console.log('form', this.form)
		console.log('fields', this.fields)

		this.validateOnEntry()
		this.validateOnSubmit()
	}

	handleApiCall(this: FormValidator) {
		let isAlVaild = true
		let property: keyof typeof this.fields
		for (property in this.fields) {
			const isAllVaild = this.fields[property]?.isVaild
			if (!isAllVaild) {
				isAlVaild = false
			}
		}

		if (isAlVaild) {
			this.callBack()
		}
	}

	validateOnSubmit(this: FormValidator) {
		let self = this
		this.form.addEventListener(
			'submit',
			(e: { preventDefault: () => void }) => {
				e.preventDefault()
				Object.keys(self.fields).forEach((field) => {
					const input = document.querySelector(`#${field}`) as HTMLInputElement
					self.validateFields(input)
				})
				this.handleApiCall()
			},
		)
	}

	validateOnEntry(this: FormValidator) {
		let self = this

		Object.keys(self.fields).forEach((field) => {
			const input = document.querySelector(`#${field}`) as HTMLInputElement
			input.addEventListener('input', (event) => {
				self.validateFields(input)
			})
		})
	}

	validateFields(field: HTMLInputElement) {
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
			const passwordField = this.form.querySelector(
				'#password',
			) as HTMLInputElement
			if (field.value.trim() == '') {
				this.setStatus(field, 'Password confirmation required', 'error')
			} else if (field.value != passwordField.value) {
				this.setStatus(field, 'Password does not match', 'error')
			} else {
				this.setStatus(field, null, 'success')
			}
		}
	}

	setStatus(field: HTMLInputElement, message: string | null, status: string) {
		const errorMessage = field?.parentElement?.querySelector(
			'.error-message',
		) as HTMLDivElement

		if (status === 'success') {
			// TODO (Review strong types and remove ts ignore)
			// @ts-ignore
			this.fields[field.name].isVaild = true

			field?.nextElementSibling?.nextElementSibling?.classList.remove(
				'icon-error-show',
			)
			field?.nextElementSibling?.classList?.add('icon-success')
			if (errorMessage) {
				errorMessage.innerText = ''
			}
			field?.nextElementSibling?.classList?.remove('hidden')
			field?.parentElement?.classList?.remove('input-invalid')

			if (field?.parentElement?.previousElementSibling) {
				;(
					field.parentElement.previousElementSibling as HTMLDivElement
				).innerText = ''
			}
			field.placeholder = field.name
			field?.parentElement?.classList.add('input-success')
		}

		if (status === 'error') {
			field?.parentElement?.classList?.remove('input-success')
			field?.nextElementSibling?.classList.remove('icon-success')
			field?.nextElementSibling?.nextElementSibling?.classList.add(
				'icon-error-show',
			)

			// TODO (Review strong types and remove ts ignore)
			// @ts-ignore
			this.fields[field.name].isVaild = false

			field.placeholder = ''
			if (field?.parentElement?.previousElementSibling) {
				;(
					field.parentElement.previousElementSibling as HTMLDivElement
				).innerText = message || ''
			}
			field?.parentElement?.previousElementSibling?.classList.add('error')
			field?.parentElement?.classList?.add('input-invalid')
		}
	}
}

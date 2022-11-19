import {
	handleRefreshTokenExpiration,
	sendFetchHttpRequest,
} from '../utils/helper.js'
import { ApiResponse } from '../interfaces/ApiResponseT.js'

const newPostForm = document.getElementById('newPostForm') as HTMLFormElement

newPostForm.addEventListener('submit', (event) => {
	event.preventDefault()
	let formData = new FormData() // Currently empty
	const title = (document.getElementById('form-post-title') as HTMLInputElement)
		.value
	const content = (
		document.getElementById('form-post-content') as HTMLInputElement
	).value

	const fileInputElement = document.getElementById(
		'form-post-image',
	) as HTMLInputElement

	if (fileInputElement && fileInputElement?.files) {
		formData.append('postImage', fileInputElement?.files[0])
	}
	formData.append('title', title)
	formData.append('content', content)
	handleCreatePost(formData)
})

const handleCreatePost = async (formData: FormData) => {
	try {
		await sendFetchHttpRequest<ApiResponse<{}>>(
			'/api/v1/posts',
			'POST',
			formData,
			{
				Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
			},
			true,
		)
		location.href = '/'
	} catch (error: unknown) {
		const errorMessage = (error as { message?: string })?.message || ''
		console.log('Fetch Error :-S', errorMessage)
		if (errorMessage === 'jwt expired') {
			handleRefreshTokenExpiration(function callback() {
				handleCreatePost(formData)
			})
		} else {
			alert(errorMessage)
		}
	}
}

export {}

import {
	sendFetchHttpRequest,
	getPostIdParam,
	handleRefreshTokenExpiration,
} from '../utils/helper.js'

import { ApiResponse } from '../interfaces/index.js'

const title = document.getElementById(
	'form-post-title-edit',
) as HTMLInputElement
const content = document.getElementById(
	'form-post-content-edit',
) as HTMLTextAreaElement
const fileInputElement = document.getElementById(
	'form-post-image-edit',
) as HTMLInputElement
const editPostForm = document.getElementById(
	'editPostForm',
) as HTMLAnchorElement

window.onload = () => {
	getPost()
}

const getPost = async () => {
	const postId = getPostIdParam()
	const fetchUrl = `/api/v1/posts/${postId}`
	try {
		const response = await sendFetchHttpRequest<ApiResponse<any>>(fetchUrl)
		title.value = response?.data?.post?.title || ''
		content.value = response?.data?.post?.content || ''
	} catch (error: unknown) {
		console.log('Fetch Error :-S', (error as { message?: string })?.message)
	}
}

editPostForm.addEventListener('submit', (event) => {
	event.preventDefault()
	handleUpdatePost()
})

const handleUpdatePost = async () => {
	const postId = getPostIdParam()
	let formData = new FormData()
	if (fileInputElement && fileInputElement?.files) {
		formData.append('postImage', fileInputElement.files[0])
	}
	formData.append('title', title.value || '')
	formData.append('content', content.value || '')

	try {
		await sendFetchHttpRequest(
			`/api/v1/posts/${postId}`,
			'PATCH',
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
				handleUpdatePost()
			})
		} else {
			alert(errorMessage)
		}
	}
}

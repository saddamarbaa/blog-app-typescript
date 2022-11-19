import { ApiResponse, PostT } from '../interfaces/index.js'

import {
	API_BASE_URL,
	getPostIdParam,
	handleRefreshTokenExpiration,
	sendFetchHttpRequest,
} from '../utils/helper.js'

const deletePostButton = document.getElementById(
	'individual__post-delete',
) as HTMLAnchorElement

window.onload = () => {
	getPost()
}

const getPost = async () => {
	const postId = getPostIdParam()
	const fetchUrl = `/api/v1/posts/${postId}`
	try {
		buildPost(null, true)
		const response = await sendFetchHttpRequest<ApiResponse<{ post: PostT }>>(
			fetchUrl,
		)
		response?.data?.post && buildPost(response?.data?.post, false, false)
	} catch (error: unknown) {
		console.log('Fetch Error :-S', (error as { message?: string })?.message)
		buildPost(null, false, true, (error as { message?: string })?.message)
	}
}

const buildPost = (
	post: PostT | null,
	isLoading = false,
	isApiFail = false,
	errorMessage = 'an error occurred, please try again later',
) => {
	const adminRole = localStorage.getItem('isAdmin') as string

	if (post) {
		const {
			_id: id,
			title,
			content,
			postImage,
			createdAt: postDate,
			updatedAt,
		} = post
		let image = `${API_BASE_URL}${postImage}`

		const pageHeader = document.querySelector('.page__header') as any

		if (!isLoading && !isApiFail) {
			pageHeader.style.background = `url('${image}') no-repeat center/contain`
			document.querySelector('.post--text-empty  >p')!.innerHTML = ''
			document.querySelector(
				'#individual__post--date',
			)!.innerHTML = `Published on: ${postDate?.split('T')[0]}`
			document.querySelector('#individual__post--content >p')!.innerHTML =
				content
			document.querySelector('#individual__post--title')!.innerHTML = title

			if (adminRole && adminRole.toUpperCase() === 'ADMIN') {
				const deletePostButton = document.getElementById(
					'individual__post-delete',
				) as HTMLAnchorElement
				const updatePostButton = document.getElementById(
					'individual__post-update',
				) as HTMLAnchorElement
				const deletePostContainer = document.getElementById(
					'delete-post-container',
				) as any

				deletePostContainer.classList = 'navigation'
				deletePostButton.innerHTML = 'Delete'
				updatePostButton.innerHTML = 'Edit'
				updatePostButton.href = `/edit-post.html?id=${id}`
			}
		}
	} else {
		;(
			document.querySelector('.post--text-empty  >p') as HTMLParagraphElement
		).innerHTML = isLoading ? 'Loading' : isApiFail ? errorMessage : ''
	}
}

async function handleDeletePost() {
	const postId = getPostIdParam()
	const fetchUrl = `/api/v1/posts/${postId}`
	try {
		await sendFetchHttpRequest<ApiResponse<{}>>(fetchUrl, 'DELETE', null, {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
		})
		location.href = '/'
	} catch (error: unknown) {
		console.log('Fetch Error :-S', error)
		const errorMessage = (error as { message?: string })?.message || ''
		if (errorMessage === 'jwt expired') {
			handleRefreshTokenExpiration(function callback() {
				handleDeletePost()
			})
		} else {
			alert(errorMessage)
		}
	}
}

deletePostButton.addEventListener('click', handleDeletePost)

export {}

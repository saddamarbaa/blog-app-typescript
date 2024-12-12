import { ApiResponse } from '../interfaces/ApiResponseT.js'
import { PostT } from '../interfaces/PostT.js'
import { IUser } from '../interfaces/User.js'
import {
	API_BASE_URL,
	sendFetchHttpRequest,
	sendXMLHttpRequest,
} from '../utils/helper.js'

const searchInput = document.getElementById(
	'searchBoxInput',
) as HTMLInputElement

const selectBox = document.getElementById('select') as HTMLSelectElement
const adminRole = localStorage.getItem('isAdmin') as string

// console.log(userNameDiv?.innerHTML = )
const addNewPostButton = document.querySelector(
	'.add-post',
) as HTMLAnchorElement

window.onload = () => {
	// console.log(addNewPostButton, JSON.parse(isAdmin))
	updateUserProfile()
	getPosts()

	if (adminRole && adminRole.toUpperCase() === 'ADMIN') {
		addNewPostButton.style.display = 'block'
	} else {
		addNewPostButton.style.display = 'none'
	}
}

export const updateUserProfile = async () => {
	try {
		const profileResponse = await sendFetchHttpRequest<
			ApiResponse<{
				user: IUser
			}>
		>(
			'/api/v1/auth/profile',
			'GET',
			null,
			{
				Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
			},
			false,
		)

		if (
			profileResponse?.success &&
			profileResponse.status === 200 &&
			profileResponse?.data?.user
		) {
			const user = profileResponse?.data?.user

			if (user?.role === 'admin') {
				localStorage.setItem('isAdmin', user?.role)
			}

			// Update the user name
			if (user?.firstName && user?.lastName) {
				const userName = `${user?.firstName} ${user?.lastName}`
				const userNameDiv = document.querySelector(
					'.profile__name',
				) as HTMLDivElement
				userNameDiv.innerHTML = userName
			}

			localStorage.setItem('userId', user._id)
			
			// Update the profile image if available
			const profileImageDiv = document.querySelector(
				'.profile__image',
			) as HTMLElement

			if (profileImageDiv) {
				// Set profile image styles dynamically
				profileImageDiv.style.width = '9.3rem'
				profileImageDiv.style.height = '9.3rem'
				profileImageDiv.style.background = 'var(--white)'
				profileImageDiv.style.backgroundImage = user?.profileUrl
					? `url(${user?.profileUrl})`
					: `url('/assets/profile2.jpg')` // Default image if no profile image is provided
				profileImageDiv.style.backgroundRepeat = 'no-repeat'
				profileImageDiv.style.backgroundPosition = 'center'
				profileImageDiv.style.backgroundSize = 'cover'
				profileImageDiv.style.borderRadius = 'var(--space50)' // Border radius applied
				profileImageDiv.style.cursor = 'pointer'
			}
		}
	} catch (error) {
		console.error('Error updating user profile:', error)
	}
}

const getPosts = async (searchQuery = '') => {
	try {
		buildPosts([], true)
		const response = await sendXMLHttpRequest<
			ApiResponse<{
				posts: PostT[]
			}>
		>(`/api/v1/posts${searchQuery}`)
		buildPosts(response?.data?.posts || [], false, false)
	} catch (error: unknown) {
		console.log('Fetch Error :-S', error)
		buildPosts([], false, true)
	}
}

const buildPosts = (posts: PostT[], isLoading = false, isApiFail = false) => {
	let blogPostContent = document.querySelector(
		'#blogPostContent',
	) as HTMLDivElement

	if (posts.length > 0 && !isLoading && !isApiFail) {
		blogPostContent.innerHTML = ''
		posts.forEach((post) => {
			const { _id: id, title, description, photoUrl, createdAt } = post
			let image = photoUrl
			const postDate = createdAt
			const postlink = `/post.html?id=${id}`
			blogPostContent.innerHTML += `
    <a href="${postlink}" id="individualPost">
				<div class="main__container--post">
						<div class="main__container--post__image" 
										style="background-image: url(${image});">
					</div>
					<div class="main__container--post__content">
						<!-- blog_post_date -->
						<div class="post--date">Published on: ${postDate?.split('T')[0]}</div>
						<!-- blog_post_header -->
						<div class="post--title">${title}</div>
						<!-- blog_post_content -->
						<div class="post--text">
								<p> ${description}</p>
						</div>
							<span
								class="post--text--readMore"
								style=
								"color: '#004186';
								text-decoration: underline;
								display: none"
								>
								Continue reading ...
								</span>
			   </div>
		    </div>
		</a>
		`
		})
	} else {
		let fallBackContent =
			posts.length === 0 && !isLoading && !isApiFail
				? 'No posts founds'
				: isLoading
				? 'Loading'
				: isApiFail
				? 'an error occurred, please try again later'
				: ''
		blogPostContent!.innerHTML = `
				<div class="main__container--post">
						<div class="post--text-empty post--text">
								<p>
							${fallBackContent}
								</p>
			   </div>
		    </div>`
	}
}

function debounce(callback: any, timeout = 500) {
	let timer: any
	return (...args: any) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			// @ts-ignore
			callback.apply(this, args)
		}, timeout)
	}
}

function saveInput() {
	const searchForm = document.getElementById(
		'searchBoxInput',
	) as HTMLFormElement
	const event = document.getElementById('select') as HTMLSelectElement
	const category = event?.options[event.selectedIndex].text
	const searchQuery = `?filterBy=category&category=${category || ''}&search=${
		searchForm.value || ''
	}`

	getPosts(searchQuery)
}

searchInput.addEventListener(
	'keyup',
	debounce(() => saveInput()),
)

selectBox.addEventListener('change', () => saveInput())

export {}

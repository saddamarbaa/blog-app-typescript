import { ApiResponse } from '../interfaces/ApiResponseT.js'
import { PostT } from '../interfaces/PostT.js'
import { API_BASE_URL, sendXMLHttpRequest } from '../utils/helper.js'

const searchInput = document.getElementById(
	'searchBoxInput',
) as HTMLInputElement

const selectBox = document.getElementById('select') as HTMLSelectElement
const adminRole = localStorage.getItem('isAdmin') as string

const addNewPostButton = document.querySelector(
	'.add-post',
) as HTMLAnchorElement

window.onload = () => {
	// console.log(addNewPostButton, JSON.parse(isAdmin))
	getPosts()

	if (adminRole && adminRole.toUpperCase() === 'ADMIN') {
		addNewPostButton.style.display = 'block'
	} else {
		addNewPostButton.style.display = 'none'
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
			const { _id: id, title, content, postImage, createdAt } = post
			let image = `${API_BASE_URL}${postImage}`
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
								<p> ${content}</p>
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

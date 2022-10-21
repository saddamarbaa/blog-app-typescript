const Bearer = 'Bearer ' + localStorage.getItem('accessToken')
let API_BASE_URL = 'http://localhost:8000'

if (location.href.indexOf('netlify') != -1) {
	API_BASE_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

window.onload = () => {
	getPosts()
}

const getPosts = () => {
	buildPosts([], true)
	fetch(API_BASE_URL + '/api/v1/posts', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: Bearer,
		},
	})
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error('Something went wrong')
			}
		})
		.then((data) => {
			buildPosts(data?.data?.posts || [], false, false)
		})
		.catch((error) => {
			buildPosts([], false, true)
			console.log('Fetch Error :-S', error)
		})
}

const buildPosts = (posts, isLoading = false, isApiFail = false) => {
	let blogPostContent = document.querySelector('#blogPostContent')

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
						<div class="post--date">Published on: ${postDate.split('T')[0]}</div>
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
		blogPostContent.innerHTML = `
				<div class="main__container--post">
						<div class="post--text-empty post--text">
								<p>
							${fallBackContent}
								</p>
			   </div>
		    </div>`
	}
}

const deleteTokenFromLocalStorage = document.getElementById('removeTokenButton')

deleteTokenFromLocalStorage.addEventListener('click', () => {
	localStorage.removeItem('token')
})

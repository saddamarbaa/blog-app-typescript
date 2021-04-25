/** @format */

const API_URL = "http://localhost:3000/api/posts/";
const API_BASE_URL = "http://localhost:3000";

// Call function whe the page is loaded
window.onload = () => {
	getPosts();
};

// function to get the posts
const getPosts = () => {
	// GET request using fetch()
	fetch(API_URL, {
		method: "GET",
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				// throw new Error(response.statusText);
				throw new Error("Something went wrong");
			}
		})
		.then((data) => {
			buildPosts(data);
		})
		.catch((error) => {
			console.log("Fetch Error :-S", error);
		});
};

/**
 *  function to Display the posts to the frontEnd
 *  @param {posts} posts Object
 */
const buildPosts = (posts) => {
	let blogPostContent = document.querySelector("#blogPostContent");
	posts.forEach((post) => {
		const { id, title, content, post_image, added_date } = post;
		let image = `${API_BASE_URL}/static/${post_image}`;
		const postDtae = new Date(parseInt(added_date)).toDateString();
		const postlink = `/post.html?id=${id}`;

		blogPostContent.innerHTML += `
    <a href="${postlink}" id="individualPost">
				<div class="main__container--post">
						<div class="main__container--post__image" 
										style="background-image: url(${image});">
					</div>

					<div class="main__container--post__content">
						<!-- blog_post_date -->
						<div class="post--date">${postDtae}</div>
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
								text-decoration: underline"
								>
								Continue reading ...
								</span>
			   </div>
		    </div>
		</a>
		`;
	});
};


// Clear Local Storage
const deleteTokenFromlocalStorage = document.getElementById(
	"removeTokenButton",
);

deleteTokenFromlocalStorage.addEventListener("click", () => {
	localStorage.removeItem("token");
});

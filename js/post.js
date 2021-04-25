/** @format */

const API_URL = "http://localhost:3000/api/posts/";
const API_BASE_URL = "http://localhost:3000";

// Call function whe the page is loaded
window.onload = () => {
	getPost();
};

const getPostIdParam = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams.get("id");
};

//  function to get individual post based on it Id
const getPost = () => {
	const postId = getPostIdParam();
	const fetchUrl = `${API_URL}${postId}`;

	// GET request using fetch()
	fetch(fetchUrl, {
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
			buildPost(data.foundPost);
		})
		.catch((error) => {
			console.log("Fetch Error :-S", error);
		});
};

/**
 *  function to Display the post to the frontEnd
 *  @param {post} post Object
 */
const buildPost = (post) => {
	const { id, title, content, post_image, added_date } = post;
	let image = `${API_BASE_URL}/static/${post_image}`;
	const postDtae = new Date(parseInt(added_date)).toDateString();

	const pageHeader = document.querySelector(".page__header");
	pageHeader.style.background = `url('${image}') no-repeat center/contain`;
	document.querySelector(
		"#individual__post--date",
	).innerHTML = `Published on: ${postDtae}`;
	document.querySelector("#individual__post--title").innerHTML = title;
	document.querySelector("#individual__post--content >p").innerHTML = content;
};

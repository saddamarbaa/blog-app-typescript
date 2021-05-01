/** @format */

// The API URL
let API_URL = "http://localhost:3000";

if (location.href.indexOf("netlify") != -1) {
	API_URL = "https://blog-post-api-sadam.herokuapp.com";
}

// Bearer Token
const Bearer = "Bearer " + localStorage.getItem("token");

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
	const fetchUrl = `${API_URL}/api/posts/${postId}`;

	// GET request using fetch()
	fetch(fetchUrl, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: Bearer,
		},
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
			buildPost(data.result);
		})
		.catch((error) => {
			console.log("Fetch Error :-S", error);
		});
};

//  function to delete individual post based on it Id
const deletePost = () => {
	const postId = getPostIdParam();
	const fetchUrl = `${API_URL}/api/posts/${postId}`;

	// GET request using fetch()
	fetch(fetchUrl, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: Bearer,
		},
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
			// delete the data then the  redirect user to the home page
			location.href = "/login.html";
		})
		.catch((error) => {
			alert("You Are Unthorized To Delete This Post");
			localStorage.removeItem("token");
			location.href = "/login.html";
			console.log("Fetch Error :-S", error);
		});
};

/**
 *  function to Display the post to the frontEnd
 *  @param {post} post Object
 */
const buildPost = (post) => {
	const { id, title, content, post_image, added_date } = post;
	let image = `${API_URL}/static/${post_image}`;
	const postDtae = new Date(parseInt(added_date)).toDateString();

	const pageHeader = document.querySelector(".page__header");
	pageHeader.style.background = `url('${image}') no-repeat center/contain`;
	document.querySelector(
		"#individual__post--date",
	).innerHTML = `Published on: ${postDtae}`;
	document.querySelector("#individual__post--title").innerHTML = title;
	document.querySelector("#individual__post--content >p").innerHTML = content;

	const deletePostButton = document.getElementById("individual__post-delete");
	const deletePostContainer = document.getElementById("delete-post-container");
	deletePostContainer.classList = "navigation";
	deletePostButton.innerHTML = "Delete";
};

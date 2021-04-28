/** @format */

// The API URL
const API_URL = "http://localhost:3000/api/posts";
const newPostForm = document.getElementById("newPostForm");

// Bearer Token
const Bearer = "Bearer " + localStorage.getItem("token");

// EventListeners
newPostForm.addEventListener("submit", (event) => {
	/**
	 * This prevents the default behaviour of the browser submitting
	 * the form so that we can handle things instead.
	 */
	event.preventDefault();

	// Build FormData
	let formData = new FormData(); // Currently empty
	const title = document.getElementById("form-post-title").value;
	const content = document.getElementById("form-post-content").value;
	const fileInputElement = document.getElementById("form-post-image");
	formData.append("postImage", fileInputElement.files[0]);
	formData.append("title", title);
	formData.append("content", content);

	// Call submitNewPost() function
	submitNewPost(formData);
});

// Functions
const submitNewPost = (formData) => {
	// POST request using fetch()
	fetch(API_URL, {
		method: "POST",
		body: formData,
		headers: {
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
			location.href = "/login.html";
		})
		.catch((error) => {});
};

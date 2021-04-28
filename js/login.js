/** @format */

// Selecters
const loginForm = document.getElementById("loginForm");

// Bearer Token
const Bearer = "Bearer " + localStorage.getItem("token");

// The API URL
const API_URL = "http://localhost:3000";

/**
 * Event handler for a form  on submit event.
 * @param {SubmitEvent} event
 */
loginForm.addEventListener("submit", (event) => {
	/**
	 * This prevents the default behaviour of the browser submitting
	 * the form so that we can handle things instead.
	 */
	event.preventDefault();

	// user input payload
	const user = document.loginform;
	const payload = {
		email: user.email.value,
		password: user.password.value,
	};

	loginfetch(payload);
});

const loginfetch = (payload) => {
	// POST request using fetch()
	fetch(API_URL + "/api/users/login", {
		/**
		 * The default method for a request with fetch is GET,
		 * so we must tell it to use the POST HTTP method.
		 */
		method: "POST",
		/**
		 * These headers will be added to the request and tell
		 * the API that the request body is JSON and that we can
		 * accept JSON responses.
		 */
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: Bearer,
		},

		// The body of our POST request is the JSON string that we created above.
		body: JSON.stringify(payload),
	})
		.then((response) => {
			if (response.ok) {
				// Convert to JSON  and returned
				return response.json();
			} else {
				// throw new Error(response.statusText);
				throw new Error("Something went wrong");
			}
		}) // returns a promise already
		.then((data) => {
			// Displaying results to console
			console.log(data);

			// save the token in the localStorage
			localStorage.setItem("token", data.token);

			// redirect user to the home page
			location.href = "/";
		})
		.catch((error) => {
			// redirect user to the register page

			console.log("Fetch Error :-S", error);
		});
};

// redirect user to the register page
const redirectToRegisterPage = () => (location.href = "/register.html");

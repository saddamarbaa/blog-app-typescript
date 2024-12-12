import { clearLocalStorage, sendFetchHttpRequest } from '../utils/helper.js'
import { ApiResponse, IUser } from '../interfaces/index.js'

window.onload = () => {
	getProfile()
}

// Function to fetch profile data and update the form
async function getProfile() {
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
			localStorage.setItem('userId', user._id)

			populateForm(user)
		} else {
			alert('Error fetching profile data')
		}
	} catch (error) {
		console.error('Error:', error)
		alert('An error occurred while fetching profile data.')
	}
}

// Function to populate the form with profile data
function populateForm(profileData: IUser) {
	const firstNameInput = document.getElementById(
		'firstName',
	) as HTMLInputElement
	firstNameInput.value = profileData.firstName || ''

	const lastNameInput = document.getElementById('lastName') as HTMLInputElement
	lastNameInput.value = profileData.lastName || ''

	const emailInput = document.getElementById('email') as HTMLInputElement
	emailInput.value = profileData.email || ''

	const bioTextArea = document.getElementById('bio') as HTMLTextAreaElement
	bioTextArea.value = profileData.bio || ''

	// If the profile has a profile picture URL, set the profileUrl input
	if (profileData.profileUrl) {
		const profileUrlInput = document.getElementById(
			'profileUrl',
		) as HTMLInputElement
		profileUrlInput.value = profileData.profileUrl
	}
}

// Function to handle profile update form submission
document
	.getElementById('updateProfileForm')
	?.addEventListener('submit', async (e) => {
		e.preventDefault()

		// Get the update button and disable it
		const updateButton = document.getElementById(
			'updateProfileButton',
		) as HTMLButtonElement
		updateButton.disabled = true
		updateButton.innerText = 'Updating...'

		const formData = new FormData()
		const firstName = (document.getElementById('firstName') as HTMLInputElement)
			.value
		const lastName = (document.getElementById('lastName') as HTMLInputElement)
			.value
		const email = (document.getElementById('email') as HTMLInputElement).value
		const bio = (document.getElementById('bio') as HTMLTextAreaElement).value
		const profileImageUpload = (
			document.getElementById('profileImageUpload') as HTMLInputElement
		).files?.[0]
		const profileUrl = (
			document.getElementById('profileUrl') as HTMLInputElement
		).value

		formData.append('firstName', firstName)
		formData.append('lastName', lastName)
		formData.append('email', email)
		formData.append('bio', bio)

		// Append either the uploaded image file or the provided URL, but not both
		if (profileImageUpload) {
			formData.append('profileImage', profileImageUpload)
		} else if (profileUrl) {
			formData.append('profileUrl', profileUrl)
		}

		try {
			const id = localStorage.getItem('userId')

			await sendFetchHttpRequest<ApiResponse<{}>>(
				`/api/v1/auth/update/${id}`,
				'PATCH',
				formData,
				{
					Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
				},
				true,
			)

			alert('Profile updated successfully!')
		} catch (error) {
			console.error('Error:', error)
			alert('An error occurred. Please try again later.')
		} finally {
			// Re-enable the button after the API call completes
			updateButton.disabled = false
			updateButton.innerText = 'Update Profile'
		}
	})

// Get modal elements
const modal = document.getElementById('deleteProfileModal') as HTMLElement
const closeModal = document.getElementById('closeModal') as HTMLElement
const confirmDeleteProfile = document.getElementById(
	'confirmDeleteProfile',
) as HTMLElement
const cancelDeleteProfile = document.getElementById(
	'cancelDeleteProfile',
) as HTMLElement

// Show the modal when the delete button is clicked
document.getElementById('deleteProfile')?.addEventListener('click', () => {
	modal.style.display = 'block'
})

// Close the modal when the "x" (close) button is clicked
closeModal.addEventListener('click', () => {
	modal.style.display = 'none'
})

// Handle confirmation of profile deletion
confirmDeleteProfile.addEventListener('click', async () => {
	const id = localStorage.getItem('userId')
	// Get the delete button and disable it
	const deleteButton = document.getElementById(
		'confirmDeleteProfile',
	) as HTMLButtonElement
	deleteButton.disabled = true
	deleteButton.innerText = 'Deleting...'

	try {
		const response = await sendFetchHttpRequest<ApiResponse<{}>>(
			`/api/v1/auth/remove/${id}`,
			'DELETE',
			null,
			{
				Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
			},
			false,
		)

		alert('Profile deleted successfully.')
		clearLocalStorage()
	} catch (error) {
		console.error('Error:', error)
		alert('An error occurred. Please try again later.')
	} finally {
		// Re-enable the button after the API call completes
		deleteButton.disabled = false
		deleteButton.innerText = 'Delete Profile'
	}
})

// Close the modal when the "Cancel" button is clicked
cancelDeleteProfile.addEventListener('click', () => {
	modal.style.display = 'none'
})

// Close the modal if the user clicks anywhere outside of the modal
window.addEventListener('click', (event) => {
	if (event.target === modal) {
		modal.style.display = 'none'
	}
})

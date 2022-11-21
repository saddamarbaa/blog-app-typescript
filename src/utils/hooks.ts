// just for testing test setup

export class User {
	constructor(public email: string) {
		this.email = email
	}

	updateEmail(newEmail: string) {
		this.email = newEmail
	}

	clearEmail() {
		this.email = ''
	}
}

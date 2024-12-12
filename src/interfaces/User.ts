export interface IUser {
	firstName: string
	lastName: string
	email: string
	password: string
	confirmPassword: string
	bio?: string
	skills: string[]
	profileUrl: string
	role: string
	_id: string
}

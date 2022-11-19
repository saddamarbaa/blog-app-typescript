export interface InputT {
	value: string
	isVaild: boolean
}

export interface FieldT {
	name?: InputT
	email?: InputT
	password?: InputT
	'confirm-password'?: InputT
}

export interface ValidatorInterface {
	fields: FieldT
}

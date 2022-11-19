export interface ApiResponse<T> {
	data: T | null
	success: boolean
	error: boolean
	message: string
	status: number
}

export function truncateAddress(address: string) {
	const first = address.substring(0, 4)
	const last = address.slice(-4)
	return first + '...' + last
}
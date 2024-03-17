export const convertLocationToCoordination = (location: string) => {
	if (!location) {
		return null
	}
	const [latitude, longitude] = location
		.split(',')
		.map((item) => parseFloat(item))
	if (isNaN(longitude) || isNaN(latitude)) {
		return null
	}
	return {
		longitude,
		latitude,
	}
}

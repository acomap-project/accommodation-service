export const convertLocationToCoordination = (location: string) => {
	if (!location) {
		return null
	}
	const [longitude, latitude] = location
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

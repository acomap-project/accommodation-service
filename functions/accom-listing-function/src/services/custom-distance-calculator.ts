import { Coordination } from '../models/accommodation.model'
import { IMapService } from '../interfaces/map-service.interfaces'

export class CustomDistanceCalculator implements IMapService {
	async calculateDistance(
		firstCoord: Coordination,
		secondCoord: Coordination,
	): Promise<number> {
		// Define the radius of the Earth in kilometers
		const EARTH_RADIUS = 6371

		// Extract the latitude and longitude values from the first and second coordinates
		const { latitude: lat1, longitude: lon1 } = firstCoord
		const { latitude: lat2, longitude: lon2 } = secondCoord

		// Convert the latitude and longitude differences to radians
		const dLat = this.toRadians(lat2 - lat1)
		const dLon = this.toRadians(lon2 - lon1)

		// Apply the Haversine formula to calculate the distance between the two coordinates
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRadians(lat1)) *
				Math.cos(this.toRadians(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2)

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

		// Calculate the distance using the Earth's radius and the calculated value of c
		const distance = EARTH_RADIUS * c

		// Return the calculated distance as a resolved Promise
		return parseFloat(distance.toFixed(2))
	}

	toRadians(degrees: number): number {
		return degrees * (Math.PI / 180)
	}
}

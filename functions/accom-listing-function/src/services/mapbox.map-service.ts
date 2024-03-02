import axios from 'axios'
import { Coordination } from '../models'
import { IMapService } from '../interfaces/map-service.interfaces'

export interface MapboxServiceConfig {
	accessToken: string
}

export class MapboxService implements IMapService {
	constructor(private readonly config: MapboxServiceConfig) {}

	async calculateDistance(
		firstCoord: Coordination,
		secondCoord: Coordination,
	): Promise<number> {
		const { longitude: firstLongitude, latitude: firstLatitude } =
			firstCoord
		const { longitude: secondLongitude, latitude: secondLatitude } =
			secondCoord
		try {
			const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${firstLongitude},${firstLatitude};${secondLongitude},${secondLatitude}?access_token=${this.config.accessToken}`
			const response = await axios.get(url)
			const distanceInMeters = response.data.routes[0].distance
			const distanceInKilometers = distanceInMeters / 1000
			const roundedDistance = Math.round(distanceInKilometers * 10) / 10
			return roundedDistance
		} catch (error) {
			console.error('Error getting distance:', error)
			throw error
		}
	}
}

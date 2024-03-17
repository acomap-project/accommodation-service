import { convertRecentDaysToDateList } from '../utils/convert-recent-days-to-date-list'
import { QueryAccommodationsDTO } from './dtos/query-accommodations.dtos'
import { AccommodationRepository } from '../database'
import { IMapService } from '../interfaces/map-service.interfaces'
import { QueryCondition } from '../database/accommodation.repository'

export class AccommodationController {
	constructor(
		private readonly accommodationRepository: AccommodationRepository,
		private readonly mapService: IMapService,
	) {}

	async queryAccommodationByDistrict(query: QueryAccommodationsDTO) {
		const {
			cityCode,
			areaCode,
			most_recent_days,
			min_price,
			max_price,
			location,
			max_distance: maxDistance,
		} = query

		const dateList = convertRecentDaysToDateList(most_recent_days)
		const condition: QueryCondition = {
			dateList,
			minPrice: min_price,
			maxPrice: max_price,
			cityCode,
			areaCode,
		}
		const accommodationList =
			await this.accommodationRepository.queryWithConditions(condition)

		if (!location) {
			return {
				status: 'OK',
				items: accommodationList,
				count: accommodationList.length,
			}
		}

		const filterByDistanceList = []
		await Promise.all(
			accommodationList.map(async (accommodation) => {
				const distance = await this.mapService.calculateDistance(
					{
						latitude: location.latitude,
						longitude: location.longitude,
					},
					{
						latitude: accommodation.location.latitude,
						longitude: accommodation.location.longitude,
					},
				)
				if (distance <= maxDistance) {
					filterByDistanceList.push({
						...accommodation,
						distance,
					})
				}
			}),
		)

		return {
			status: 'OK',
			items: filterByDistanceList,
			count: filterByDistanceList.length,
		}
	}
}

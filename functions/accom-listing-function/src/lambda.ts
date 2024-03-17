import { Context } from 'aws-lambda'
import { AccommodationController } from './controllers'
import { AccommodationRepository } from './database'
import { CustomDistanceCalculator } from './services/custom-distance-calculator'
import { convertLocationToCoordination } from './utils/convert-location-to-coordination'
import { isStringNotEmpty } from './utils/validator'

export interface ListingAccommodationsEvent {
	cityCode: string
	areaCode: string
	most_recent_days: string
	min_price: string
	max_price: string
	location: string
	max_distance: string
}

let controller: AccommodationController
let isInit = false

const init = () => {
	if (isInit) {
		return
	}
	controller = new AccommodationController(
		new AccommodationRepository({
			tableName: process.env.ACCOMMODATION_TABLE_NAME,
			limit: parseInt(process.env.RESULT_LIMIT) || 20,
		}),
		new CustomDistanceCalculator(),
	)
	isInit = true
}

export const handler = async (
	event: ListingAccommodationsEvent,
	context: Context,
) => {
	init()
	console.log(event)
	const coordination = convertLocationToCoordination(event.location)
	// get query params from lambda event
	const result = await controller.queryAccommodationByDistrict({
		cityCode: isStringNotEmpty(event.cityCode)
			? event.cityCode
			: 'ho-chi-minh',
		areaCode: isStringNotEmpty(event.areaCode) ? event.areaCode : null,
		most_recent_days: parseInt(event.most_recent_days) || 0,
		min_price: parseInt(event.min_price) || 0,
		max_price: parseInt(event.max_price) || 1000000000,
		location: coordination,
		max_distance: parseInt(event.max_distance) || -1,
	})
	return result
}

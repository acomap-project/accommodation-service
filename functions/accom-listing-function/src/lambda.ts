import { Context } from 'aws-lambda'
import { AccommodationController } from './controllers'
import { AccommodationRepository } from './database'
import { MapboxService } from './services/mapbox.map-service'

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
		new MapboxService({
			accessToken: process.env.MAPBOX_ACCESS_TOKEN,
		}),
	)
	isInit = true
}

export const handler = async (event: any, context: Context) => {
	init()
	console.log(event)
	// get query params from lambda event
	const result = await controller.queryAccommodationByDistrict({
		district: event.district || null,
		most_recent_days: parseInt(event.most_recent_days) || 3,
		min_price: parseInt(event.min_price) || 0,
		max_price: parseInt(event.max_price) || 100000000,
		location: event.location,
		max_distance: parseInt(event.max_distance) || -1,
	})
	return result
}

import { Context, SQSEvent } from 'aws-lambda'
import { AccommodationRepository } from './database'
import { Accommodation } from './models'
import { AccommodationController } from './controllers/accommodation.controller'

let controller: AccommodationController
let isInit = false

const init = () => {
	if (isInit) {
		return
	}
	// init resources here
	const repo = new AccommodationRepository({
		tableName: process.env.ACCOMMODATION_TABLE_NAME,
		limit: 25,
	})
	controller = new AccommodationController(repo)

	isInit = true
}

export const handler = async (event: SQSEvent, context: Context) => {
	init()

	let accomList: Accommodation[] = []

	// event is SQS Event
	if (event.Records) {
		accomList = getAccomListFromSQSEvent(event)
	}

	await controller.batchSaveAccommodations({
		items: accomList,
	})

	console.log(`Processed ${accomList.length} items`)
}

function getAccomListFromSQSEvent(event: SQSEvent): Accommodation[] {
	return event.Records.flatMap((record) => {
		try {
			const jsonBody =
				typeof record.body === 'string'
					? JSON.parse(record.body)
					: record.body
			const items = jsonBody.item_list

			return items
		} catch (error) {
			console.error('Error parsing json', error)
			throw error
		}
	})
}

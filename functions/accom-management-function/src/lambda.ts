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
	if (!event.Records) {
		accomList = getAccomListFromSQSEvent(event)
	} else {
		console.log('No records found in event')
	}

	await controller.batchSaveAccommodations({
		items: accomList,
	})

	console.log(`Processed ${accomList.length} items`)
}

function getAccomListFromSQSEvent(event: SQSEvent): Accommodation[] {
	return event.Records.map((record) => {
		try {
			const accom =
				typeof record.body === 'string'
					? JSON.parse(record.body)
					: record.body
			return accom
		} catch (error) {
			console.error('Error parsing json', error)
			throw error
		}
	})
}

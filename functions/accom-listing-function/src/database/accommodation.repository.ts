import { Accommodation } from '../models/accommodation.model'
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient()

export interface Config {
	tableName: string
	limit: number
}

export interface QueryCondition {
	cityCode: string
	areaCode?: string
	dateList?: string[]
	area_code?: string
	minPrice?: number
	maxPrice?: number
}

export class AccommodationRepository {
	constructor(private readonly config: Config) {}

	async queryWithConditions(
		condition: QueryCondition,
	): Promise<Accommodation[]> {
		const {
			dateList,
			minPrice = 0,
			maxPrice = 1000000000,
			cityCode,
			areaCode = null,
		} = condition
		try {
			let keyConditionExpression = 'cityCode = :cityCode'
			if (areaCode) {
				keyConditionExpression += ' AND areaCode = :areaCode'
			}

			let startKey
			const items = []
			do {
				const command = new QueryCommand({
					TableName: this.config.tableName,
					KeyConditionExpression: keyConditionExpression,
					ExpressionAttributeValues: {
						':cityCode': { S: cityCode },
						...(areaCode && {
							':areaCode': { S: areaCode },
						}),
					},
					ExclusiveStartKey: startKey,
					IndexName: 'city_code-area_code-index',
				})

				const response = await client.send(command)
				items.push(...response.Items)
				startKey = response.LastEvaluatedKey
			} while (startKey)

			const accomList: Accommodation[] = items.map((item) => {
				const longitude = item.location.M.longitude.N
				const latitude = item.location.M.latitude.N
				return {
					id: item.id.S,
					source: item.source.S,
					cityCode: item.cityCode.S,
					areaCode: item.areaCode.S,
					propUrl: item.propUrl.S,
					propertyName: item.propertyName.S,
					price: parseFloat(item.price.N),
					area: parseInt(item.area.N),
					numberOfBedRooms: parseInt(item.numberOfBedRooms.N),
					numberOfWCs: parseInt(item.numberOfWCs.N),
					publishedDate: item.publishedDate.S,
					location: {
						longitude: parseFloat(longitude),
						latitude: parseFloat(latitude),
					},
					phoneNumber: item.phoneNumber.S,
					address: item.address.S,
					description: item.description.S,
				}
			})

			const filter = (item: Accommodation) => {
				return (
					item.price >= minPrice &&
					item.price <= maxPrice &&
					dateList.includes(item.publishedDate)
				)
			}
			return accomList.filter(filter)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

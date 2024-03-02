import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Accommodation } from '../models/accommodation.model'

const client = new DynamoDBClient()

export interface Config {
	tableName: string
	limit: number
}

export interface QueryCondition {
	dateList: string[]
	minPrice: number
	maxPrice: number
	district: string
}

export class AccommodationRepository {
	constructor(private readonly config: Config) {}

	async save(
		accomList: Accommodation[],
	): Promise<{ successAll: boolean; failedResults: any[] }> {
		if (accomList.length === 0) {
			return
		}
		const putRequests: any[] = accomList.map((item) => {
			return {
				PutRequest: {
					Item: {
						source: { S: item.source },
						id: { S: item.id },
						propUrl: { S: item.propUrl },
						propertyName: { S: item.propertyName },
						price: { N: item.price.toString() },
						area: { N: item.area.toString() },
						numberOfBedRooms: {
							N: item.numberOfBedRooms.toString(),
						},
						numberOfWCs: { N: item.numberOfWCs.toString() },
						publishedDate: { S: item.publishedDate },
						phoneNumber: { S: item.phoneNumber },
						address: { S: item.address },
						description: { S: item.description },
						...(item.location && {
							location: {
								M: {
									longitude: {
										N: item.location.longitude.toString(),
									},
									latitude: {
										N: item.location.latitude.toString(),
									},
								},
							},
						}),
						isLocationResolved: {
							BOOL: item.isLocationResolved,
						},
						createdAt: {
							N: (item.createdAt || Date.now()).toString(),
						},
						updatedAt: {
							N: (item.updatedAt || Date.now()).toString(),
						},
					},
				},
			}
		})

		const batchList: any[] = putRequests.reduce((pre, cur) => {
			if (!pre[0] || pre[0].length >= 25) {
				pre.unshift([])
			}
			pre[0].push(cur)
			return pre
		}, [])

		const results = await Promise.allSettled(
			batchList.map(async (batch) => {
				const command = new BatchWriteItemCommand({
					RequestItems: {
						[this.config.tableName]: batch,
					},
				})
				return await client.send(command)
			}),
		)

		const failedResults = results
			.filter((result) => result.status === 'rejected')
			.map((result) => (result as PromiseRejectedResult).reason)

		return {
			successAll: failedResults.length === 0,
			failedResults,
		}
	}
}

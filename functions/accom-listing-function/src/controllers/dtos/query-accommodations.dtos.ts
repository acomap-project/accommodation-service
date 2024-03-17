import { Accommodation, Coordination } from '../../models'

export class QueryAccommodationsDTO {
	district: string
	most_recent_days: number
	min_price: number
	max_price: number
	location: Coordination
	max_distance: number
}

export class QueryAccommodationsResponse {
	status: string
	data: {
		items: Accommodation[]
	}
}

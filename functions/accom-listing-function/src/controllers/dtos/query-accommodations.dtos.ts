import { Accommodation, Coordination } from '../../models'

export interface QueryAccommodationsDTO {
	cityCode?: string
	areaCode?: string
	most_recent_days?: number
	min_price?: number
	max_price?: number
	location?: Coordination
	max_distance?: number
}

export class QueryAccommodationsResponse {
	status: string
	data: {
		items: Accommodation[]
	}
}

export interface Coordination {
	longitude: number
	latitude: number
}

export interface Accommodation {
	id: string
	cityCode: string
	areaCode: string
	propUrl: string
	propertyName: string
	price: number
	area: number
	numberOfBedRooms: number
	numberOfWCs: number
	publishedDate: string
	location: Coordination
	phoneNumber: string
	address: string
	source: string
	createdAt: number
	updatedAt: number
}

import { Coordination } from '../models'

export interface IMapService {
	calculateDistance(
		firstCoord: Coordination,
		secondCoord: Coordination,
	): Promise<number>
}

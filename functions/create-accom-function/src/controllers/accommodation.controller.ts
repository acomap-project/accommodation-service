import { AccommodationRepository } from '../database'
import { BatchSaveAccommodationsRequest } from '../dtos/batch-save-accommodations.dtos'

export class AccommodationController {
	constructor(private readonly accomRepo: AccommodationRepository) {}

	async batchSaveAccommodations(
		input: BatchSaveAccommodationsRequest,
	): Promise<void> {
		const { items } = input
		const { successAll, failedResults } = await this.accomRepo.save(items)
		if (!successAll) {
			console.error(
				'Error saving accommodations',
				JSON.stringify(failedResults),
			)
		}
	}
}

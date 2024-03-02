import { default as moment } from 'moment'

export const convertRecentDaysToDateList = (recentDays: number): string[] => {
	const dateList: string[] = []
	const today = new Date()
	for (let i = 0; i < recentDays; i++) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)
		// convert date to format dd/MM/yyyy using moment library
		const formattedDate = moment(date).format('DD/MM/yyyy')
		dateList.push(formattedDate)
	}
	return dateList
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
	path: path.join(__dirname, '../.env'),
})

import path from 'path'
import express, { Request, Response } from 'express'
import { handler } from './lambda'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': '*',
	})
	next()
})

app.options('*', (req, res) => {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': '*',
	})
	res.status(200).send()
})
app.get('/accommodations', async (req: Request, res: Response) => {
	try {
		const result = await handler(req.query as any, {} as any)

		res.status(200).json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({
			error: JSON.stringify(error),
		})
	}
})

app.listen(3000, () => {
	console.log('Listening on port 3000')
})

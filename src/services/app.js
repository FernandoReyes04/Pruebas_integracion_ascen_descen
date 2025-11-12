import express from 'express';
import { pokeApiService } from './pokeApiService.js';

export function buildApp({ pokeApiSvc = pokeApiService } = {}) {
	const app = express();
	app.use(express.json());+

	app.get('/pokemon-details/:name', async (req, res) => {
		const { name } = req.params;
		try {
			const data = await pokeApiSvc.getPokemonDetails(name);
			if (!data) return res.status(404).json({ error: 'Pokemon not found' });
			return res.status(200).json(data);
		} catch (err) {
			return res.status(500).json({ error: 'Internal server error' });
		}
	});

	return app;
}

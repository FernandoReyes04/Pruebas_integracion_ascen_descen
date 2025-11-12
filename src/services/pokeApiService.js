// src/services/pokeApiService.js

import { setGlobalDispatcher, Agent } from 'undici';

const BASE_URL = 'https://pokeapi.co/api/v2';

const agent = new Agent({
  keepAliveTimeout: 1000,
  keepAliveMaxTimeout: 1000,
});

setGlobalDispatcher(agent);

export async function shutdownHttpAgent() {
  try {
    await agent.close();
  } catch (err) {
  }
}

export const pokeApiService = {
  getPokemonDetails: async (name) => {
    console.log(`[PokeApiService REAL] Buscando a ${name}...`);
    
    try {
      const pokeRes = await fetch(`${BASE_URL}/pokemon/${name}`);
      if (!pokeRes.ok) {
        if (pokeRes.status === 404) return null; // No encontrado
        throw new Error(`Pokemon API failed with status ${pokeRes.status}`);
      }
      const pokemon = await pokeRes.json();

      const speciesRes = await fetch(pokemon.species.url);
      if (!speciesRes.ok) {
        throw new Error(`Species API failed with status ${speciesRes.status}`);
      }
      const species = await speciesRes.json();

      const flavorTextEntry = species.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      );
      const description = flavorTextEntry
        ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')
        : 'No description available.';

      return {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.types[0].type.name,

        sprite: pokemon.sprites.front_default,
        description: description,
      };

    } catch (error) {
      console.error(`[PokeApiService REAL] Error:`, error.message);
      // Lanzamos el error para que el controlador lo atrape
      throw new Error('Failed to fetch data from PokeAPI');
    }
  },
};

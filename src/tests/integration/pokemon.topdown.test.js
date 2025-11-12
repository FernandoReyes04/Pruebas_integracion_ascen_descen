import { jest } from '@jest/globals';
import request from 'supertest';
import { buildApp } from '../../services/app.js';
import { pokeApiService as realPokeApiService, shutdownHttpAgent } from '../../services/pokeApiService.js';
import https from 'https';

// FASE 1: PRUEBA TOP-DOWN CON STUBS (Aislamos el Controlador)
describe('Fase 1: Top-Down (Controlador con Stub Service)', () => {
  
  // 1. Creamos nuestro stub (simulador)
  const stubPokeApi = {
    getPokemonDetails: jest.fn(), // Usamos jest.fn() para espiar
  };

  // 2. Inyectamos el STUB en la app
  const app = buildApp({ pokeApiSvc: stubPokeApi });

  // 3. Reseteamos el historial del stub antes de CADA prueba
  beforeEach(() => {
    stubPokeApi.getPokemonDetails.mockReset();
  });

  test('Debería retornar datos del pokemon (200) si el stub lo encuentra', async () => {
    // Configuración del Stub: Simula que encuentra a Pikachu
    const mockPikachu = {
      id: 25,
      name: 'pikachu',
      type: 'electric',
      description: 'A mouse pokemon.',
    };
    stubPokeApi.getPokemonDetails.mockResolvedValue(mockPikachu);

    // Actuamos (Llamamos a la API)
    const res = await request(app).get('/pokemon-details/pikachu');

    // Afirmamos (Verificamos la respuesta)
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('pikachu');
    expect(res.body.description).toBe('A mouse pokemon.');

    // Afirmamos (Verificamos la ORQUESTACIÓN)
    // ¿Se llamó al stub con el argumento correcto?
    expect(stubPokeApi.getPokemonDetails).toHaveBeenCalledWith('pikachu');
    expect(stubPokeApi.getPokemonDetails).toHaveBeenCalledTimes(1);
  });

  test('Debería retornar (404) si el stub NO lo encuentra', async () => {
    // Configuración del Stub: Simula un 404
    stubPokeApi.getPokemonDetails.mockResolvedValue(null);

    // Actuamos
    const res = await request(app).get('/pokemon-details/not-a-pokemon');

    // Afirmamos (Verificamos la respuesta)
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Pokemon not found');

    // Afirmamos (Verificamos la ORQUESTACIÓN)
    expect(stubPokeApi.getPokemonDetails).toHaveBeenCalledWith('not-a-pokemon');
  });

  test('Debería retornar (500) si el stub lanza un error', async () => {
    // Configuración del Stub: Simula una falla de red
    stubPokeApi.getPokemonDetails.mockRejectedValue(new Error('Network failure'));

    // Actuamos
    const res = await request(app).get('/pokemon-details/ditto');

    // Afirmamos (Verificamos la respuesta)
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

// (El cierre del agente HTTP se hace al final del archivo llamando shutdownHttpAgent)

// =================================================================
// FASE 2: INTEGRACIÓN PROGRESIVA (Controlador + SERVICIO REAL)
// =================================================================
describe('Fase 2: Integración (Controlador + Servicio REAL)', () => {

  // 1. Inyectamos el servicio REAL en la app
  const app = buildApp({ pokeApiSvc: realPokeApiService }); // <--- ¡AQUÍ ESTÁ EL CAMBIO!

  test('Debería retornar datos REALES de pikachu (200)', async () => {
    // Actuamos (Llamamos a la API, esto hará una llamada de RED REAL)
    const res = await request(app)
      .get('/pokemon-details/pikachu')
      .timeout(5000); // Damos 5 segs por si la red está lenta

    // Afirmamos (Verificamos la respuesta con datos reales)
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(25);
    expect(res.body.name).toBe('pikachu');
  expect(res.body.type).toBe('electric');
  // La descripción puede variar entre entradas de la API externa; comprobamos que existe y es texto
  expect(typeof res.body.description).toBe('string');
  expect(res.body.description.length).toBeGreaterThan(0);
  }, 10000); // Jest timeout de 10s para esta prueba

  test('Debería retornar (404) para un pokemon REAL inexistente', async () => {
    // Actuamos (Llamada de RED REAL que esperamos falle)
    const res = await request(app)
      .get('/pokemon-details/nonexistentpokemon12345')
      .timeout(5000);

    // Afirmamos
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Pokemon not found');
  }, 10000);
});

// Cerrar el Agent de undici para eliminar handles TLS abiertos
afterAll(async () => {
  try {
    await shutdownHttpAgent();
  } catch (err) {
    // noop
  }
  try {
    https.globalAgent.destroy();
  } catch (err) {
    // noop
  }
});

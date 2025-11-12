# Proyecto: Pruebas de Integración con PokeAPI

Este es un proyecto académico para la asignatura de **Calidad y Pruebas de Software** de la Facultad de Ingeniería de la Universidad Autónoma de Campeche.

El objetivo principal de este proyecto no es la aplicación en sí, sino demostrar la implementación de una **arquitectura de software diseñada para la "testabilidad"**. La estructura del código está intencionalmente modularizada para permitir la ejecución de pruebas de integración con metodologías **Ascendentes (Bottom-Up)** y **Descendentes (Top-Down)**.

La aplicación es un consumidor simple de la [PokeAPI](https://pokeapi.co/) que permite buscar un Pokémon por su nombre.

## 🏛️ Arquitectura del Proyecto

El software se divide en dos módulos principales (capas lógicas) para facilitar el desacoplamiento y las pruebas:

* **`app.js` (Módulo Superior):**
    * Actúa como la capa de "control".
    * Es responsable de manejar la lógica de la aplicación y los eventos del DOM (interacción del usuario).
    * Depende del módulo inferior (`pokeApiService.js`).

* **`pokeApiService.js` (Módulo Inferior):**
    * Actúa como la capa de "servicio" o acceso a datos.
    * Su única responsabilidad es comunicarse con la API externa (PokeAPI) y devolver los datos.
    * No tiene dependencias de otros módulos de la aplicación.

## 🛠️ Tecnologías Usadas

* HTML5
* CSS3 (simple)
* JavaScript (ES6+ Asíncrono)
* [Node.js](https://nodejs.org/) (para el entorno de pruebas)
* [Jest](https://jestjs.io/) (para la ejecución de pruebas y reportes de cobertura)

## 🚀 Instalación

Para configurar el entorno de pruebas, sigue estos pasos:

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/poke-api-testing.git](https://github.com/tu-usuario/poke-api-testing.git)
    ```
2.  Navega a la carpeta del proyecto:
    ```bash
    cd poke-api-testing
    ```
3.  Instala las dependencias de desarrollo (Jest):
    ```bash
    npm install
    ```

## 🖥️ Uso de la Aplicación

Para usar la aplicación web, simplemente abre el archivo `index.html` en tu navegador web.

## 🧪 Pruebas (Testing)

El núcleo de este proyecto es la validación de la arquitectura mediante pruebas.

### Ejecutar Pruebas

Para ejecutar la suite de pruebas completa (Top-Down y Bottom-Up), corre el siguiente comando:

```bash
npm test

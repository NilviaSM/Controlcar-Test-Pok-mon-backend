
# ControlCar Backend

Este proyecto es el backend de la aplicación **ControlCar**. Está construido utilizando Node.js y Express, y utiliza Sequelize para la gestión de la base de datos.

## Configuración de la Base de Datos

La configuración de la base de datos se encuentra en el archivo `config/database.js`. Para que el backend funcione correctamente, es necesario crear una base de datos en un gestor MySQL con el nombre `controlcar_db`. Los detalles de conexión son los siguientes:

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('controlcar_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
```


## Endpoints Disponibles

La API cuenta con los siguientes endpoints para la gestión de pokémones:

- **GET** `/api/pokemon?page=1&limit=150`: Obtiene una lista paginada de pokémones con un límite de 150 por página.
- **GET** `/api/pokemon?name=bulbasaur`: Filtra pokémones por nombre.
- **GET** `/api/pokemon?type=fire`: Filtra pokémones por tipo.
- **GET** `/api/pokemon?type=planta`: Ejemplo de un filtro que no devuelve datos.
- **POST** `/api/pokemon/import`: Importa datos de pokémones a la base de datos.
- **PUT** `/api/pokemon/capture/:id`: Captura un pokémon por su ID (máximo 6 pokémones capturados a la vez).
- **GET** `/api/pokemon/captured`: Lista todos los pokémones capturados.
- **PUT** `/api/pokemon/release/:id`: Libera un pokémon capturado por su ID.

## Instrucciones para la Ejecución

1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar las dependencias.
3. Crear la base de datos en MySQL utilizando un gestor como phpMyAdmin o MySQL Workbench.
4. Modificar la configuración de la base de datos en `config/database.js` si es necesario.
5. Ejecutar `npm start` para iniciar el servidor.
6. puede que necesite `npm install express`

## Dependencias

Las principales dependencias utilizadas en este proyecto son:

- Express
- Sequelize
- MySQL2
- Cors
- Axios

## Notas Adicionales

El proyecto está estructurado para ser escalable y se pueden agregar nuevos endpoints y funcionalidades según sea necesario.

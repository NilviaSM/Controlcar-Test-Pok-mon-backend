const express = require('express');
const sequelize = require('./config/database');
const pokemonRoutes = require('./routes/pokemonRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Configurar las rutas
app.use('/api/pokemon', pokemonRoutes);

// Sincronizar la base de datos y levantar el servidor
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

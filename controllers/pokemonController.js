const Pokemon = require('../models/pokemon');
const axios = require('axios');
const { Op } = require('sequelize');
const errorHandler = require('./errorHandler');

// Función para importar Pokémon
const importPokemons = async (req, res) => {
    try {
        // Verificar si ya existen Pokémon en la base de datos
        const existingPokemons = await Pokemon.findOne();
        if (existingPokemons) {
            return res.status(200).json({ message: 'Pokemons have already been imported' });
        }

        // Si no hay Pokémon, proceder con la importación
        for (let i = 1; i <= 150; i++) {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const { name, types, sprites } = response.data;

            await Pokemon.create({
                name,
                type: types.map(t => t.type.name).join(', '),
                image: sprites.front_default,
            });
        }

        res.status(200).json({ message: 'Pokemons imported successfully' });
    } catch (error) {
        errorHandler(res, error, 500, 'Error importing pokemons');
    }
};

// Función para listar Pokémon con paginación y filtros
const getPokemons = async (req, res) => {
    try {
        const { page = 1, limit = 10, name, type } = req.query;
        const offset = (page - 1) * limit;

        // Construir la consulta con filtros si existen
        let whereClause = {};
        if (name) {
            // Filtra por nombre con coincidencias parciales
            whereClause.name = { [Op.like]: `%${name}%` };
        }
        if (type) {
            // Filtra por tipo con coincidencias parciales
            whereClause.type = { [Op.like]: `%${type}%` };
        }

        // Obtener los Pokémon de la base de datos con paginación y filtros
        const { rows, count } = await Pokemon.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'ASC']], // Ordenar por ID de forma ascendente
        });

        const totalPages = Math.ceil(count / limit);

        // Verificar si la página solicitada está fuera del rango
        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({
                message: 'La página solicitada está fuera del rango disponible.',
                currentPage: parseInt(page),
                totalPages,
                totalPokemons: count,
            });
        }

        res.status(200).json({
            data: rows,
            currentPage: parseInt(page),
            totalPages,
            totalPokemons: count,
        });
    } catch (error) {
        errorHandler(res, error, 500, 'Error al obtener los Pokémon');
    }
};


// Función para capturar un Pokémon
const capturePokemon = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el Pokémon por ID
        const pokemon = await Pokemon.findByPk(id);
        if (!pokemon) {
            return errorHandler(res, new Error('Pokémon not found'), 404, 'Pokémon no encontrado');
        }

        // Verificar si ya hay 6 Pokémon capturados
        const capturedPokemons = await Pokemon.findAll({
            where: { captured: true },
            order: [['updatedAt', 'ASC']],
        });

        if (capturedPokemons.length >= 6) {
            // Liberar el Pokémon más antiguo
            const oldestPokemon = capturedPokemons[0];
            await oldestPokemon.update({ captured: false });
        }

        // Capturar el nuevo Pokémon
        await pokemon.update({ captured: true });
        res.status(200).json({ message: `${pokemon.name} has been captured!` });
    } catch (error) {
        errorHandler(res, error, 500, 'Error capturing pokemon');
    }
};

// Función para listar Pokémon capturados
const getCapturedPokemons = async (req, res) => {
    try {
        const capturedPokemons = await Pokemon.findAll({
            where: { captured: true },
            order: [['updatedAt', 'DESC']],
        });

        res.status(200).json({
            data: capturedPokemons,
            totalCaptured: capturedPokemons.length,
        });
    } catch (error) {
        errorHandler(res, error, 500, 'Error fetching captured pokemons');
    }
};

// Función para liberar un Pokémon capturado
const releasePokemon = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el Pokémon por ID
        const pokemon = await Pokemon.findByPk(id);
        if (!pokemon) {
            return errorHandler(res, new Error('Pokémon not found'), 404, 'Pokémon no encontrado');
        }

        // Verificar si el Pokémon está capturado
        if (!pokemon.captured) {
            return errorHandler(res, new Error('Pokémon is not captured'), 400, 'El Pokémon no está capturado');
        }

        // Liberar el Pokémon
        await pokemon.update({ captured: false });
        res.status(200).json({ message: `${pokemon.name} has been released!` });
    } catch (error) {
        errorHandler(res, error, 500, 'Error releasing pokemon');
    }
};

module.exports = {
    importPokemons,
    getPokemons,
    capturePokemon,
    getCapturedPokemons,
    releasePokemon,
};

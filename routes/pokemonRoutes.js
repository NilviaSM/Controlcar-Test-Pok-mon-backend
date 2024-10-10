const express = require('express');
const { importPokemons, getPokemons, capturePokemon, getCapturedPokemons, releasePokemon} = require('../controllers/pokemonController');

const router = express.Router();


router.get('/', getPokemons);
router.post('/import', importPokemons); //Importa los pokemones que se obtienen de la api
router.put('/capture/:id', capturePokemon); //Capturar pokémon
router.get('/captured', getCapturedPokemons); //Listar pokemones capturados
router.put('/release/:id', releasePokemon); //Liberar Pokémon

module.exports = router;

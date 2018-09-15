/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/**
 * Base de datos
 */
let urlDB;

process.env.NODE_ENV==='dev'? 
    urlDB = 'mongodb://localhost:27017/cafe':
    urlDB = 'mongodb://cafe-user:1234jk@ds157762.mlab.com:57762/cafe'


process.env.URLDB = urlDB;



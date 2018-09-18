/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/**
 * Fecha de Expiración de Token
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */
process.env.CADUCIDAD_TOKEN = 60*60 *24 * 30;

 /**
 * Semilla
 */
process.env.SEMILLA = process.env.SEMILLA  || 'este-es-el-seed-desarrollo';



/**
 * Base de datos
 */
let urlDB;

process.env.NODE_ENV==='dev'? 
    urlDB = 'mongodb://localhost:27017/cafe':
    urlDB = process.env.MONGO_URI;


process.env.URLDB = urlDB;



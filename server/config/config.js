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
 * 1000 milisegundos.
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */
process.env.CADUCIDAD_TOKEN = 1000*60 *24 * 30;

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


/**
 * Google Client ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '477344652337-b8cb02e69dlajcntivq84t4a3m6fpbsp.apps.googleusercontent.com';

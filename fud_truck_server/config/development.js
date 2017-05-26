/**
 * Created by deepak on 5/6/2017.
 */

/**
 *
 * @type {{logConfig: {logLevel: string, errorLogPath: string, infoLogPath: string}, mysqlConfig: {master_database: {init: boolean, host: string, connectionLimit: number, sample_module: string, password: string, database: string, multipleStatements: boolean}, slave_database: {init: boolean, host: string, connectionLimit: number, sample_module: string, password: string, database: string, multipleStatements: boolean}}, mongoConfig: {testMongoDb: {init: boolean, host: string, collection: {test: string}}}, redisConfig: {testRedisDb: {init: boolean, host: string}}}}
 */
var developmentConfig = {
    logConfig: {
        logLevel: "debug",
        errorLogPath: "./logs/error",
        infoLogPath:"./logs"
    },
    mysqlConfig: {
    },
    mongoConfig: {
        fudTruckDb: {
            init: true,
            host: "mongodb://localhost:27017/fudTruckDb",
            collection: {
                login: "login"
            }
        }
    },
    redisConfig:{
    }
};

module.exports=developmentConfig;
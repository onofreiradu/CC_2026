"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const config_1 = require("../config");
const connectionString = process.env.DATABASE_URL ||
    process.env.DATABASE_URL_LOCAL;
const pool = connectionString
    ? new pg_1.Pool({ connectionString })
    : new pg_1.Pool({
        user: config_1.config.db.user,
        host: config_1.config.db.host,
        database: config_1.config.db.database,
        password: config_1.config.db.password,
        port: config_1.config.db.port,
    });
exports.db = {
    query(text, params = []) {
        return pool.query(text, params);
    },
    pool,
};

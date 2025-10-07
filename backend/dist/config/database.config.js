"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const product_entity_1 = require("../modules/products/entities/product.entity");
const databaseConfig = () => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'morganna_db',
    entities: [product_entity_1.Product],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map
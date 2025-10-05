import { Db, MongoClient, ObjectId } from 'mongodb';

import { Logger } from './logger.js';

type MongoConfig = { uri?: string; dbName?: string };

export class MongoService {
    #client: MongoClient | null = null;
    #db: Db | null = null;

    constructor(private readonly cfg: MongoConfig) {}

    async init(): Promise<void> {
        if (this.#db) return;

        Logger.info('Connecting to MongoDB...');

        const uri = this.cfg.uri;
        const dbName = this.cfg.dbName;

        if (!uri) {
            Logger.error('MongoDB URI missing (config.mongo.uri or MONGODB_URI).');
            throw new Error('MongoDB URI missing (config.mongo.uri or MONGODB_URI).');
        }

        this.#client = new MongoClient(uri, {
            maxPoolSize: 10,
            retryWrites: true,
            serverSelectionTimeoutMS: 10_000,
        });

        if (!this.#client) {
            Logger.error('MongoDB client initialization failed.');
            throw new Error('MongoDB client initialization failed.');
        }

        await this.#client.connect();
        this.#db = this.#client.db(dbName);

        if (!this.#db) {
            Logger.error('MongoDB database initialization failed.');
            throw new Error('MongoDB database initialization failed.');
        }

        await this.ensureIndexes();

        // graceful shutdown (manager/PM2 modes included)
        const close = async (): Promise<void> => {
            try {
                await this.#client?.close();
            } catch {
                Logger.error('Error during MongoDB disconnect');
                throw new Error();
            }
            process.exit(0);
        };
        process.once('SIGINT', close);
        process.once('SIGTERM', close);

        Logger.info('MongoDB connected');
    }

    db(): Db {
        if (!this.#db) {
            Logger.error('Mongo not initialized. Call mongo.init() during startup.');
            throw new Error('Mongo not initialized. Call mongo.init() during startup.');
        }

        return this.#db;
    }

    objectId(id: string): ObjectId {
        return new ObjectId(id);
    }

    // Create necessary indexes here for better performance
    async ensureIndexes(): Promise<void> {
        // Example: await this.db().collection('users').createIndex({ email: 1 }, { unique: true });
    }
}

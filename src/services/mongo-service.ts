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
        const db = this.db();

        try {
            await Promise.all([
                db
                    .collection('guild_servers')
                    .createIndex({ guildId: 1 }, { name: 'guild_servers__by_guild' }),
                // only one default per guild
                db.collection('guild_servers').createIndex(
                    { guildId: 1, isDefault: 1 },
                    {
                        name: 'guild_servers__uniq_default_per_guild',
                        unique: true,
                        partialFilterExpression: { isDefault: true },
                    }
                ),
                // optional alias per guild (case-insensitive if you store alias lowercased)
                db.collection('guild_servers').createIndex(
                    { guildId: 1, alias: 1 },
                    {
                        name: 'guild_servers__uniq_alias_per_guild',
                        unique: true,
                        partialFilterExpression: { alias: { $exists: true, $type: 'string' } },
                    }
                ),
            ]);

            // 2) subscriptions
            await Promise.all([
                db
                    .collection('subscriptions')
                    .createIndex({ guildId: 1 }, { name: 'subs__by_guild' }),
                db
                    .collection('subscriptions')
                    .createIndex({ serverKey: 1 }, { name: 'subs__by_server' }),
                db
                    .collection('subscriptions')
                    .createIndex(
                        { guildId: 1, channelId: 1, type: 1, serverKey: 1 },
                        { name: 'subs__uniq_guild_channel_type_server', unique: true }
                    ),
            ]);

            // 3) notes
            await Promise.all([
                db
                    .collection('notes')
                    .createIndex(
                        { guildId: 1, userId: 1, createdAt: -1 },
                        { name: 'notes__by_guild_user_recent' }
                    ),
                // TTL only when expiresAt is set
                db.collection('notes').createIndex(
                    { expiresAt: 1 },
                    {
                        name: 'notes__ttl_if_expiresAt',
                        expireAfterSeconds: 0,
                        partialFilterExpression: { expiresAt: { $exists: true, $type: 'date' } },
                    }
                ),
            ]);

            // 4) status_events
            await Promise.all([
                db
                    .collection('status_events')
                    .createIndex({ serverKey: 1, at: -1 }, { name: 'events__by_server_recent' }),
                db.collection('status_events').createIndex(
                    { at: 1 },
                    {
                        name: 'events__ttl_30d',
                        expireAfterSeconds: 60 * 60 * 24 * 30, // 30 days
                    }
                ),
            ]);

            // 5) alerts
            await Promise.all([
                db
                    .collection('alerts')
                    .createIndex({ guildId: 1, at: -1 }, { name: 'alerts__by_guild_recent' }),
                db.collection('alerts').createIndex(
                    { at: 1 },
                    {
                        name: 'alerts__ttl_14d',
                        expireAfterSeconds: 60 * 60 * 24 * 14, // 14 days
                    }
                ),
            ]);

            Logger.info('MongoDB indexes ensured');
        } catch (err) {
            Logger.error('Error creating indexes', err);
            throw err;
        }
    }
}

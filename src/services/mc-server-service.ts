import { default as McUtil } from 'minecraft-server-util';

import { Logger } from './index.js';

type Server = {
    host: string;
    port: number;
    type: 'java' | 'bedrock';
};

export class McServerService {
    constructor() {}

    public async getStatus(server: Server): Promise<any> {
        try {
            if (server.type === 'java') {
                return await McUtil.status(server.host, server.port, { timeout: 5000 });
            } else if (server.type === 'bedrock') {
                return await McUtil.statusBedrock(server.host, server.port, { timeout: 5000 });
            } else {
                Logger.error(`Unsupported server type for ${server.host}:${server.port}`);
                throw new Error('Unsupported server type');
            }
        } catch (error) {
            Logger.error(
                `Failed to get server status for ${server.host}:${server.port} - ${error.message}`
            );
            throw new Error(`Failed to get server status: ${error.message}`);
        }
    }

    public async getPlayers(server: Server): Promise<any> {
        try {
            if (server.type === 'java') {
                let status = await McUtil.status(server.host, server.port, { timeout: 5000 });
                return status.players;
            } else if (server.type === 'bedrock') {
                let status = await McUtil.statusBedrock(server.host, server.port, {
                    timeout: 5000,
                });
                return status.players;
            } else {
                Logger.error(`Unsupported server type for ${server.host}:${server.port}`);
                throw new Error('Unsupported server type');
            }
        } catch (error) {
            Logger.error(
                `Failed to get player list for ${server.host}:${server.port} - ${error.message}`
            );
            throw new Error(`Failed to get player list: ${error.message}`);
        }
    }
}

import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';

import { McSetEditionOption } from '../../enums/mc-set-option.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang, Logger, McServerService, MongoService } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class McSetCommand implements Command {
    public names = [Lang.getRef('chatCommands.mc-set', Language.Default)];
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = ['Administrator'];

    constructor(private mongoService: MongoService) {}

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const mcServerService = new McServerService();
        const addressOption = intr.options.getString('address', true);
        const editionOption = intr.options.getString('edition', false) as McSetEditionOption;
        const defaultOption = intr.options.getBoolean('default', false);

        let portOption = intr.options.getInteger('port', false);

        let guildServer = await this.mongoService
            .db()
            .collection('guild_servers')
            .findOne({ guildId: intr.guildId });

        if (!portOption) {
            portOption = editionOption === 'bedrock' ? 19132 : 25565;
        }

        if (!guildServer) {
            this.mongoService.db().collection('guild_servers').insertOne({
                guildId: intr.guildId,
                servers: [],
                defaultServer: null,
                notifyChannels: [],
                lastSeenOnline: Date.now(),
                rcon: null,
            });
        }

        guildServer = await this.mongoService
            .db()
            .collection('guild_servers')
            .findOne({ guildId: intr.guildId });

        try {
            const serverStatus = await mcServerService.getStatus({
                host: addressOption,
                port: portOption,
                type: editionOption ?? 'java',
            });

            console.log(serverStatus?.players?.sample);

            if (!serverStatus) {
                await InteractionUtils.send(
                    intr,
                    Lang.getEmbed('errorEmbeds.mcServerOffline', data.lang)
                );
                return;
            }

            const players = serverStatus?.players;

            const guildServers = guildServer?.servers || [];
            const existingServerIndex = guildServers.findIndex(
                (s: any) =>
                    s.address === addressOption &&
                    s.port === portOption &&
                    s.edition === (editionOption ?? 'java')
            );

            if (existingServerIndex !== -1) {
                // Update existing server
                guildServers[existingServerIndex] = {
                    ...guildServers[existingServerIndex],
                    address: addressOption,
                    port: portOption,
                    edition: editionOption ?? 'java',
                };
            } else {
                // Add new server
                guildServers.push({
                    address: addressOption,
                    port: portOption,
                    edition: editionOption ?? 'java',
                });
            }

            await this.mongoService
                .db()
                .collection('guild_servers')
                .updateOne(
                    {
                        guildId: intr.guildId,
                    },
                    {
                        $set: {
                            servers: guildServers,
                            defaultServer: defaultOption
                                ? addressOption
                                : guildServer?.defaultServer || null,
                            lastSeenOnline: Date.now(),
                        },
                    },
                    { upsert: true }
                );

            await InteractionUtils.send(
                intr,
                Lang.getEmbed('displayEmbeds.mcSetSuccess', data.lang, {
                    ADDRESS: addressOption,
                    PORT: portOption.toString(),
                    EDITION: editionOption ?? 'java',
                    PLAYERS_ONLINE: players?.online?.toString() ?? '0',
                })
            );

            Logger.info(
                `MC Server set to ${addressOption}:${portOption} (${editionOption ?? 'java'}) by ${intr.user.tag} (${intr.user.id}) in guild ${intr.guild?.name} (${intr.guild?.id})`
            );

            return;
        } catch (__err) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('errorEmbeds.mcServerOffline', data.lang)
            );
            Logger.error(
                `Failed to set MC Server to ${addressOption}:${portOption} (${editionOption ?? 'java'}) by ${intr.user.tag} (${intr.user.id}) in guild ${intr.guild?.name} (${intr.guild?.id})`
            );
            return;
        }
    }
}

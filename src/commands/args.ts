import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord.js';

import { DevCommandName, HelpOption, InfoOption } from '../enums/index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export class Args {
    public static readonly DEV_COMMAND: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.command', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.command'),
        description: Lang.getRef('argDescs.devCommand', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.devCommand'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('devCommandNames.info', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('devCommandNames.info'),
                value: DevCommandName.INFO,
            },
        ],
    };
    public static readonly HELP_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.helpOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('helpOptionDescs.contactSupport', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('helpOptionDescs.contactSupport'),
                value: HelpOption.CONTACT_SUPPORT,
            },
            {
                name: Lang.getRef('helpOptionDescs.commands', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('helpOptionDescs.commands'),
                value: HelpOption.COMMANDS,
            },
        ],
    };
    public static readonly INFO_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.helpOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('infoOptions.about', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.about'),
                value: InfoOption.ABOUT,
            },
            {
                name: Lang.getRef('infoOptions.translate', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.translate'),
                value: InfoOption.TRANSLATE,
            },
        ],
    };

    public static readonly MCSET_ADDRESS: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.address', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.address'),
        description: Lang.getRef('argDescs.mcsetAddress', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.mcsetAddress'),
        type: ApplicationCommandOptionType.String,
    };
    public static readonly MCSET_EDITION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.edition', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.edition'),
        description: Lang.getRef('argDescs.mcsetEdition', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.mcsetEdition'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: 'Java',
                value: 'java',
            },
            {
                name: 'Bedrock',
                value: 'bedrock',
            },
        ],
    };
    public static readonly MCSET_PORT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.port', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.port'),
        description: Lang.getRef('argDescs.mcsetPort', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.mcsetPort'),
        type: ApplicationCommandOptionType.Integer,
        min_value: 1,
        max_value: 65535,
    };
    public static readonly MCSET_DEFAULT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.default', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.default'),
        description: Lang.getRef('argDescs.mcsetDefault', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.mcsetDefault'),
        type: ApplicationCommandOptionType.Boolean,
    };
}

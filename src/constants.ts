import _ from 'lodash';

import type { QueueID, PortalIdKey, SmiteApiConstants } from './types';

export const API = {
  BASE_URL: 'https://api.smitegame.com/smiteapi.svc',
  RESPONSE_FORMAT: 'Json',
  DEFAULT_FORMAT: 'Json',
  SESSION_ID: 'session_id',
};

export const METHODS = {
  TEST_SESSION: 'testsession',
  CREATE_SESSION: 'createsession',
  GET_PLAYER: 'getplayer',
  GET_MATCH_HISTORY: 'getmatchhistory',
  GET_MATCH_DETAILS: 'getmatchdetails',
  GET_DATA_USED: 'getdataused',
  PING: 'ping',
  GET_PATCH_INFO: 'getpatchinfo',
  GET_ITEMS: 'getitems',
  GET_HIREZ_SERVER_STATUS: 'gethirezserverstatus',
  GET_GODS: 'getgods',
  GET_GOD_ALT_ABILTIES: 'getgodaltabilities',
  GET_GOD_SKINS: 'getgodskins',
  GET_PLAYERID_BY_NAME: 'getplayeridbyname',
  GET_PLAYERIDS_BY_GAMER_TAG: 'getplayeridsbygamertag',
  GET_MATCH_IDS_BY_QUEUE: 'getmatchidsbyqueue',
  GET_MATCH_PLAYER_DETAILS: 'getmatchplayerdetails',
  GET_TOP_MATCHES: 'gettopmatches',
  GET_MOTD: 'getmotd',
  GET_QUEUE_STATS: 'getqueuestats',
};

export const QUEUE_IDS: { [key: string]: QueueID } = {
  NORMAL_CONQUEST: '426',
  NORMAL_ARENA: '435',
  NORMAL_JOUST: '448',
  NORMAL_SLASH: '10189',
  NORMAL_ASSAULT: '445',
  RANKED_CONQUEST_PC: '451',
  RANKED_CONQUEST_CONTROLLER: '504',
  RANKED_JOUST: '450',
  RANKED_DUEL: '440', // Official name is 'Ranked Joust 1v1'
};

export const LANGS = {
  ENGLISH: 1,
  GERMAN: 2,
  FRENCH: 3,
  CHINESE: 5,
  SPANISH: 7,
  SPANISH_LATAM: 9,
  PORTUGUESE: 10,
  RUSSIAN: 11,
  POLISH: 12,
  TURKISH: 13,
};

export const MOMENT = {
  HUMAN_TIME_FORMAT: 'MMMM Do YYYY, h:mm:ss a',
  SMITE_API_FORMAT: 'YYYYMMDDHHmmss',
};

export const PLATFORMS_TO_PORTALS: { [platform: string]: PortalIdKey } = {
  HIREZ: '1',
  STEAM: '5',
  PS4: '9',
  XBOX: '10',
  SWITCH: '22',
  DISCORD: '25',
  EPIC: '28',
};

export const PORTALS_TO_PLATFORMS = _.invert(PLATFORMS_TO_PORTALS);

const constants: SmiteApiConstants = {
  API,
  METHODS,
  QUEUE_IDS,
  LANGS,
  MOMENT,
  PLATFORMS_TO_PORTALS,
  PORTALS_TO_PLATFORMS,
};

export default constants;

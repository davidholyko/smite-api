/**
 * @file
 * Based on endpoints from:
 * https://docs.google.com/document/d/1OFS-3ocSx-1Rvg4afAnEHlT3917MAK_6eJTR6rzr-BM
 */

// @ts-ignore
import https from 'https';
// @ts-ignore
import axios from 'axios';
import _ from 'lodash';
import md5 from 'md5';
import moment, { Moment } from 'moment';
import utf8 from 'utf8';

import CONSTANTS from './constants';
import HELPERS from './helpers';

import type {
  CreatedSessionRecord, //
  HirezServerStatusRecord,
  DataUsedRecord,
  PatchInfoRecord,
  GodRecord,
  AltGodAbilityRecord,
  GodSkinsRecord,
  GodItemRecord,
  MatchDetailsRecord,
  TopMatchesRecord,
  ModeOfTheDayRecord,
  MatchHistoryRecord,
  QueueID,
  QueueStatsRecord,
  PlatformKey,
  PlayerRecord,
  PlayerIdByNameRecord,
  PortalIdKey,
} from './types';

interface SmiteApiConstructorParams {
  auth_key: string | undefined;
  dev_id: string | undefined;
  lang: number;
  response_type: string;
}

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const { API, LANGS, METHODS, MOMENT } = CONSTANTS;
const { BASE_URL, SESSION_ID, DEFAULT_FORMAT } = API;

/**
 * @class
 */
export class SmiteApi {
  session_id: string | undefined;

  session_timestamp: Moment | undefined;

  auth_key: string | undefined;

  dev_id: string | undefined;

  lang: number;

  response_type: string;

  constructor({
    auth_key = '',
    dev_id = '',
    lang = LANGS.ENGLISH,
    response_type = DEFAULT_FORMAT,
  }: Partial<SmiteApiConstructorParams> = {}) {
    // session_id will be set once createSession is invoked
    this.session_id = undefined;
    this.session_timestamp = undefined;

    // these two are required to visit real SmiteApi endpoints
    this.auth_key = auth_key;
    this.dev_id = dev_id;

    // internal state for this class
    this.lang = lang;
    this.response_type = response_type;
  }

  // * *********************************************************************************** * //
  // * ****************************** Assertions and Checks ****************************** * //
  // * *********************************************************************************** * //

  /**
   * throws error if these values do not exist in .env:
   *   * DEV_ID
   *   * AUTH_KEY
   * @returns {void}
   */
  _assertEnvVariables(): void {
    const errors = [];

    if (!this.dev_id) {
      errors.push('DEV_ID cannot be undefined. Please update top level .env file.');
    }

    if (!this.auth_key) {
      errors.push('AUTH_KEY cannot be undefined. Please update top level .env file.');
    }

    if (_.size(errors)) {
      throw new Error(errors.join(' '));
    }
  }

  /**
   * Check session time stamp against current time. If the session is more than
   * 15 minutes old, a new session is required.
   * @returns {Boolean} true if now is more than 15 minputes after than the session timestamp
   */
  _isSessionExpired(): boolean {
    if (!this.session_timestamp) {
      return true;
    }

    if (!this.session_id) {
      return true;
    }

    return moment.utc() > this.session_timestamp;
  }

  // * *********************************************************************************** * //
  // * ****************** Smite API Endpoint Generation and Processing ******************* * //
  // * *********************************************************************************** * //

  /**
   * creates a request url
   * @private
   * @param {String} method - type of method
   * @param {String} signature - signature
   * @param {String} timestamp - timestamp
   * @param {...String} args - extra args
   * @returns {String} - url
   */
  _composeUrl(method: string, signature: string, timestamp: string, ...args: Array<string | number>): string {
    this._assertEnvVariables();

    const urlComponents = _.filter([
      BASE_URL,
      `${method}${this.response_type}`,
      this.dev_id,
      signature,
      !this._isSessionExpired() ? this.session_id : '',
      timestamp,
      ...args,
    ]);

    // regenerates url like
    // `${BASE_URL}/${method}/${dev_id}/${signature}/${session}/${timestamp}/${...args}`
    const url = urlComponents.join('/');

    return url;
  }

  /**
   * generates a timestamp in UTC format
   *
   * @example
   *   * timestamp: '20220328080808'
   *   * format of: 'yyyyMMDDHHmmss'
   *   *             2022 -> 'year'
   *   *                 03 -> 'month (March)'
   *   *                   28 -> 'day (March 28th)'
   *   *                     08 -> 'hour (8am)'
   *   *                       08 -> 'minute (8:08am)'
   *   *                         08 -> 'second (8:08:08am)'
   * @private
   * @returns {String} timestamp
   */
  _generateTimeStamp(): string {
    const timestamp = moment.utc().format(MOMENT.SMITE_API_FORMAT);
    return timestamp;
  }

  /**
   * @private
   * @param {String} method - type of method
   * @returns {String}
   */
  _generateSignature(method: string): string {
    const timestamp = this._generateTimeStamp();
    const text = this.dev_id + method + this.auth_key + timestamp;
    const encodedText = utf8.encode(text);
    const signature = md5(encodedText);
    return signature;
  }

  /**
   * @private
   * @param {String} method - method - like 'createsession' or 'createsessionJson'
   * @param {...String | Number} args - extra args
   * @returns {String} - url
   */
  _generateEndpoint(method: string, ...args: Array<string | number>): string {
    const signature = this._generateSignature(method);
    const timestamp = this._generateTimeStamp();
    const url = this._composeUrl(method, signature, timestamp, ...args);
    return url;
  }

  /**
   * @public
   * @param {String} method - method
   * @param {...String} args - extra args
   * @returns {Object} - data
   */
  async _performRequest<T>(method: string, ...args: Array<string | number>): Promise<T> {
    if (this._isSessionExpired()) {
      // if now is 15 minutes later than the last session
      // that session has expired as we should make a new one
      await this.createSession();
    }

    const url = this._generateEndpoint(method, ...args);
    const data = await this._processRequest<T>(url);
    return data;
  }

  /**
   * processes request url sets the session_id for the client
   * @private
   * @param {String} url - url
   * @returns {Object} - data
   */
  async _processRequest<T>(url: string): Promise<T> {
    let data = undefined;

    try {
      const response = await instance({ method: 'get', url });
      data = response.data;
    } catch (error) {
      const errors = [
        `-----------------------------------------------`,
        error,
        `❌❌❌ Request Failed for ${url}`,
        `❌❌❌ Current   time: ${moment.utc()}`,
        `❌❌❌ Timestamp time: ${this.session_timestamp}`,
      ].join('\n');

      throw new Error(errors);
    }

    return data;
  }

  // * *********************************************************************************** * //
  // * relates to 'APIs - Connectivity, Development, & System Status' section in Smite API * //
  // * *********************************************************************************** * //

  /**
   * /ping[ResponseFormat]
   * {@link} https://api.smitegame.com/smiteapi.svc/pingJson
   * A quick way of validating access to the Hi-Rez API.
   * @returns {String} response
   */
  async ping() {
    const url = `${BASE_URL}/${METHODS.PING}${this.response_type}`;
    const response = await this._processRequest(url);
    return response;
  }

  /**
   * /createsession[ResponseFormat]/{developerId}/{signature}/{timestamp}
   *
   * A required step to Authenticate the developerId/signature for further API use.
   * @public
   * @returns {void}
   */
  async createSession(): Promise<CreatedSessionRecord> {
    const url = this._generateEndpoint(METHODS.CREATE_SESSION);
    const data = await this._processRequest<CreatedSessionRecord>(url);

    // This might not belong here. sets up
    // session id if we are making createsession request
    this.session_id = _.get(data, SESSION_ID);
    this.session_timestamp = moment.utc().add(15, 'minutes');

    return data;
  }

  /**
   * /testsession[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * @example
   *   "This was a successful test with the following parameters added: developer: 1111 time: 10\/29\/2022 6:00:00 AM signature: b5ffabdd900391038ae4f52b68b614cb session: 1E297DDD7998455399F4519A741070C9"
   *
   * A means of validating that a session is established.
   * @public
   * @returns {String} - response message
   */
  async testSession(): Promise<string> {
    const response = await this._performRequest<string>(METHODS.TEST_SESSION);
    return response;
  }

  /**
   * /getdataused[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Returns API Developer daily usage limits and the current status against those limits.
   * @returns {Array<Object>} - data
   */
  async getDataUsed(): Promise<Array<DataUsedRecord>> {
    const response = await this._performRequest<Array<DataUsedRecord>>(METHODS.GET_DATA_USED);
    return response;
  }

  /**
   * /gethirezserverstatus[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Function returns UP/DOWN status for the primary game/platform environments.
   * Data is cached once a minute.
   * @public
   * @returns {Object} - data
   */
  async getHirezServerStatus(): Promise<Array<HirezServerStatusRecord>> {
    const response = await this._performRequest<Array<HirezServerStatusRecord>>(METHODS.GET_HIREZ_SERVER_STATUS);
    return response;
  }

  /**
   * /getpatchinfo[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Function returns information about current deployed patch. Currently, this information only includes patch version.
   * @public
   * @returns {Object} - data
   */
  async getPatchInfo(): Promise<PatchInfoRecord> {
    const response = await this._performRequest<PatchInfoRecord>(METHODS.GET_PATCH_INFO);
    return response;
  }

  // * ************************************************************************** * //
  // * ***** relates to 'APIs - Gods/Champions & Items' section in Smite API **** * //
  // * ************************************************************************** * //

  /**
   * /getgods[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{languageCode}
   *
   * Returns all Gods and their various attributes.
   * @public
   * @returns {Object} - data
   */
  async getGods(): Promise<Array<GodRecord>> {
    const response = await this._performRequest<Array<GodRecord>>(METHODS.GET_GODS, this.lang);
    return response;
  }

  /**
   * /getgodleaderboard[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{godId}/{queue}
   *
   * Returns the current season’s leaderboard for a god/queue combination.
   * [SmiteApi; only queues 440, 450, 451]
   * @returns {void}
   */
  async getGodLeaderBoard() {
    // TODO: fill in
    return;
  }

  /**
   * /getgodaltabilities[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Returns alt abilities for all gods.
   * [SmiteApi only]
   * @public
   * @returns {Object} - data
   */
  async getGodAltAbilities(): Promise<Array<AltGodAbilityRecord>> {
    const response = await this._performRequest<Array<AltGodAbilityRecord>>(METHODS.GET_GOD_ALT_ABILTIES);
    return response;
  }

  /**
   * /getgodskins[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{godId}/{languageCode}
   *
   * Returns all available skins for a particular God.
   * @public
   * @returns {Object} - data
   */
  async getGodSkins(godId: number): Promise<Array<GodSkinsRecord>> {
    const response = await this._performRequest<Array<GodSkinsRecord>>(METHODS.GET_GOD_SKINS, godId, this.lang);
    return response;
  }

  /**
   * /getgodrecommendeditems[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{godid}/{languageCode}
   *
   * Returns the Recommended Items for a particular God.
   * [SmiteApi only]
   * @returns {void}
   */
  async getGodRecommendedItems() {
    // TODO: fill in
    return;
  }

  /**
   * /getitems[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{languagecode}
   *
   * Returns all Items and their various attributes on the current patch
   * @returns {Array<Object>} - data
   */
  async getItems(): Promise<Array<GodItemRecord>> {
    const response = await this._performRequest<Array<GodItemRecord>>(METHODS.GET_ITEMS, this.lang);
    return response;
  }

  // * ****************************************************************** * //
  // * relates to 'APIs - Leagues, Seasons & Rounds' section in Smite API * //
  // * ****************************************************************** * //

  /**
   *
   * get leagueleaderboard[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{queue}/{tier}/{round}
   *
   * Returns the top players for a particular league (as indicated by the queue/tier/round parameters).
   * Note: the “Season” for which the Round is associated is by default the current/active Season.
   * @returns {void}
   */
  async getLeagueLeaderBoard() {
    // TODO: fill in
    return;
  }

  /**
   *
   * /getleagueseasons[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{queue}
   *
   * Provides a list of seasons and rounds (including the single active season) for a match queue
   * @returns {void}
   */
  async getLeagueSeasons() {
    // TODO: fill in
    return;
  }

  // * *************************************************** *//
  // * relates to 'APIs - Match Info' section in Smite API *//
  // * *************************************************** *//

  /**
   * /getmatchdetails[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{match_id}
   *
   * Returns the statistics for a particular completed match.
   * * if a match if very old (more than ~50 games ago), the match might not actually be available in the Smite API anymore
   * @public
   * @param {String} matchId - match id like '1229914631'
   * @returns {Array<Object>} - match details
   */
  async getMatchDetails(matchId: number): Promise<Array<MatchDetailsRecord>> {
    const response = await this._performRequest<Array<MatchDetailsRecord>>(METHODS.GET_MATCH_DETAILS, matchId);
    return response;
  }

  /**
   * /getmatchdetailsbatch[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{match_id,match_id,match_id,...match_id}
   *
   * Returns the statistics for a particular set of completed matches.
   * NOTE:  There is a byte limit to the amount of data returned; please limit the CSV parameter to 5 to 10 matches because of this and for Hi-Rez DB Performance reasons.
   * @returns {void}
   */
  async getMatchDetailsBatch() {
    // TODO: fill in
    return;
  }

  /**
   * /getmatchidsbyqueue[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{queue}/{date}/{hour}
   *
   * Lists all Match IDs for a particular Match Queue; useful for API developers interested in constructing data by Queue.
   * To limit the data returned, an {hour} parameter was added (valid values: 0 - 23).
   * An {hour} parameter of -1 represents the entire day, but be warned that this may be more data than we can return for certain queues.
   * Also, a returned “active_flag” means that there is no match information/stats for the corresponding match.
   * Usually due to a match being in-progress, though there could be other reasons.
   * NOTE - To avoid HTTP timeouts in the GetMatchIdsByQueue() method, you can now specify a 10-minute window within the specified {hour} field to lessen the size of data returned by appending a “,mm” value to the end of {hour}. For example, to get the match Ids for the first 10 minutes of hour 3, you would specify {hour} as “3,00”.
   * This would only return the Ids between the time 3:00 to 3:09.
   * Rules below:
   *  * Only valid values for mm are “00”, “10”, “20”, “30”, “40”, “50”
   *  * To get the entire third hour worth of Match Ids, call GetMatchIdsByQueue() 6 times, specifying the following values for {hour}: “3,00”, “3,10”, “3,20”, “3,30”, “3,40”, “3,50”.
   *  * The standard, full hour format of {hour} = “hh” is still supported.
   * @returns {void}
   */
  async getMatchIdsByQueue(queue: string, date: string, hour: string) {
    // TODO: fill in
    const response = await this._performRequest<any>(METHODS.GET_MATCH_IDS_BY_QUEUE, queue, date, hour);
    return response;
  }

  /**
   * /getmatchplayerdetails[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{match_id}
   *
   * Returns player information for a live match.
   * @returns {void}
   */
  async getMatchPlayerDetails(matchId: string) {
    // TODO: fill in
    const response = await this._performRequest<any>(METHODS.GET_MATCH_PLAYER_DETAILS, matchId);
    return response;
  }

  /**
   * /gettopmatches[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Lists the 50 most watched / most recent recorded matches.
   * @returns {void}
   */
  async getTopMatches(): Promise<Array<TopMatchesRecord>> {
    const response = await this._performRequest<Array<TopMatchesRecord>>(METHODS.GET_TOP_MATCHES);
    return response;
  }

  // * ********************************************** * //
  // * relates to 'APIs - Other' section in Smite API * //
  // * ********************************************** * //

  /**
   * /getesportsproleaguedetails[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Returns the matchup information for each matchup for the current eSports Pro League season.
   * An important return value is “match_status” which represents a match being scheduled (1), in-progress (2), or complete (3)
   * @returns {void}
   */
  async getEsportsProLeagueDetails() {
    // TODO: fill in
    return;
  }

  /**
   * /getmotd[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
   *
   * Returns information about the 20 most recent Match-of-the-Days.
   * @returns {void}
   */
  async getMOTD(): Promise<Array<ModeOfTheDayRecord>> {
    const response = await this._performRequest<Array<ModeOfTheDayRecord>>(METHODS.GET_MOTD);
    return response;
  }

  // * ****************************************************** * //
  // * relates to 'APIs - PlayerId Info' section in Smite API * //
  // * ****************************************************** * //

  /**
   * /getfriends[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}
   *
   * Returns the Smite User names of each of the player’s friends.
   * [PC only]
   * @returns {void}
   */
  async getFriends() {
    // TODO: fill in
    return;
  }

  /**
   * /getgodranks[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}
   *
   * Returns the Rank and Worshippers value for each God a player has played.
   * @returns {void}
   */
  async getGodRanks() {
    // TODO: fill in
    return;
  }

  /**
   * /getplayerachievements[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}
   *
   * Returns select achievement totals (Double kills, Tower Kills, First Bloods, etc) for the specified playerId.
   * @returns {void}
   */
  async getPlayerAchievements() {
    // TODO: fill in
    return;
  }

  /**
   * /getplayerstatus[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}
   *
   * Returns player status as follows:
   *  * 0 - Offline
   *  * 1 - In Lobby  (basically anywhere except god selection or in game)
   *  * 2 - god Selection (player has accepted match and is selecting god before start of game)
   *  *	3 - In Game (match has started)
   *  * 4 - Online (player is logged in, but may be blocking broadcast of player state)
   *  * 5 - Unknown (player not found)
   * @returns {void}
   */
  async getPlayerStatus() {
    // TODO: fill in
    return;
  }

  /**
   * /getmatchhistory[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}
   *
   * Gets recent matches and high level match statistics for a particular player
   * @public
   * @param {String} playerId - account name for player, like 'dhko'
   * @returns {Array<Object>} - data of last 50 matches
   */
  async getMatchHistory(playerId: string): Promise<Array<MatchHistoryRecord>> {
    const response = await this._performRequest<Array<MatchHistoryRecord>>(
      METHODS.GET_MATCH_HISTORY,
      encodeURI(playerId),
    );
    return response;
  }

  /**
   * /getqueuestats[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}/{queue}
   *
   * Returns match summary statistics for a (player, queue) combination grouped by gods played.
   * @public
   * @param {String} playerId - account name for player, like 'dhko'
   * @param {string} queueId - queueId, see constants
   * @returns {Array<Object>} - data
   */
  async getQueueStats(playerId: string, queueId: QueueID): Promise<Array<QueueStatsRecord>> {
    const response = await this._performRequest<Array<QueueStatsRecord>>(
      METHODS.GET_QUEUE_STATS,
      encodeURI(playerId),
      queueId,
    );
    return response;
  }

  /**
   * /searchplayers[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{searchPlayer}
   * Returns player_id values for all names and/or gamer_tags containing the “searchPlayer” string.
   * @returns {void}
   */
  async searchPlayers() {
    // TODO: fill in
    return;
  }

  // * ************************************************************ * //
  // * relates to 'APIs - Players & PlayerIds' section in Smite API * //
  // * ************************************************************ * //

  /**
   * /getplayer[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{player}/{portalId}
   *
   * Returns league and other high level data for a particular player.
   * @public
   * @param {String} playerId - account name for player, like 'dhko' or playerNumber like '4553282'
   * @param {String} platform - like 'XBOX' or 'PS4'
   * @returns {Object} - data
   */
  async getPlayer(
    playerId: string,
    { platform, portalId }: { platform?: PlatformKey; portalId?: string } = {},
  ): Promise<Array<PlayerRecord>> {
    if (platform) {
      portalId = HELPERS.parsePortalId(platform);
    }
    // optionally apply portalId if passed in
    // and get rid of keys with falsy values
    const args = _.pickBy({ playerId: encodeURI(playerId), portalId }, _.identity);
    // @ts-ignore
    const response = await this._performRequest<Array<PlayerRecord>>(METHODS.GET_PLAYER, ..._.values(args));
    return response;
  }

  /**
   * /getplayeridbyname[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerName}
   *
   * Function returns a list of Hi-Rez playerId values (expected list size = 1) for playerName provided.
   * The playerId returned is expected to be used in various other endpoints to represent the player/individual regardless of platform.
   * @public
   * @param {String} playerId - account name for player, like 'dhko' or playerNumber like '4553282'
   * @returns {Object} - data
   */
  async getPlayerIdByName(playerId: string): Promise<Array<PlayerIdByNameRecord>> {
    const response = await this._performRequest<Array<PlayerIdByNameRecord>>(METHODS.GET_PLAYERID_BY_NAME, playerId);
    return response;
  }

  /**
   * /getplayeridbyportaluserid[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{portalId}/{portalUserId}
   *
   * Function returns a list of Hi-Rez playerId values (expected list size = 1) for {portalId}/{portalUserId} combination provided.
   * The playerId returned is expected to be used in various other endpoints to represent the player/individual regardless of platform.
   * @returns {void}
   */
  async getPlayerIdByPortalUserId() {
    // TODO: fill in
    return;
  }

  /**
   * /getplayeridsbygamertag[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{portalId}/{gamerTag}
   *
   * Function returns a list of Hi-Rez playerId values for {portalId}/{portalUserId} combination provided.
   * The appropriate playerId extracted from this list by the API end user is expected to be used in various other endpoints to represent the player/individual regardless of platform.
   * @public
   * @param {String} playerId - account name for player, like 'dhko' or playerNumber like '4553282'
   * @param {String} platform - like 'XBOX' or 'PS4'
   * @returns {Array<Object>} - data { player_id, portal, portal_id, privacy_flag, ret_msg }
   */
  async getPlayerIdsByGamerTag(
    playerId: string,
    { platform, portalId }: { platform?: PlatformKey; portalId?: PortalIdKey },
  ) {
    if (platform) {
      portalId = HELPERS.parsePortalId(platform);
    }

    if (!portalId) {
      throw new Error(`SmiteApi.getPlayerIdsByGamerTag: portalId not found for ${platform}`);
    }

    const response = await this._performRequest(METHODS.GET_PLAYERIDS_BY_GAMER_TAG, portalId, playerId);

    return response;
  }

  // * *************************************************** * //
  // * relates to 'APIs - Team Info' section in Smite API * //
  // * ************************************************** * //

  /**
   * /getteamdetails[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{clanid}
   *
   * Lists the number of players and other high level details for a particular clan.
   * @returns {void}
   */
  async getTeamDetails() {
    // TODO: fill in
    return;
  }

  /**
   * /getteamplayers[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{clanid}
   *
   * Lists the players for a particular clan.
   * @returns {void}
   */
  async getTeamPlayers() {
    // TODO: fill in
    return;
  }

  /**
   * /searchteams[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{searchTeam}
   *
   * Returns high level information for Clan names containing the “searchTeam” string.
   * [SmiteApi only]
   * @returns {void}
   */
  async searchTeams() {
    // TODO: fill in
    return;
  }
}

export default SmiteApi;

export interface SmiteApiConstructorParams {
  auth_key: string | undefined;
  dev_id: string | undefined;
  lang: number;
  response_type: string;
}

export interface SmiteApiConstants {
  [key: string]: ConstantsValue;
  API: {
    BASE_URL: string;
    RESPONSE_FORMAT: string;
    DEFAULT_FORMAT: string;
    SESSION_ID: string;
  };
  LANGS: {
    [language: string]: number;
  };
  MOMENT: {
    [timeformat: string]: string;
  };
  METHODS: {
    [methodname: string]: string;
  };
}

export interface ConstantsValue {
  [key: string | number]: string | number | undefined;
}

export type PlatformKey = 'HIREZ' | 'STEAM' | 'PS4' | 'XBOX' | 'SWITCH' | 'DISCORD' | 'EPIC';

export type PortalIdKey = '1' | '5' | '9' | '10' | '22' | '25' | '28';

// TODO: fill out the rest
export type QueueID =
  | '426' // Conquest
  | '435' // Arena Queue
  | '448' // Joust Queue 3v3
  | '445' // Assault
  | '10189' // Slash
  | '434' // MOTD
  | '10195' // Under 30 Arena
  | '504' // Conquest Ranked Controller
  | '451' // Conquest Ranked
  | '10193' // Under 30 Conquest
  | '10197' // Under 30 Joust
  | '503' // Joust 3v3 Ranked Controller
  | '468' // Arena (vs AI) Medium
  | '441' // Joust Challenge
  | '462' // Arena Tutorial
  | '450' // Joust 3v3 Ranked
  | '456' // Joust (vs AI) (Medium)
  | '461' // Conquest (vs AI) (Medium)
  | '10190' // Duel Custom
  | '10152' // S7 Joust Custom
  | '502' // Joust Ranked (1v1) Controller
  | '440'; // Joust Ranked (1v1)

/* Smite API */

export interface MatchHistoryRecord {
  ActiveId1: number;
  ActiveId2: number;
  Active_1: string;
  Active_2: string;
  Active_3: null;
  Assists: number;
  Ban1: string;
  Ban10: string;
  Ban10Id: number;
  Ban11: string;
  Ban11Id: number;
  Ban12: string;
  Ban12Id: number;
  Ban1Id: number;
  Ban2: string;
  Ban2Id: number;
  Ban3: string;
  Ban3Id: number;
  Ban4: string;
  Ban4Id: number;
  Ban5: string;
  Ban5Id: number;
  Ban6: string;
  Ban6Id: number;
  Ban7: string;
  Ban7Id: number;
  Ban8: string;
  Ban8Id: number;
  Ban9: string;
  Ban9Id: number;
  Creeps: number;
  Damage: number;
  Damage_Bot: number;
  Damage_Done_In_Hand: number;
  Damage_Mitigated: number;
  Damage_Structure: number;
  Damage_Taken: number;
  Damage_Taken_Magical: number;
  Damage_Taken_Physical: number;
  Deaths: number;
  Distance_Traveled: number;
  First_Ban_Side: string;
  God: string;
  GodId: number;
  Gold: number;
  Healing: number;
  Healing_Bot: number;
  Healing_Player_Self: number;
  ItemId1: number;
  ItemId2: number;
  ItemId3: number;
  ItemId4: number;
  ItemId5: number;
  ItemId6: number;
  Item_1: string;
  Item_2: string;
  Item_3: string;
  Item_4: string;
  Item_5: string;
  Item_6: string;
  Killing_Spree: number;
  Kills: number;
  Level: number;
  Map_Game: string;
  Match: number;
  Match_Queue_Id: number;
  Match_Time: string;
  Minutes: number;
  Multi_kill_Max: number;
  Objective_Assists: number;
  Queue: string;
  Region: string;
  Role: string;
  Skin: string;
  SkinId: number;
  Surrendered: number;
  TaskForce: 1;
  Team1Score: number;
  Team2Score: number;
  Time_In_Match_Seconds: number;
  Wards_Placed: number;
  Win_Status: 'Win' | 'Loss';
  Winning_TaskForce: number;
  playerId: number;
  playerName: string;
  ret_msg: null | string;
}

export interface DataUsedRecord {
  Active_Sessions: number;
  Concurrent_Sessions: number;
  Request_Limit_Daily: number;
  Session_Cap: number;
  Session_Time_Limit: number;
  Total_Requests_Today: number;
  Total_Sessions_Today: number;
  ret_msg: string | null;
}

export interface GodAbilityDescription {
  Description: {
    itemDescription: {
      cooldown: string;
      cost: string;
      description: string;
      menuitems: Array<{ description: string; value: string }>;
      rankitems: Array<{ description: string; value: string }>;
    };
  };
  Id: number;
  Summary: string;
  URL: string;
}

export interface GodRecord {
  Ability1: string;
  Ability2: string;
  Ability3: string;
  Ability4: string;
  Ability5: string;
  AbilityId1: number;
  AbilityId2: number;
  AbilityId3: number;
  AbilityId4: number;
  AbilityId5: number;
  Ability_1: GodAbilityDescription;
  Ability_2: GodAbilityDescription;
  Ability_3: GodAbilityDescription;
  Ability_4: GodAbilityDescription;
  Ability_5: GodAbilityDescription;
  AttackSpeed: number;
  AttackSpeedPerLevel: number;
  AutoBanned: string;
  Cons: string;
  HP5PerLevel: number;
  Health: number;
  HealthPerFive: number;
  HealthPerLevel: number;
  Lore: string;
  MP5PerLevel: number;
  MagicProtection: number;
  MagicProtectionPerLevel: number;
  MagicalPower: number;
  MagicalPowerPerLevel: number;
  Mana: number;
  ManaPerFive: number;
  ManaPerLevel: number;
  Name: string;
  OnFreeRotation: string;
  Pantheon: string;
  PhysicalPower: number;
  PhysicalPowerPerLevel: number;
  PhysicalProtection: number;
  PhysicalProtectionPerLevel: number;
  Pros: string;
  Roles: string;
  Speed: number;
  Title: string;
  Type: string;
  abilityDescription1: GodAbilityDescription;
  abilityDescription2: GodAbilityDescription;
  abilityDescription3: GodAbilityDescription;
  abilityDescription4: GodAbilityDescription;
  abilityDescription5: GodAbilityDescription;
  basicAttack: GodAbilityDescription;
  godAbility1_URL: string;
  godAbility2_URL: string;
  godAbility3_URL: string;
  godAbility4_URL: string;
  godAbility5_URL: string;
  godCard_URL: string;
  godIcon_URL: string;
  id: number;
  latestGod: string;
  ret_msg: string | null;
}

export interface MatchDetailsRecord {
  Account_Level: number;
  ActiveId1: number;
  ActiveId2: number;
  ActiveId3: number;
  ActiveId4: number;
  ActivePlayerId: string;
  Assists: number;
  Ban1: string;
  Ban10: string;
  Ban10Id: number;
  Ban11: string;
  Ban11Id: number;
  Ban12: string;
  Ban12Id: number;
  Ban1Id: number;
  Ban2: string;
  Ban2Id: number;
  Ban3: string;
  Ban3Id: number;
  Ban4: string;
  Ban4Id: number;
  Ban5: string;
  Ban5Id: number;
  Ban6: string;
  Ban6Id: number;
  Ban7: string;
  Ban7Id: number;
  Ban8: string;
  Ban8Id: number;
  Ban9: string;
  Ban9Id: number;
  Camps_Cleared: number;
  Conquest_Losses: number;
  Conquest_Points: number;
  Conquest_Tier: number;
  Conquest_Wins: number;
  Damage_Bot: number;
  Damage_Done_In_Hand: number;
  Damage_Done_Magical: number;
  Damage_Done_Physical: number;
  Damage_Mitigated: number;
  Damage_Player: number;
  Damage_Taken: number;
  Damage_Taken_Magical: number;
  Damage_Taken_Physical: number;
  Deaths: number;
  Distance_Traveled: number;
  Duel_Losses: number;
  Duel_Points: number;
  Duel_Tier: number;
  Duel_Wins: number;
  Entry_Datetime: string;
  Final_Match_Level: number;
  First_Ban_Side: string;
  GodId: number;
  Gold_Earned: number;
  Gold_Per_Minute: number;
  Healing: number;
  Healing_Bot: number;
  Healing_Player_Self: number;
  ItemId1: number;
  ItemId2: number;
  ItemId3: number;
  ItemId4: number;
  ItemId5: number;
  ItemId6: number;
  Item_Active_1: string;
  Item_Active_2: string;
  Item_Active_3: string;
  Item_Active_4: string;
  Item_Purch_1: string;
  Item_Purch_2: string;
  Item_Purch_3: string;
  Item_Purch_4: string;
  Item_Purch_5: string;
  Item_Purch_6: string;
  Joust_Losses: number;
  Joust_Points: number;
  Joust_Tier: number;
  Joust_Wins: number;
  Killing_Spree: number;
  Kills_Bot: number;
  Kills_Double: number;
  Kills_Fire_Giant: number;
  Kills_First_Blood: number;
  Kills_Gold_Fury: number;
  Kills_Penta: number;
  Kills_Phoenix: number;
  Kills_Player: number;
  Kills_Quadra: number;
  Kills_Siege_Juggernaut: number;
  Kills_Single: number;
  Kills_Triple: number;
  Kills_Wild_Juggernaut: number;
  Map_Game: string;
  Mastery_Level: number;
  Match: number;
  Match_Duration: number;
  MergedPlayers: string | null;
  Minutes: number;
  Multi_kill_Max: number;
  Objective_Assists: number;
  PartyId: number;
  Rank_Stat_Conquest: number;
  Rank_Stat_Duel: number;
  Rank_Stat_Joust: number;
  Reference_Name: string;
  Region: string;
  Role: string;
  Skin: string;
  SkinId: number;
  Structure_Damage: number;
  Surrendered: number;
  TaskForce: number;
  Team1Score: number;
  Team2Score: number;
  TeamId: number;
  Team_Name: string;
  Time_Dead_Seconds: number;
  Time_In_Match_Seconds: number;
  Towers_Destroyed: number;
  Wards_Placed: number;
  Win_Status: 'Winner' | 'Loser';
  Winning_TaskForce: number;
  hasReplay: 'y' | 'n';
  hz_gamer_tag: string;
  hz_player_name: null;
  match_queue_id: number;
  name: string;
  playerId: string;
  playerName: string;
  playerPortalId: string;
  playerPortalUserId: string;
  ret_msg: string | null;
}

export interface PatchInfoRecord {
  ret_msg: string | null;
  version_string: string;
}

export interface AltGodAbilityRecord {
  alt_name: string;
  alt_position: string;
  god: string;
  god_id: number;
  item_id: number;
  ret_msg: string | null;
}

export interface GodItemRecord {
  ActiveFlag: 'y' | 'n';
  ChildItemId: string;
  DeviceName: string;
  Glyph: 'y' | 'n';
  IconId: number;
  ItemDescription: {
    Description: string;
    Menuitems: Array<{ Description: string; Value: string }>;
    SecondaryDescription: string | null;
  };
  ItemId: number;
  ItemTier: number;
  Price: number;
  RestrictedRoles: number;
  RootItemId: number;
  ShortDesc: number;
  StartingItem: boolean;
  Type: number;
  itemIcon_URL: number;
  ret_msg: string | null;
}

export interface RankedQueueStats {
  Leaves: number;
  Losses: number;
  Name: string;
  Points: number;
  PrevRank: number;
  Rank: number;
  Rank_Stat: number;
  Rank_Stat_Conquest: string | null;
  Rank_Stat_Joust: string | null;
  Rank_Variance: number;
  Round: number;
  Season: number;
  Tier: number;
  Trend: number;
  Wins: number;
  player_id: string | null;
  ret_msg: string | null;
}

export interface PlayerRecord {
  ActivePlayerId: number;
  Avatar_URL: string;
  Created_Datetime: string;
  HoursPlayed: number;
  Id: number;
  Last_Login_Datetime: string;
  Leaves: number;
  Level: number;
  Losses: number;
  MasteryLevel: number;
  MergedPlayers: string | null;
  MinutesPlayed: number;
  Name: string;
  Personal_Status_Message: string;
  Platform: string;
  Rank_Stat_Conquest: number;
  Rank_Stat_Conquest_Controller: number;
  Rank_Stat_Duel: number;
  Rank_Stat_Duel_Controller: number;
  Rank_Stat_Joust: number;
  Rank_Stat_Joust_Controller: number;
  RankedConquest: RankedQueueStats;
  RankedConquestController: RankedQueueStats;
  RankedDuel: RankedQueueStats;
  RankedDuelController: RankedQueueStats;
  RankedJoust: RankedQueueStats;
  RankedJoustController: RankedQueueStats;
  Region: string;
  TeamId: number;
  Team_Name: string;
  Tier_Conquest: number;
  Tier_Duel: number;
  Tier_Joust: number;
  Total_Achievements: number;
  Total_Worshippers: number;
  Wins: number;
  hz_gamer_tag: string | null;
  hz_player_name: string;
  ret_msg: string | null;
}

export interface HirezServerStatusRecord {
  entry_datetime: string;
  environment: string;
  limited_access: boolean;
  platform: string;
  ret_msg: string | null;
  status: string;
  version: string;
}

export interface GodSkinsRecord {
  godIcon_URL: string;
  godSkin_URL: string;
  god_id: number;
  god_name: string;
  obtainability: string;
  price_favor: number;
  price_gems: number;
  ret_msg: string | null;
  skin_id1: number;
  skin_id2: number;
  skin_name: string;
}

export interface CreatedSessionRecord {
  ret_msg: 'Approved' | 'Invalid Signature';
  session_id: string;
  timestamp: string;
}

export interface TopMatchesRecord {
  Ban1: string;
  Ban1Id: number;
  Ban2: string;
  Ban2Id: number;
  Entry_Datetime: string;
  LiveSpectators: number;
  Match: number;
  Match_Time: number;
  OfflineSpectators: number;
  Queue: string;
  RecordingFinished: string;
  RecordingStarted: string;
  Team1_AvgLevel: number;
  Team1_Gold: number;
  Team1_Kills: number;
  Team1_Score: number;
  Team2_AvgLevel: number;
  Team2_Gold: number;
  Team2_Kills: number;
  Team2_Score: number;
  WinningTeam: number;
  ret_msg: string | null;
}

export interface ModeOfTheDayRecord {
  description: string;
  gameMode: string;
  maxPlayers: string;
  name: string;
  ret_msg: string | null;
  startDateTime: string;
  team1GodsCSV: string;
  team2GodsCSV: string;
  title: string;
}

export interface QueueStatsRecord {
  Assists: number;
  Deaths: number;
  God: string;
  GodId: number;
  Gold: number;
  Kills: number;
  LastPlayed: string;
  Losses: number;
  Matches: number;
  Minutes: number;
  Queue: string;
  Wins: number;
  player_id: string;
  ret_msg: string | null;
}

export interface PlayerIdByNameRecord {
  player_id: number;
  portal: string;
  portal_id: string;
  privacy_flag: 'y' | 'n';
  ret_msg: string | null;
}

export declare module 'smite-api';

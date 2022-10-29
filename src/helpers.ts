import _ from 'lodash';

import { PLATFORMS_TO_PORTALS } from './constants';
import type { PlatformKey, PortalIdKey } from './types';

/**
 *
 * @param {String} platform - like 'HIREZ'
 * @returns {String} portalId
 */
export const parsePortalId = (platform: PlatformKey): PortalIdKey => {
  const portalId = PLATFORMS_TO_PORTALS[platform];

  if (!portalId) {
    throw new Error(`SmiteApi: portalId for ${portalId} is not supported`);
  }

  return portalId;
};

export default {
  parsePortalId, //
};

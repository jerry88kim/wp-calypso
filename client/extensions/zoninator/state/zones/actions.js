/**
 * Internal dependencies
 */
import {
	ZONINATOR_REQUEST_ZONES,
	ZONINATOR_REQUEST_ERROR,
	ZONINATOR_UPDATE_ZONES,
	ZONINATOR_ADD_ZONE,
	ZONINATOR_UPDATE_ZONE,
} from '../action-types';

export const requestZones = siteId => ( { type: ZONINATOR_REQUEST_ZONES, siteId } );

export const requestError = siteId => ( { type: ZONINATOR_REQUEST_ERROR, siteId } );

export const updateZones = ( siteId, data ) => ( { type: ZONINATOR_UPDATE_ZONES, siteId, data } );

/**
 * Returns an action object to indicate that a zone should be updated.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} data   Zone details
 * @return {Object}        Action object
 */
export const updateZone = ( siteId, data ) => ( { type: ZONINATOR_UPDATE_ZONE, siteId, data } );

/**
 * Returns an action object to indicate that a new zone should be created.
 *
 * @param  {Number} siteId Site ID
 * @param  {String} form   Form name
 * @param  {Object} data   Zone details
 * @return {Object}        Action object
 */
export const addZone = ( siteId, form, data ) => ( { type: ZONINATOR_ADD_ZONE, siteId, form, data } );

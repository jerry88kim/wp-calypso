/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';
import {
	startSubmit as startSave,
	stopSubmit as stopSave,
} from 'redux-form';

/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { errorNotice, removeNotice, successNotice } from 'state/notices/actions';
import { toApi } from './util';
import { addZone, requestError, updateZone, updateZones } from '../../zones/actions';
import { ZONINATOR_REQUEST_ZONES, ZONINATOR_ADD_ZONE } from 'zoninator/state/action-types';

export const requestZonesList = ( { dispatch }, action ) => {
	const { siteId } = action;

	dispatch( http( {
		method: 'GET',
		path: `/jetpack-blogs/${ siteId }/rest-api/`,
		query: {
			path: '/zoninator/v1/zones',
		},
	}, action ) );
};

export const requestZonesError = ( { dispatch }, { siteId } ) =>
	dispatch( requestError( siteId ) );

export const updateZonesList = ( { dispatch }, { siteId }, next, { data } ) =>
	dispatch( updateZones( siteId, data ) );

export const createZone = ( { dispatch, getState }, action ) => {
	const { data, form, siteId } = action;

	dispatch( startSave( form ) );
	dispatch( removeNotice( 'zoninator-zone-create' ) );
	dispatch( http( {
		method: 'POST',
		path: `/jetpack-blogs/${ siteId }/rest-api/`,
		query: {
			body: JSON.stringify( toApi( data ) ),
			json: true,
			path: '/zoninator/v1/zones',
		},
	}, action ) );
};

export const announceSuccess = ( { dispatch }, { data, form, siteId } ) => {
	dispatch( stopSave( form ) );
	dispatch( updateZone( siteId, data ) );
	dispatch( successNotice(
		translate( 'Zone saved!' ),
		{ id: 'zoninator-zone-create' },
	) );
};

export const announceFailure = ( { dispatch }, { form } ) => {
	dispatch( stopSave( form ) );
	dispatch( errorNotice(
		translate( 'There was a problem saving the zone. Please try again.' ),
		{ id: 'zoninator-zone-create' },
	) );
};

const dispatchFetchZonesRequest = dispatchRequest( requestZonesList, updateZonesList, requestZonesError );
const dispatchAddZoneRequest = dispatchRequest( addZone, announceSuccess, announceFailure );

export default {
	[ ZONINATOR_REQUEST_ZONES ]: [ dispatchFetchZonesRequest ],
	[ ZONINATOR_ADD_ZONE ]: [ dispatchAddZoneRequest ],
};

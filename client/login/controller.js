/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import WPLogin from './wp-login';
import MagicLogin from './magic-login';
import HandleEmailedLinkForm from './magic-login/handle-emailed-link-form';
import { setOauthClient } from 'state/login/actions';

export default {
	login( context, next ) {
		const {
			lang,
			path,
			params: { flow, twoFactorAuthType },
			query: { client_id: clientId }
		} = context;

		if ( clientId ) {
			context.store.dispatch( setOauthClient( Number( clientId ) ) );
		}

		context.primary = (
			<WPLogin
				locale={ lang }
				path={ path }
				twoFactorAuthType={ twoFactorAuthType }
				socialConnect={ flow === 'social-connect' }
				privateSite={ flow === 'private-site' } />
		);

		next();
	},

	magicLogin( context, next ) {
		context.primary = <MagicLogin />;
		next();
	},

	magicLoginUse( context, next ) {
		const {
			// TODO: Check what is this `client_id` parameter exactly
			client_id,
			email,
			token,
			tt,
		} = context.query;

		context.primary = (
			<HandleEmailedLinkForm
				clientId={ client_id }
				emailAddress={ email }
				token={ token }
				tokenTime={ tt }
			/>
		);

		next();
	},
};

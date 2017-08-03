/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, find } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getRequestError,
	getTwoFactorAuthRequestError,
	getCreateSocialAccountErrors,
	getRequestSocialAccountError,
} from 'state/login/selectors';
import Notice from 'components/notice';

class ErrorNotice extends Component {
	static propTypes = {
		createAccountErrors: PropTypes.array,
		requestAccountError: PropTypes.object,
		requestError: PropTypes.object,
		twoFactorAuthRequestError: PropTypes.object,
	};

	componentWillReceiveProps = ( nextProps ) => {
		const receiveNewError = ( key ) => {
			return this.props[ key ] !== nextProps[ key ];
		};

		if (
			receiveNewError( 'createAccountErrors' ) ||
			receiveNewError( 'requestAccountError' ) ||
			receiveNewError( 'requestError' ) ||
			receiveNewError( 'twoFactorAuthRequestError' )
		) {
			window.scrollTo( 0, 0 );
		}
	};

	getLastCreateAccountError() {
		const { createAccountErrors } = this.props;

		if ( ! createAccountErrors ) {
			return null;
		}

		return get(
			find( createAccountErrors, createAccountError => createAccountError.error.code !== 'unknown_user' ),
			'error'
		);
	}

	getError() {
		const { requestAccountError, requestError, twoFactorAuthRequestError } = this.props;

		return requestError || twoFactorAuthRequestError || requestAccountError || this.getLastCreateAccountError();
	}

	render() {
		const error = this.getError();

		if ( ! error || ( error.field && error.field !== 'global' ) || ! error.message ) {
			return null;
		}

		/*
		 * The user_exists error is caught in SocialLoginForm.
		 * The relevant messages are displayed inline in LoginForm.
		*/
		if ( error.code === 'user_exists' ) {
			return null;
		}

		return (
			<Notice status={ 'is-error' } showDismiss={ false }>
				{ error.message }
			</Notice>
		);
	}
}

export default connect(
	( state ) => ( {
		createAccountErrors: getCreateSocialAccountErrors( state ),
		requestAccountError: getRequestSocialAccountError( state ),
		requestError: getRequestError( state ),
		twoFactorAuthRequestError: getTwoFactorAuthRequestError( state ),
	} )
)( ErrorNotice );

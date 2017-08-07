/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import {
	identity,
	includes,
	noop,
	pull,
	find,
} from 'lodash';
import Gridicon from 'gridicons';
import SocialLogo from 'social-logos';

/**
 * Internal dependencies
 */
import SectionNav from 'components/section-nav';
import SectionNavTabs from 'components/section-nav/tabs';
import Search from 'components/search';
import TrackComponentView from 'lib/analytics/track-component-view';
import PlanStorage from 'blocks/plan-storage';
import FilterItem from './filter-item';
import Button from 'components/button';
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';

export class MediaLibraryFilterBar extends Component {
	static propTypes = {
		basePath: React.PropTypes.string,
		enabledFilters: React.PropTypes.arrayOf( React.PropTypes.string ),
		filter: React.PropTypes.string,
		filterRequiresUpgrade: React.PropTypes.bool,
		search: React.PropTypes.string,
		source: React.PropTypes.string,
		site: React.PropTypes.object,
		onFilterChange: React.PropTypes.func,
		onSourceChange: React.PropTypes.func,
		onSearch: React.PropTypes.func,
		translate: React.PropTypes.func,
		post: React.PropTypes.bool
	};

	static defaultProps ={
		filter: '',
		basePath: '/media',
		onFilterChange: noop,
		onSourceChange: noop,
		onSearch: noop,
		translate: identity,
		source: '',
		post: false
	};

	getSearchPlaceholderText() {
		const { filter, translate, source } = this.props;

		if ( source === 'google_photos' ) {
			return translate( 'Smart search for places, things, dates…' );
		}

		switch ( filter ) {
			case 'this-post':
				return translate( 'Search media uploaded to this post…' );
			case 'images':
				return translate( 'Search images…' );
			case 'audio':
				return translate( 'Search audio files…' );
			case 'videos':
				return translate( 'Search videos…' );
			case 'documents':
				return translate( 'Search documents…' );
			default:
				return translate( 'Search all media…' );
		}
	}

	getFilterLabel( filter ) {
		const { translate } = this.props;

		switch ( filter ) {
			case 'this-post':
				return translate( 'This Post', { comment: 'Filter label for media list' } );
			case 'images':
				return translate( 'Images', { comment: 'Filter label for media list' } );
			case 'audio':
				return translate( 'Audio', { comment: 'Filter label for media list' } );
			case 'videos':
				return translate( 'Videos', { comment: 'Filter label for media list' } );
			case 'documents':
				return translate( 'Documents', { comment: 'Filter label for media list' } );
			default:
				return translate( 'All', { comment: 'Filter label for media list' } );
		}
	}

	constructor( props ) {
		super( props );

		this.state = { popover: false };
	}

	isFilterDisabled( filter ) {
		const { enabledFilters } = this.props;
		return enabledFilters && ( ! filter.length || ! includes( enabledFilters, filter ) );
	}

	changeFilter = filter => {
		this.props.onFilterChange( filter );
	};

	changeSource = item => {
		const newSource = item.value ? item.value : item.target.getAttribute( 'action' );

		if ( newSource !== this.props.source ) {
			this.props.onSourceChange( newSource );
		}
	};

	togglePopover = () => {
		this.setState( { popover: ! this.state.popover } );
	}

	renderDataSource() {
		const { translate, source, site } = this.props;
		const localLogo = site.icon && site.icon.img
			? <img src={ site.icon.img } width="32" height="32" />
			: <SocialLogo icon="wordpress" size={ 32 } />;
		const sources = [
			{
				value: '',
				label: translate( 'WordPress' ),
				icon: localLogo,
			},
			{
				value: 'google_photos',
				label: translate( 'Google' ),
				icon: <img src="/calypso/images/sharing/google-photos-logo.svg" width="32" height="32" />
			},
		];
		const currentSelected = find( sources, item => item.value === source );
		const selected = currentSelected ? currentSelected.icon : '';
		const popoverOptions = sources.map( item =>
			<PopoverMenuItem
				action={ item.value }
				key={ item.value }
				onClick={ this.changeSource }
				isSelected={ item.value === this.props.source }>
				{ item.label }
			</PopoverMenuItem>
		);

		return (
				<Button borderless ref="popoverMenuButton" className="button media-library__source-button" onClick={ this.togglePopover }>
					{ selected }

					<Gridicon icon="chevron-down" />

					<PopoverMenu
						context={ this.refs && this.refs.popoverMenuButton }
						isVisible={ this.state.popover }
						position="bottom right"
						onClose={ this.togglePopover }
						className="is-dialog-visible media-library__header-popover">

						{ popoverOptions }
					</PopoverMenu>
				</Button>
		);
	}

	renderTabItems() {
		if ( this.props.source !== '' ) {
			return null;
		}

		const tabs = [ '', 'this-post', 'images', 'documents', 'videos', 'audio' ];

		if ( ! this.props.post ) {
			pull( tabs, 'this-post' );
		}

		return (
			<SectionNavTabs>
				{
					tabs.map( filter =>
						<FilterItem
							key={ 'filter-tab-' + filter }
							value={ filter }
							selected={ this.props.filter === filter }
							onChange={ this.changeFilter }
							disabled={ this.isFilterDisabled( filter ) }
						>
							{ this.getFilterLabel( filter ) }
						</FilterItem>
					)
				}
			</SectionNavTabs>
		);
	}

	renderSearchSection() {
		if ( this.props.filterRequiresUpgrade ) {
			return null;
		}

		const isPinned = this.props.source === '';

		return (
			<Search
				analyticsGroup="Media"
				pinned={ isPinned }
				fitsContainer
				onSearch={ this.props.onSearch }
				initialValue={ this.props.search }
				placeholder={ this.getSearchPlaceholderText() }
				delaySearch={ true } />
		);
	}

	renderPlanStorage() {
		const eventName = 'calypso_upgrade_nudge_impression';
		const eventProperties = { cta_name: 'plan-media-storage' };
		return (
			<PlanStorage siteId={ this.props.site.ID }>
				<TrackComponentView eventName={ eventName } eventProperties={ eventProperties } />
			</PlanStorage>
		);
	}

	render() {
		// Dropdown is disabled when viewing any external data source
		return (
			<div className="media-library__filter-bar">
				<div className="media-library__datasource">
					{ this.renderDataSource() }
				</div>

				<SectionNav
					selectedText={ this.getFilterLabel( this.props.filter ) }
					hasSearch={ true }
					allowDropdown={ ! this.props.source }
				>
					{ this.renderTabItems() }
					{ this.renderSearchSection() }
				</SectionNav>

				{ this.renderPlanStorage() }
			</div>
		);
	}
}

export default localize( MediaLibraryFilterBar );

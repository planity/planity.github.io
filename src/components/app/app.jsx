import React, { useEffect, useMemo } from 'react';
import { AwesomeGrid } from '../awesome_grid/awesome_grid.jsx';
import classes from './app.module.css';
import { useLocalStorage } from '../../providers/local_storage_provider.jsx';
import { MainText } from '../main_text/main_text.jsx';
import { Landing } from '../landing/landing.jsx';
import { ToggleButton } from '../toggle_button/toggle_button.jsx';
import { useModal } from '../../providers/modal_provider.jsx';
import { Configurator } from '../configurator/configurator.jsx';
import { Widget } from '../widget/widget.jsx';
import { getWidgetBaseUrl } from '../../environments.js';

const setWidget = ({ businessId, environment, refonte, isMPA }) => {
	const baseUrl = getWidgetBaseUrl(environment, refonte);
	if (!baseUrl) {
		console.error(
			`No CloudFront distribution configured for environment "${environment}"`
		);
		return;
	}

	// Pretty sensitive actually 😕
	const moduleType = window.location.pathname.replace(/(\/|.html|multi_)/g, '');
	window.planity = {
		key: businessId,
		options: {
			myAccountSlug: isMPA && 'multi_account',
			appointmentRedirect: isMPA && redirectToMyAccount,
			onlineShopRedirect: isMPA && redirectToMyAccount,
			giftVoucherRedirect: isMPA && redirectToMyAccount
		},
		container: document.getElementById('planity-container'),
		accountContainer:
			moduleType === 'account' && document.getElementById('accountContainer'),
		appointmentContainer:
			(isDefaultMPAPage({ moduleType, isMPA }) ||
				moduleType === 'appointment') &&
			document.getElementById('appointmentContainer'),
		onlineShopContainer:
			moduleType === 'online_shop' &&
			document.getElementById('onlineShopContainer'),
		giftVoucherContainer:
			moduleType === 'gift_vouchers' &&
			document.getElementById('giftVoucherContainer')
	};
	addScriptToDOM(`${baseUrl}/polyfills.latest.js`);
	addScriptToDOM(`${baseUrl}/app.latest.js`);
};
/**
 * Used as a fallback, when having MPA and being on the website's root (URL is `/` so it's not possible to guess the page
 * @return {boolean}
 */
const isDefaultMPAPage = ({ moduleType, isMPA }) => !moduleType && isMPA;

function addScriptToDOM(url) {
	const script = document.createElement('script');
	script.src = url;
	script.async = true;
	document.body.appendChild(script);
}

export const App = () => {
	const { businessId, environment, refonte, isMPA } = useLocalStorage();
	const { openModal, isOpen } = useModal();
	const hasAWidgetSetUp = useMemo(
		() => !!businessId && !!environment && [false, true].includes(refonte),
		[businessId, environment, refonte]
	);

	useEffect(() => {
		if (hasAWidgetSetUp) {
			setWidget({ businessId, environment, refonte, isMPA });
		}
	}, [hasAWidgetSetUp, businessId, environment, refonte, isMPA]);
	return (
		<div className={classes.container}>
			<AwesomeGrid />

			<MainText />

			<div className={classes.content}>
				{hasAWidgetSetUp ? <Widget /> : <Landing />}
			</div>
			<ToggleButton
				onClick={() => openModal(<Configurator />)}
				enabled={!isOpen}
				className={classes.configuratorButton}
			>
				CONFIGURATOR
			</ToggleButton>
		</div>
	);
};

function redirectToMyAccount() {
	window.location = './multi_account';
}

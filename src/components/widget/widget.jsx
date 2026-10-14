import React from 'react';
import classes from './widget.module.css';
import { NavButtons } from '../nav_buttons/nav_buttons.jsx';
import { useLocalStorage } from '../../providers/local_storage_provider.jsx';

export const Widget = () => {
	const { isMPA } = useLocalStorage();
	return (
		<div className={classes.widgetMainContainer}>
			<NavButtons isMPA={isMPA} />

			<div className={classes.widgetContainer} id={'planity-container'} />
			<div className={classes.widgetContainer} id={'accountContainer'} />
			<div className={classes.widgetContainer} id={'appointmentContainer'} />
			<div className={classes.widgetContainer} id={'giftVoucherContainer'} />
			<div className={classes.widgetContainer} id={'onlineShopContainer'} />
			<div className={classes.widgetContainer} id={'cureContainer'} />
		</div>
	);
};

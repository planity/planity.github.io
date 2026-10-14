import React from 'react';
import classes from './nav_buttons.module.css';

export const NavButtons = ({ isMPA }) => {
	return (
		<div className={classes.navButtonContainer}>
			{isMPA && (
				<>
					<a className={classes.links} href={'./multi_appointment'}>
						Prendre RDV
					</a>
					<a className={classes.links} href={'./multi_gift_vouchers'}>
						Cartes cadeaux
					</a>
					<a className={classes.links} href={'./multi_cure'}>
						Forfaits
					</a>
					<a className={classes.links} href={'./multi_online_shop'}>
						Boutique en ligne
					</a>
					<a className={classes.links} href={'./multi_account'}>
						Mon compte
					</a>
				</>
			)}
		</div>
	);
};

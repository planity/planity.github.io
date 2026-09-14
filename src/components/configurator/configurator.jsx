import React, { useReducer } from 'react';
import classes from './configurator.module.css';
import { useLocalStorage } from '../../providers/local_storage_provider.jsx';
import { ToggleButton } from '../toggle_button/toggle_button.jsx';
import { Coin } from './coin.jsx';
import businesses from './businesses.json';
import { Reset } from './reset.jsx';
import { DEFAULT_ENVIRONMENT, ENVIRONMENTS } from '../../environments.js';

function reducer(state, action) {
	switch (action.type) {
		case 'BUSINESS_ID_HAS_CHANGED':
			return { ...state, businessId: action.payload };
		case 'ENVIRONMENT_HAS_CHANGED':
			return { ...state, environment: action.payload };
		case 'REFONTE_HAS_CHANGED':
			return { ...state, refonte: action.payload };
		case 'MPA_HAS_CHANGED':
			return { ...state, isMPA: !state.isMPA };
		default:
			console.error('unhandled action', action);
	}
}

function initialState({ businessId, environment, refonte, isMPA }) {
	return {
		businessId: businessId || '',
		environment: environment || DEFAULT_ENVIRONMENT,
		refonte: [true, false].includes(refonte) ? !!refonte : true,
		isMPA: [true, false].includes(isMPA) ? !!isMPA : true
	};
}

export const Configurator = ({ onSubmit }) => {
	const localStorageInitialState = useLocalStorage();
	const [{ businessId, environment, refonte, isMPA }, dispatch] = useReducer(
		reducer,
		localStorageInitialState,
		initialState
	);

	const submit = e => {
		e?.preventDefault();
		localStorage.setItem('businessId', businessId);
		localStorage.setItem('environment', environment);
		localStorage.setItem('refonte', JSON.stringify(!!refonte));
		localStorage.setItem('isMPA', JSON.stringify(!!isMPA));
		setTimeout(() => {
			location.reload();
		}, 500);

		if (typeof onSubmit === 'function') onSubmit();
	};
	async function reset(e) {
		e?.preventDefault();
		localStorage.clear();
		location.replace('./');
	}

	return (
		<fieldset className={classes.container}>
			<legend className={classes.title}>Configurator</legend>
			<form className={classes.form} onSubmit={submit}>
				<label className={classes.labelContainer} htmlFor={'environment'}>
					<p className={classes.label}>Env</p>
					<select
						className={classes.input}
						onChange={e =>
							dispatch({
								type: 'ENVIRONMENT_HAS_CHANGED',
								payload: e.target.value
							})
						}
						name={'environment'}
						value={environment}
					>
						<option value={''} disabled>
							Environnement
						</option>
						{ENVIRONMENTS.map(({ value, label, cloudfrontId }) => (
							<option
								value={value}
								key={value}
								disabled={!cloudfrontId}
								title={
									!cloudfrontId
										? 'Aucune distribution CloudFront configurée pour cet environnement'
										: undefined
								}
							>
								{label}
								{!cloudfrontId ? ' (non configuré)' : ''}
							</option>
						))}
					</select>
				</label>
				<label className={classes.labelContainer} htmlFor={'businessId'}>
					<p className={classes.label}>BusinessId</p>
					<input
						className={classes.input}
						type='text'
						name='businessId'
						list='businessIds'
						value={businessId}
						onChange={e =>
							dispatch({
								type: 'BUSINESS_ID_HAS_CHANGED',
								payload: e.currentTarget.value
							})
						}
						placeholder={'Business Id'}
					/>
					<datalist id='businessIds'>
						{businesses.map(({ objectID, name }) => (
							<option value={objectID} label={name} key={objectID}>
								{name}
							</option>
						))}
					</datalist>
				</label>
				<label className={classes.labelContainer} htmlFor={'refonte'}>
					<p className={classes.label}>Refonte</p>
					<ToggleButton
						enabled={!!refonte}
						onClick={enabled =>
							dispatch({
								type: 'REFONTE_HAS_CHANGED',
								payload: enabled
							})
						}
					>
						{!!refonte ? 'Activée' : 'Désactivée'}
					</ToggleButton>
				</label>
				<label className={classes.labelContainer} htmlFor={'isMPA'}>
					<p className={classes.label}>Mode</p>
					<ToggleButton
						enabled
						onClick={() =>
							dispatch({
								type: 'MPA_HAS_CHANGED'
							})
						}
					>
						{!!isMPA ? 'Multi page' : 'Single Page'}
					</ToggleButton>
				</label>
				<div className={classes.buttons}>
					<button className={classes.resetButton} onClick={reset}>
						<Reset color={'white'} size={16} />
						RESET
					</button>
					<button className={classes.submitButton} onClick={submit}>
						START
						<div className={classes.rotatingIcon}>
							<Coin />
						</div>
					</button>
				</div>
			</form>
		</fieldset>
	);
};

/**
 * Single source of truth for the environments offered by the configurator.
 *
 * An environment is made of:
 * - `value`: what gets stored in localStorage, and the `/widget/<value>/` path
 *   segment on the CDN
 * - `label`: what the configurator displays
 * - `cloudfrontId`: the first part of the CloudFront host serving the widget
 *   (`https://<cloudfrontId>.cloudfront.net`). Each dev environment has its own
 *   distribution, so it has to be filled in one by one. An environment without
 *   a `cloudfrontId` is listed but not selectable.
 *
 * Note: the dev stacks only serve the refonte bundle (`/widget/dev<n>/2/`);
 * their legacy path 404s. The Refonte switch stays free, but leaving it on is
 * what works there.
 */

const CLOUDFRONT_DOMAIN = 'cloudfront.net';

// lab, staging and production are all served by the same distribution
const SHARED_CLOUDFRONT_ID = 'd2skjte8udjqxw';

/**
 * CloudFront ids of the dev environments, keyed by environment value. This is
 * the list of dev environments: adding or removing an entry is enough.
 */
const DEV_CLOUDFRONT_IDS = {
	dev1: 'd6tyujd4hno8o',
	dev2: 'd1odfv4q2aq3ec',
	dev3: 'd3j64g9dadimrs',
	dev4: 'd2lpeqqxg0kzh6',
	dev5: 'd1eh04tlq93ml2',
	dev6: 'd3q2kmyjosz9a',
	dev7: 'd246zfta0fdrnf',
	dev8: 'd3fb27zwizkwwc',
	dev9: 'd37erdttzybfxk'
};

const DEV_ENVIRONMENTS = Object.entries(DEV_CLOUDFRONT_IDS).map(
	([value, cloudfrontId]) => ({
		value,
		label: value.charAt(0).toUpperCase() + value.slice(1),
		cloudfrontId
	})
);

export const ENVIRONMENTS = [
	{ value: 'lab', label: 'Lab', cloudfrontId: SHARED_CLOUDFRONT_ID },
	{ value: 'staging', label: 'Staging', cloudfrontId: SHARED_CLOUDFRONT_ID },
	{
		value: 'production',
		label: 'Production',
		cloudfrontId: SHARED_CLOUDFRONT_ID
	},
	...DEV_ENVIRONMENTS
];

export const DEFAULT_ENVIRONMENT = ENVIRONMENTS[0].value;

/**
 * @param {string} environment
 * @return {{value: string, label: string, cloudfrontId: string|null}|undefined}
 */
export const getEnvironment = environment =>
	ENVIRONMENTS.find(({ value }) => value === environment);

/**
 * Base URL of the widget scripts for a given environment.
 * @param {string} environment
 * @param {boolean} refonte
 * @return {string|null} `null` when the environment is unknown or has no
 * CloudFront distribution set up yet
 */
export const getWidgetBaseUrl = (environment, refonte) => {
	const { cloudfrontId } = getEnvironment(environment) || {};
	if (!cloudfrontId) return null;

	return `https://${cloudfrontId}.${CLOUDFRONT_DOMAIN}/widget/${environment}${
		refonte ? '/2' : ''
	}`;
};

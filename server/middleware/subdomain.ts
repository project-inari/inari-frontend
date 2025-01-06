import { useEnvironment } from '~/composables/useEnvironment';

export default defineEventHandler(event => {
    const env = useEnvironment();
    const hostParts = getRequestURL(event).host.split('.');
    if (env === 'ALPHA' || env === 'UAT') {
        if (hostParts.length === 2) return;
    } else {
        if (hostParts.length === 1) return;
    }
    const subdomain = hostParts[0];

    // eslint-disable-next-line no-console
    console.log('url', getRequestURL(event).host);
    event.context.subdomain = subdomain;
});

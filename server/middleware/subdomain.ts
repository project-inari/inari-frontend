import { useEnvironment } from '~/composables/useEnvironment';

export default defineEventHandler(event => {
    const env = useEnvironment();
    const hostParts = getRequestURL(event).host.split('.');
    if (env === 'ALPHA' || env === 'UAT') {
        if (hostParts.length === 3) return;
    } else if (env === 'PROD') {
        if (hostParts.length === 2) return;
    } else {
        if (hostParts.length === 1) return;
    }
    const subdomain = hostParts[0];

    event.context.subdomain = subdomain;
});

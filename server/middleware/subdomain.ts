export default defineEventHandler(event => {
    const hostname = getRequestURL(event).host;
    const hostParts = hostname.split('.');
    if (hostParts.length === 1) return;
    const subdomain = hostParts[0];

    event.context.subdomain = subdomain;
});

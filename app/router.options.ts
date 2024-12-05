import type { RouterOptions } from '@nuxt/schema';
import { useSubdomain } from '~/composables/useSubdomain';

export default <RouterOptions>{
    routes: _routes => {
        const { ssrContext } = useNuxtApp();
        const subdomain = useSubdomain();

        if (ssrContext?.event.context.subdomain)
            subdomain.value = ssrContext?.event.context.subdomain;
        if (subdomain.value) {
            const businessRoute = _routes.filter(i =>
                i.path.includes('/business/:siteId()'),
            );

            const businessRouteMapped = businessRoute.map(i => ({
                ...i,
                path: i.path.includes('/business/:siteId()')
                    ? i.path.replace('/business/:siteId()', '/')
                    : i.path.replace('/business/:siteId()/', '/'),
            }));

            return businessRouteMapped;
        }
    },
};

import type { route as routeFn } from 'ziggy-js';
import type { SharedData } from './index';

declare global {
    // Defined by the @routes Blade directive in the browser and by ssr.tsx on the server.
    var route: typeof routeFn;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: SharedData;
    }
}

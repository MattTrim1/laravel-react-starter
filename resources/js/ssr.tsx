import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import { route } from 'ziggy-js';
import { title } from './lib/title';
import type { SharedData } from './types';

createServer((page) =>
    createInertiaApp({
        page,
        title,
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
        setup: ({ App, props }) => <App {...props} />,
        render: (app) => {
            // In the browser, route() comes from the @routes Blade directive. On the server it is
            // defined per request from the shared Ziggy props. renderToString is synchronous, so a
            // concurrent request cannot swap the global mid-render.
            const ziggy = page.props.ziggy as SharedData['ziggy'];
            const config = { ...ziggy, location: new URL(ziggy.location) };

            globalThis.route = ((...[name, params, absolute]: Parameters<typeof route>) => route(name, params, absolute, config)) as typeof route;

            return renderToString(app);
        },
    }),
);

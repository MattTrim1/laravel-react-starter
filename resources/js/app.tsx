import '../sass/app.scss';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { title } from './lib/title';

createInertiaApp({
    title,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const app = (
            <StrictMode>
                <App {...props} />
            </StrictMode>
        );

        // Hydrate server-rendered markup; fall back to a fresh render when SSR is off or unavailable.
        if (el.hasChildNodes()) {
            hydrateRoot(el, app);
        } else {
            createRoot(el).render(app);
        }
    },
    progress: {
        color: 'var(--color-accent)',
    },
});

# Laravel React Starter

A lean starting point for single-page apps built with **Laravel 12**, **Inertia.js 2** and **React 19**, written in **TypeScript**, styled with **Sass** and bundled with **Vite**. It ships with Ziggy for using named Laravel routes in React, optional server-side rendering, tests, linting and CI — and deliberately no auth scaffolding or UI kit, so you can add exactly what your app needs.

## Stack

| Layer        | Tooling                                                            |
| ------------ | ------------------------------------------------------------------ |
| Backend      | Laravel 12 (PHP 8.2+)                                              |
| Bridge       | Inertia.js 2 (`inertiajs/inertia-laravel`, `@inertiajs/react`)     |
| UI           | React 19 + TypeScript 5                                            |
| Styles       | Sass, using the module system (`@use` / `@forward`)                |
| Build        | Vite 6 + `laravel-vite-plugin`                                     |
| Routes in JS | Ziggy 2 — `route('name')` in the browser and during SSR            |
| SSR          | Optional Inertia SSR server on Node                                |
| Quality      | PHPUnit, Pint, ESLint, Prettier, `tsc`, GitHub Actions, Dependabot |

## Requirements

- PHP 8.2, 8.3, 8.4 or 8.5 with the `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `iconv`, `mbstring`, `openssl`, `pdo_sqlite`, `phar`, `session`, `tokenizer`, `xml` and `xmlwriter` extensions. `curl` is used by `php artisan inertia:start-ssr` / `inertia:stop-ssr`, `pcntl` by `php artisan pail` (which `composer dev` runs) and `intl` by `php artisan db:show` / `db:table`. On Windows use WSL.
- Composer 2
- Node.js 22.13+ — the [`.nvmrc`](.nvmrc) pins the current LTS, so `nvm use` picks it up
- SQLite (the default), or MySQL / MariaDB / PostgreSQL

## Getting started

```bash
git clone https://github.com/MattTrim1/laravel-react-starter.git my-app
cd my-app
composer setup   # installs dependencies, creates .env and the app key, migrates, builds assets
composer dev     # http://127.0.0.1:8000
```

`composer setup` runs these steps, if you prefer to do them by hand:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate   # offers to create database/database.sqlite
npm ci
npm run build
```

Sessions, the cache and the queue use the database driver by default, so run the migrations before the first request.

`VITE_APP_NAME` is read at build time, so restart `npm run dev` or rebuild after changing `APP_NAME`.

## Scripts

| Command             | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `composer setup`    | First-time setup (see above)                                         |
| `composer dev`      | Runs the PHP server, queue worker, log tail (Pail) and Vite together |
| `composer dev:ssr`  | Builds the SSR bundle, then runs the app with the SSR server         |
| `composer test`     | Clears cached config and runs the PHPUnit suite                      |
| `composer lint`     | Formats PHP with Pint (`composer lint:check` only checks)            |
| `npm run dev`       | Vite dev server with hot module replacement                          |
| `npm run build`     | Production client build into `public/build`                          |
| `npm run build:ssr` | Client build plus the SSR bundle in `bootstrap/ssr`                  |
| `npm run lint`      | ESLint with `--fix` (`npm run lint:check` only checks)               |
| `npm run format`    | Prettier (`npm run format:check` only checks)                        |
| `npm run types`     | Type-checks with `tsc --noEmit`                                      |

The Composer scripts run every PHP process on the PHP binary that runs Composer. To use a particular version when several are installed, run Composer with it, for example `php8.5 "$(command -v composer)" dev`.

## Project structure

```text
app/Http/Middleware/HandleInertiaRequests.php   Props shared with every page
bootstrap/app.php                               Routing, middleware and exception configuration
config/inertia.php                              SSR and page-path settings
resources/views/app.blade.php                   Root HTML template
resources/js/app.tsx                            Client entry point
resources/js/ssr.tsx                            SSR entry point
resources/js/pages/                             Inertia pages (one file per page)
resources/js/components/, layouts/, hooks/      Your components, layouts and hooks
resources/js/lib/                               Small shared helpers
resources/js/types/                             Shared TypeScript types and global declarations
resources/sass/                                 Stylesheets (see below)
routes/web.php                                  Web routes
tests/Feature/                                  Feature tests
```

## Adding a page

1. Add a named route in `routes/web.php`:

    ```php
    Route::get('/about', fn () => Inertia::render('about'))->name('about');
    ```

2. Create `resources/js/pages/about.tsx`:

    ```tsx
    import { Head } from '@inertiajs/react';

    export default function About() {
        return (
            <>
                <Head title="About" />
                <main className="container">
                    <h1>About</h1>
                </main>
            </>
        );
    }
    ```

3. Link to it from any page with `<Link href={route('about')}>About</Link>` (`Link` comes from `@inertiajs/react`).

Page titles are formatted as `Page - App name` by [`resources/js/lib/title.ts`](resources/js/lib/title.ts), which both the client and the SSR entry use.

### Shared data

`HandleInertiaRequests::share()` sends these props to every page:

| Prop        | Contents                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| `name`      | `config('app.name')`                                                       |
| `auth.user` | The authenticated user, or `null` (hidden model attributes are never sent) |
| `ziggy`     | Ziggy's route list plus the current URL, used by `route()` during SSR      |
| `errors`    | Validation errors (added by Inertia)                                       |

They are typed in [`resources/js/types/index.ts`](resources/js/types/index.ts) and registered with Inertia in [`resources/js/types/global.d.ts`](resources/js/types/global.d.ts), so `usePage().props.auth.user` is fully typed without generics. When you share something new, add it to `SharedData` too.

Ziggy exposes every named route to the browser. To hide some (admin routes, for example), create `config/ziggy.php` with an `except` (or `only`) list of route name patterns — see [Ziggy's filtering docs](https://github.com/tighten/ziggy#filtering-routes).

## Styles

`resources/sass/app.scss` is imported by `app.tsx` and uses the Dart Sass module system. `@import` is deprecated, so use `@use` and `@forward`:

| Directory     | Purpose                                                          | Emits CSS |
| ------------- | ---------------------------------------------------------------- | --------- |
| `config/`     | Design tokens (fonts, spacing, breakpoints, colours) and helpers | No        |
| `mixins/`     | Reusable mixins such as `up($breakpoint)` and `focus-ring`       | No        |
| `global/`     | Custom properties (with dark mode), a small reset, element base  | Yes       |
| `components/` | Class-based component styles                                     | Yes       |

Colours are exposed as CSS custom properties (`var(--color-accent)`, …) and switch automatically with `prefers-color-scheme`. In a component partial, pull in what you need:

```scss
@use '../config';
@use '../mixins';

.panel {
    padding: config.space(6);

    @include mixins.up(md) {
        padding: config.space(8);
    }
}
```

Then add it to `components/_index.scss`.

## Server-side rendering

SSR is optional. When `bootstrap/ssr/ssr.js` exists and the SSR server is reachable, Inertia pre-renders the first visit to each page; otherwise it silently falls back to client-side rendering.

```bash
npm run build:ssr
php artisan inertia:start-ssr   # listens on port 13714; Laravel calls it at INERTIA_SSR_URL
```

Or run `composer dev:ssr`, which builds both bundles and starts the SSR server alongside the PHP server, queue worker and Pail. It does not run the Vite dev server, so there is no hot reloading: re-run it after changing front-end code.

The client hydrates server-rendered markup and falls back to a fresh render when there is none.

- Set `INERTIA_SSR_ENABLED=false` to turn SSR off in an environment, or delete `bootstrap/ssr` locally.
- `route()` works during SSR: the SSR entry builds it from the shared `ziggy` prop. Other browser-only APIs (`window`, `document`, `localStorage`) must only be used in effects or event handlers.
- In production, run the SSR server under a process monitor that restarts it whenever it exits, with `NODE_ENV=production` (otherwise React uses its slower development build). `inertia:start-ssr` exits with status 0 even when Node crashes or is stopped, so Supervisor needs `autorestart=true` (its default, `unexpected`, will not restart it) and systemd needs `Restart=always`. For example, a Supervisor program with `command=php /path/to/artisan inertia:start-ssr`, `autorestart=true` and `environment=NODE_ENV="production"`.
- The SSR server binds to every network interface, and its `/render` and `/shutdown` endpoints are unauthenticated. In production, block port 13714 from outside the host (firewall or security group).
- The SSR bundle imports `react`, `react-dom` and `@inertiajs/react` from `node_modules` at runtime, so keep `node_modules` on servers that run SSR.

## Testing

```bash
composer test
```

Tests use an in-memory SQLite database (see `phpunit.xml`) and render pages without a Vite build. A cached config would make Laravel ignore `phpunit.xml` and use your real database, so the base `TestCase` refuses to run in that case; `composer test` clears the config cache first. Assert on Inertia responses with `assertInertia()`:

```php
use Inertia\Testing\AssertableInertia as Assert;

$this->get(route('home'))
    ->assertOk()
    ->assertInertia(fn (Assert $page) => $page->component('welcome'));
```

## Code style

- **PHP:** [Pint](https://laravel.com/docs/pint) with the Laravel preset — `composer lint`.
- **TypeScript / React:** ESLint 9 flat config (`eslint.config.js`) with `typescript-eslint`, React and React Hooks rules — `npm run lint`.
- **Formatting:** Prettier (`.prettierrc`) with import sorting — `npm run format`.
- **Types:** `npm run types`.

## Continuous integration

GitHub Actions workflows in `.github/workflows` run on pushes to `main` and on pull requests:

- `tests.yml` — on PHP 8.2, 8.3, 8.4 and 8.5: installs dependencies, checks every locked package against that PHP version (`composer check-platform-reqs --lock`) and runs the PHPUnit suite with all errors and deprecations reported.
- `lint.yml` — Pint, ESLint, Prettier, `tsc` and a client + SSR build.

Dependabot (`.github/dependabot.yml`) opens weekly grouped pull requests for Composer and npm updates within the current major versions, and monthly ones for GitHub Actions.

`composer.json` pins the platform PHP version to 8.2 so that `composer update` never locks packages that need a newer PHP than the project supports. Raise it together with the `php` requirement. Because of the pin, `composer install` does not check the lock against your real PHP version; run `composer check-platform-reqs --lock` to do that, as CI does. Tests log PHP deprecations to stderr (see `phpunit.xml`), so new-version deprecations show up in the test output.

## Deploying

A typical deploy runs:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build          # or `npm run build:ssr` if you use SSR
php artisan migrate --force
php artisan optimize
php artisan inertia:stop-ssr --graceful   # SSR only: the process monitor restarts it with the new bundle
```

Before going live:

- Set `APP_ENV=production`, `APP_DEBUG=false` and a real `APP_URL`, and serve the site over HTTPS with `SESSION_SECURE_COOKIE=true`.
- Behind a load balancer or TLS-terminating proxy, trust it in `bootstrap/app.php` (for example `$middleware->trustProxies(at: '*')`, or specific IPs) so generated URLs use `https`.
- If you add a Content Security Policy, call `Vite::useCspNonce()` and pass the nonce to Ziggy with `@routes(nonce: Vite::cspNonce())`. Inertia's progress bar injects an inline `<style>` without a nonce, so either allow it in `style-src` or set `includeCSS: false` in the `progress` options in `resources/js/app.tsx` and style `#nprogress` yourself. The layout also loads fonts from `https://fonts.bunny.net` (`style-src` and `font-src`).
- Run a queue worker if you dispatch jobs, since `QUEUE_CONNECTION` defaults to `database`.

## Supported versions

This starter stays on Laravel 12, Inertia 2, React 19 and Vite 6, and supports PHP 8.2 to 8.5, all tested in CI. PHP 8.0 and 8.1 are not supported: they are past end of life, and Laravel 12 requires PHP 8.2. Laravel 12 receives security fixes until February 2027 and PHP 8.2 until the end of 2026, so plan the move to the next majors before then.

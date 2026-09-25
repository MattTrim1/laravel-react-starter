import { Head, usePage } from '@inertiajs/react';

const resources = [
    { title: 'Laravel', href: 'https://laravel.com/docs/12.x', description: 'Routing, controllers, Eloquent, queues and testing.' },
    { title: 'Inertia.js', href: 'https://inertiajs.com', description: 'Build a single-page app with server-side routing and controllers.' },
    { title: 'React', href: 'https://react.dev', description: 'Components and hooks for the pages in resources/js/pages.' },
    { title: 'Sass', href: 'https://sass-lang.com/documentation', description: 'Styles live in resources/sass and use the @use module system.' },
];

export default function Welcome() {
    const { name } = usePage().props;

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content="A Laravel, Inertia and React starter with TypeScript, Sass and Vite." />
            </Head>

            <main className="container">
                <h1>{name}</h1>
                <p className="lead">Laravel 12, Inertia 2, React 19, TypeScript and Sass, bundled with Vite.</p>

                <h2>Next steps</h2>
                <ol>
                    <li>
                        Add a named route in <code>routes/web.php</code> that returns <code>Inertia::render(&apos;your-page&apos;)</code>.
                    </li>
                    <li>
                        Create the page component in <code>resources/js/pages/your-page.tsx</code> and link to it with{' '}
                        <code>{`<Link href={route('your-page')}>`}</code>.
                    </li>
                    <li>
                        Style it with partials in <code>resources/sass</code>.
                    </li>
                </ol>

                <h2 id="documentation">Documentation</h2>
                <ul className="card-grid" role="list" aria-labelledby="documentation">
                    {resources.map((resource) => (
                        <li key={resource.href}>
                            <a className="card" href={resource.href}>
                                <span className="card__title">{resource.title}</span>
                                <span className="card__body">{resource.description}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
}

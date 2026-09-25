<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- The SSR head carries its own <title>; emit the fallback only when SSR returned nothing. --}}
    @inertiaHead
    @empty($__inertiaSsrResponse)
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @endempty

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
</head>
<body>
@inertia
</body>
</html>

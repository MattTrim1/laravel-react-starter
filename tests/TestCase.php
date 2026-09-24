<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        $app = parent::createApplication();

        // A cached config ignores phpunit.xml, so RefreshDatabase would wipe the real database.
        if ($app->configurationIsCached()) {
            throw new RuntimeException('The configuration is cached, so tests would run against your real database. Run `php artisan config:clear` or use `composer test`.');
        }

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();

        // Render pages without requiring a Vite build (public/build/manifest.json).
        $this->withoutVite();
    }
}

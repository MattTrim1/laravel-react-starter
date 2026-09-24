<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Render pages without requiring a Vite build (public/build/manifest.json).
        $this->withoutVite();
    }
}

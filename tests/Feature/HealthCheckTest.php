<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_the_health_check_endpoint_responds_successfully(): void
    {
        $this->get('/up')->assertOk();
    }
}

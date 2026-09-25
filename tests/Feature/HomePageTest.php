<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_the_welcome_component(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->url('/')
            );
    }

    public function test_guests_receive_the_shared_props(): void
    {
        $this->get('/?tab=docs')
            ->assertInertia(fn (Assert $page) => $page
                ->where('name', config('app.name'))
                ->where('auth.user', null)
                ->has('ziggy.routes.home')
                ->where('ziggy.location', url('/').'/?tab=docs')
                ->etc()
            );
    }

    public function test_the_authenticated_user_is_shared_without_secrets(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.id', $user->id)
                ->where('auth.user.email', $user->email)
                ->missing('auth.user.password')
                ->missing('auth.user.remember_token')
                ->etc()
            );
    }

    public function test_ziggy_location_keeps_the_raw_query_string(): void
    {
        // Must match window.location exactly, or route() differs between SSR and hydration.
        $this->get('/?b=1&a=2&a=3')
            ->assertInertia(fn (Assert $page) => $page
                ->where('ziggy.location', url('/').'/?b=1&a=2&a=3')
                ->etc()
            );
    }

    public function test_ziggy_is_not_resent_on_partial_reloads(): void
    {
        $this->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('ziggy.routes.home')
                ->reloadOnly('name', fn (Assert $reload) => $reload
                    ->where('name', config('app.name'))
                    ->missing('ziggy')
                )
            );
    }
}

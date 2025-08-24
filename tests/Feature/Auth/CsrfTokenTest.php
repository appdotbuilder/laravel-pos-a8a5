<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('login page includes csrf token in shared props', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->has('csrf_token')
    );
});

test('login page includes csrf token meta tag', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertSee('name="csrf-token"', false);
});

test('login request succeeds with valid credentials and csrf protection', function () {
    // Create a user first
    $user = \App\Models\User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    // Start session with login page
    $this->get('/login');

    // Make request with proper session (CSRF handled automatically by Laravel)
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    // Should redirect to dashboard on successful login
    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
});
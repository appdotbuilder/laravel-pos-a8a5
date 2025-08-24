<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10, 500);
        $taxAmount = round($subtotal * 0.08, 2); // 8% tax
        $total = $subtotal + $taxAmount;
        $amountPaid = $total + fake()->randomFloat(2, 0, 50); // Sometimes overpay
        $change = $amountPaid - $total;
        
        return [
            'sale_number' => 'SALE-' . date('Ymd') . '-' . fake()->unique()->numberBetween(1000, 9999),
            'cashier_id' => User::factory(),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total_amount' => $total,
            'amount_paid' => $amountPaid,
            'change_given' => $change,
            'status' => 'completed',
        ];
    }

    /**
     * Indicate that the sale was completed today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => now()->subHours(fake()->numberBetween(0, 23)),
        ]);
    }
}
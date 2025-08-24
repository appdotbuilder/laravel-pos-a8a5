<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['in', 'out', 'adjustment']);
        $previousStock = fake()->numberBetween(0, 100);
        $quantity = fake()->numberBetween(1, 50);
        
        $newStock = match($type) {
            'in' => $previousStock + $quantity,
            'out' => max(0, $previousStock - $quantity),
            'adjustment' => $quantity,
            default => $previousStock,
        };
        
        $movementQuantity = match($type) {
            'in' => $quantity,
            'out' => -$quantity,
            'adjustment' => $quantity - $previousStock,
            default => 0,
        };
        
        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'type' => $type,
            'quantity' => $movementQuantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => fake()->randomElement(['Purchase', 'Sale', 'Adjustment', 'Damaged', 'Return']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
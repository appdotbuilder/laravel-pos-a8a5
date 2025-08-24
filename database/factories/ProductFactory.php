<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $purchasePrice = fake()->randomFloat(2, 5, 100);
        $sellingPrice = $purchasePrice * fake()->randomFloat(2, 1.2, 2.5);
        
        return [
            'name' => fake()->randomElement([
                'Wireless Headphones', 'Gaming Mouse', 'Coffee Mug', 'T-Shirt', 
                'Notebook', 'Desk Lamp', 'Phone Case', 'Water Bottle', 
                'Keyboard', 'Monitor Stand', 'USB Cable', 'Power Bank'
            ]) . ' - ' . fake()->word(),
            'sku' => strtoupper(fake()->unique()->bothify('???-####')),
            'description' => fake()->paragraph(),
            'category_id' => Category::factory(),
            'purchase_price' => $purchasePrice,
            'selling_price' => round($sellingPrice, 2),
            'fixed_price' => fake()->boolean(80),
            'stock_quantity' => fake()->numberBetween(0, 200),
            'min_stock_level' => fake()->numberBetween(5, 20),
            'image_path' => null,
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(0, 5),
            'min_stock_level' => fake()->numberBetween(10, 20),
        ]);
    }
}
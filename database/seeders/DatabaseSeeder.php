<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create cashier user
        $cashier = User::factory()->create([
            'name' => 'John Cashier',
            'email' => 'cashier@example.com',
            'role' => 'cashier',
        ]);

        // Create categories
        $categories = Category::factory(8)->create();

        // Create products
        $products = collect();
        foreach ($categories as $category) {
            $categoryProducts = Product::factory(6)
                ->active()
                ->create(['category_id' => $category->id]);
            $products = $products->merge($categoryProducts);
            
            // Create some low stock products
            Product::factory(2)
                ->lowStock()
                ->active()
                ->create(['category_id' => $category->id]);
        }

        // Create some sample sales
        Sale::factory(15)
            ->today()
            ->create(['cashier_id' => $cashier->id]);

        Sale::factory(25)
            ->create(['cashier_id' => $cashier->id]);
    }
}
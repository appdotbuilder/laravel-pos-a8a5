<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display inventory management page.
     */
    public function index()
    {
        $products = Product::with('category')
            ->select('id', 'name', 'sku', 'category_id', 'stock_quantity', 'min_stock_level')
            ->orderBy('name')
            ->paginate(20);

        $lowStockProducts = Product::with('category')
            ->lowStock()
            ->active()
            ->limit(10)
            ->get();

        $recentMovements = StockMovement::with('product', 'user')
            ->latest()
            ->limit(10)
            ->get();
        
        return Inertia::render('inventory/index', [
            'products' => $products,
            'lowStockProducts' => $lowStockProducts,
            'recentMovements' => $recentMovements,
        ]);
    }

    /**
     * Update product stock.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $previousStock = $product->stock_quantity;
        $quantity = $request->quantity;

        // Calculate new stock based on movement type
        $newStock = $previousStock;
        $movementQuantity = 0;
        
        switch ($request->type) {
            case 'in':
                $newStock = $previousStock + $quantity;
                $movementQuantity = $quantity;
                break;
            case 'out':
                $newStock = max(0, $previousStock - $quantity);
                $movementQuantity = -$quantity;
                break;
            case 'adjustment':
                $newStock = $quantity;
                $movementQuantity = $quantity - $previousStock;
                break;
        }

        // Update product stock
        $product->update(['stock_quantity' => $newStock]);

        // Record stock movement
        StockMovement::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'type' => $request->type,
            'quantity' => $movementQuantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => $request->reason,
            'notes' => $request->notes,
        ]);

        return redirect()->route('inventory.index')
            ->with('success', 'Stock updated successfully.');
    }
}
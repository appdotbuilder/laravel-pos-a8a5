<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display the POS interface.
     */
    public function index(Request $request)
    {
        // Handle AJAX search requests
        if ($request->ajax() && $request->filled('query')) {
            $request->validate([
                'query' => 'required|string|min:1',
            ]);

            $query = $request->input('query');
            
            $products = Product::with('category')
                ->active()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('sku', 'like', "%{$query}%");
                })
                ->where('stock_quantity', '>', 0)
                ->limit(10)
                ->get();

            return response()->json($products);
        }

        return Inertia::render('pos/index');
    }

    /**
     * Process a sale.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // Calculate totals
                $subtotal = 0;
                $items = [];

                foreach ($request->items as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    
                    // Check stock availability
                    if ($product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for {$product->name}");
                    }

                    $itemTotal = $product->selling_price * $item['quantity'];
                    $subtotal += $itemTotal;

                    $items[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'subtotal' => $itemTotal,
                    ];
                }

                $taxAmount = 0; // Can be configured later
                $totalAmount = $subtotal + $taxAmount;
                $changeGiven = max(0, $request->amount_paid - $totalAmount);

                if ($request->amount_paid < $totalAmount) {
                    throw new \Exception('Insufficient payment amount');
                }

                // Create sale
                $saleNumber = 'SALE-' . date('Ymd') . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
                
                $sale = Sale::create([
                    'sale_number' => $saleNumber,
                    'cashier_id' => auth()->id(),
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'amount_paid' => $request->amount_paid,
                    'change_given' => $changeGiven,
                    'status' => 'completed',
                ]);

                // Create sale items and update stock
                foreach ($items as $item) {
                    $product = $item['product'];
                    
                    // Create sale item
                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'purchase_price' => $product->purchase_price,
                        'selling_price' => $product->selling_price,
                        'quantity' => $item['quantity'],
                        'subtotal' => $item['subtotal'],
                    ]);

                    // Update stock and create movement record
                    $previousStock = $product->stock_quantity;
                    $newStock = $previousStock - $item['quantity'];
                    
                    $product->update(['stock_quantity' => $newStock]);

                    StockMovement::create([
                        'product_id' => $product->id,
                        'user_id' => auth()->id(),
                        'type' => 'out',
                        'quantity' => -$item['quantity'],
                        'previous_stock' => $previousStock,
                        'new_stock' => $newStock,
                        'reason' => 'Sale',
                        'notes' => "Sale #{$sale->sale_number}",
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'sale' => $sale->load('items'),
                    'message' => 'Sale processed successfully',
                ]);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
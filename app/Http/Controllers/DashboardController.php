<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request)
    {
        // If user is cashier, redirect to POS
        if (auth()->user()->isCashier()) {
            return redirect()->route('pos.index');
        }

        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        // Dashboard stats
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::active()->count(),
            'low_stock_products' => Product::lowStock()->count(),
            'total_categories' => Category::count(),
            'today_sales' => Sale::completed()->whereDate('created_at', $today)->sum('total_amount'),
            'today_orders' => Sale::completed()->whereDate('created_at', $today)->count(),
            'week_sales' => Sale::completed()->where('created_at', '>=', $thisWeek)->sum('total_amount'),
            'month_sales' => Sale::completed()->where('created_at', '>=', $thisMonth)->sum('total_amount'),
        ];

        // Calculate profits
        $todaySales = Sale::with('items')
            ->completed()
            ->whereDate('created_at', $today)
            ->get();
        
        $stats['today_profit'] = $todaySales->sum(fn($sale) => $sale->getTotalProfit());

        // Low stock products
        $lowStockProducts = Product::with('category')
            ->lowStock()
            ->active()
            ->limit(5)
            ->get();

        // Recent sales
        $recentSales = Sale::with('cashier')
            ->completed()
            ->latest()
            ->limit(5)
            ->get();

        // Sales chart data (last 7 days)
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $sales = Sale::completed()
                ->whereDate('created_at', $date)
                ->sum('total_amount');
            
            $salesData[] = [
                'date' => $date->format('M d'),
                'sales' => floatval($sales),
            ];
        }
        
        return Inertia::render('dashboard', [
            'stats' => $stats,
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
            'salesData' => $salesData,
        ]);
    }
}
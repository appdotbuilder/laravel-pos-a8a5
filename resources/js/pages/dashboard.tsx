import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface DashboardStats {
    total_products: number;
    active_products: number;
    low_stock_products: number;
    total_categories: number;
    today_sales: number;
    today_orders: number;
    today_profit: number;
    week_sales: number;
    month_sales: number;
}

interface LowStockProduct {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    min_stock_level: number;
    category: {
        name: string;
    };
}

interface RecentSale {
    id: number;
    sale_number: string;
    total_amount: number;
    created_at: string;
    cashier: {
        name: string;
    };
}

interface SalesDataPoint {
    date: string;
    sales: number;
}

interface Props {
    stats: DashboardStats;
    lowStockProducts: LowStockProduct[];
    recentSales: RecentSale[];
    salesData: SalesDataPoint[];
    [key: string]: unknown;
}

export default function Dashboard({ stats, lowStockProducts, recentSales, salesData }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            
            <AppShell>
                <div className="space-y-8">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Dashboard</h1>
                        <p className="text-gray-600">Overview of your store's performance</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Today's Sales */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-2xl mr-3">💰</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${stats.today_sales.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Today's Orders */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-2xl mr-3">🛍️</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.today_orders}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Today's Profit */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-2xl mr-3">📈</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today's Profit</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${stats.today_profit.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-2xl mr-3">⚠️</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {stats.low_stock_products}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-xl mr-3">📦</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {stats.total_products}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-xl mr-3">📂</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Categories</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {stats.total_categories}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-xl mr-3">📊</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Week Sales</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        ${stats.week_sales.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="text-xl mr-3">📅</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Month Sales</p>
                                    <p className="text-xl font-bold text-purple-600">
                                        ${stats.month_sales.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sales Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Sales Trend (Last 7 Days)</h3>
                            <div className="h-64 flex items-end space-x-2">
                                {salesData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div 
                                            className="bg-blue-500 rounded-t w-full min-h-[4px] mb-2"
                                            style={{ 
                                                height: `${Math.max(4, (data.sales / Math.max(...salesData.map(d => d.sales))) * 200)}px` 
                                            }}
                                        />
                                        <span className="text-xs text-gray-600 text-center">
                                            {data.date}
                                        </span>
                                        <span className="text-xs font-medium text-gray-800">
                                            ${data.sales.toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Low Stock Products */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Low Stock Products</h3>
                            <div className="space-y-3">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {product.category.name} • SKU: {product.sku}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-red-600">
                                                    {product.stock_quantity} left
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Min: {product.min_stock_level}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">✅ All products are well stocked!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Sales */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">🛍️ Recent Sales</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {recentSales.length > 0 ? (
                                recentSales.map((sale) => (
                                    <div key={sale.id} className="px-6 py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{sale.sale_number}</p>
                                            <p className="text-sm text-gray-600">
                                                Cashier: {sale.cashier.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">
                                                ${sale.total_amount.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(sale.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center">
                                    <p className="text-gray-500">No sales recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppShell>
        </>
    );
}
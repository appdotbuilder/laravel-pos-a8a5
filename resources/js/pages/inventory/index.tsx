import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    min_stock_level: number;
    category: Category;
}

interface User {
    id: number;
    name: string;
}

interface StockMovement {
    id: number;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    previous_stock: number;
    new_stock: number;
    reason: string;
    created_at: string;
    product: Product;
    user: User;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    lowStockProducts: Product[];
    recentMovements: StockMovement[];
    [key: string]: unknown;
}

export default function InventoryIndex({ products, lowStockProducts, recentMovements }: Props) {
    return (
        <>
            <Head title="Inventory Management" />
            
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Inventory Management</h1>
                        <p className="text-gray-600">Monitor and manage your product stock levels</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📦</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-lg font-bold">{products.meta?.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">⚠️</div>
                                <div>
                                    <p className="text-sm text-gray-600">Low Stock Items</p>
                                    <p className="text-lg font-bold text-red-600">{lowStockProducts?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📈</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Stock Value</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {products.data?.reduce((sum, product) => sum + product.stock_quantity, 0) || 0} units
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">🔄</div>
                                <div>
                                    <p className="text-sm text-gray-600">Recent Movements</p>
                                    <p className="text-lg font-bold text-blue-600">{recentMovements?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Low Stock Alert */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">⚠️ Low Stock Alert</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {lowStockProducts?.length > 0 ? (
                                    lowStockProducts.map((product) => (
                                        <div key={product.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        SKU: {product.sku} • {product.category.name}
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
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <p className="text-gray-500">✅ All products are well stocked!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Stock Movements */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">🔄 Recent Movements</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {recentMovements?.length > 0 ? (
                                    recentMovements.map((movement) => (
                                        <div key={movement.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{movement.product.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {movement.reason} • {movement.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(movement.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            movement.type === 'in' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : movement.type === 'out'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '='}{Math.abs(movement.quantity)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {movement.previous_stock} → {movement.new_stock}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <p className="text-gray-500">No recent stock movements.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">📦 Product Inventory</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Min Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.data?.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.category.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${
                                                    product.stock_quantity <= product.min_stock_level
                                                        ? 'text-red-600'
                                                        : 'text-gray-900'
                                                }`}>
                                                    {product.stock_quantity}
                                                    {product.stock_quantity <= product.min_stock_level && ' ⚠️'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.min_stock_level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    product.stock_quantity <= product.min_stock_level
                                                        ? 'bg-red-100 text-red-800'
                                                        : product.stock_quantity <= product.min_stock_level * 2
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {product.stock_quantity <= product.min_stock_level
                                                        ? 'Low Stock'
                                                        : product.stock_quantity <= product.min_stock_level * 2
                                                        ? 'Medium'
                                                        : 'Good'
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <nav className="flex justify-center space-x-2">
                                    {products.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-lg border ${
                                                link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {products.data?.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No inventory data found
                            </h3>
                            <p className="text-gray-600">
                                Add some products to start managing your inventory.
                            </p>
                        </div>
                    )}
                </div>
            </AppShell>
        </>
    );
}
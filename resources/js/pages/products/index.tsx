import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    selling_price: number;
    stock_quantity: number;
    min_stock_level: number;
    status: string;
    category: Category;
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
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
        status?: string;
        low_stock?: boolean;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    return (
        <>
            <Head title="Products" />
            
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">📦 Products</h1>
                            <p className="text-gray-600">Manage your product inventory</p>
                        </div>
                        <Link href={route('products.create')}>
                            <Button>Add Product</Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📊</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-lg font-bold">{products.meta?.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">✅</div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Products</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {products.data?.filter(p => p.status === 'active').length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">⚠️</div>
                                <div>
                                    <p className="text-sm text-gray-600">Low Stock</p>
                                    <p className="text-lg font-bold text-red-600">
                                        {products.data?.filter(p => p.stock_quantity <= p.min_stock_level).length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📂</div>
                                <div>
                                    <p className="text-sm text-gray-600">Categories</p>
                                    <p className="text-lg font-bold">{categories?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue={filters.search || ''}
                            />
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue={filters.category_id || ''}
                            >
                                <option value="">All Categories</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue={filters.status || ''}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="low_stock"
                                    className="mr-2"
                                    defaultChecked={filters.low_stock || false}
                                />
                                <label htmlFor="low_stock" className="text-sm text-gray-700">
                                    Show only low stock
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.data?.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                SKU: {product.sku}
                                            </p>
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                {product.category.name}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                product.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Price:</span>
                                            <span className="text-sm font-medium text-green-600">
                                                ${product.selling_price.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Stock:</span>
                                            <span className={`text-sm font-medium ${
                                                product.stock_quantity <= product.min_stock_level
                                                    ? 'text-red-600'
                                                    : 'text-gray-900'
                                            }`}>
                                                {product.stock_quantity}
                                                {product.stock_quantity <= product.min_stock_level && ' ⚠️'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link 
                                            href={route('products.show', product.id)}
                                            className="flex-1"
                                        >
                                            <Button variant="outline" size="sm" className="w-full">
                                                View
                                            </Button>
                                        </Link>
                                        <Link 
                                            href={route('products.edit', product.id)}
                                            className="flex-1"
                                        >
                                            <Button size="sm" className="w-full">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {products.data?.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Get started by adding your first product.
                            </p>
                            <Link href={route('products.create')}>
                                <Button>Add Product</Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="flex justify-center">
                            <nav className="flex space-x-2">
                                {products.links.map((link, index) => (
                                    <Link
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
            </AppShell>
        </>
    );
}
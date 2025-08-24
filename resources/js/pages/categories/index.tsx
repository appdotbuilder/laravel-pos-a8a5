import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
    description: string | null;
    products_count: number;
    created_at: string;
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
    categories: {
        data: Category[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

export default function CategoriesIndex({ categories }: Props) {
    return (
        <>
            <Head title="Categories" />
            
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">📂 Categories</h1>
                            <p className="text-gray-600">Organize your products into categories</p>
                        </div>
                        <Link href={route('categories.create')}>
                            <Button>Add Category</Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📂</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Categories</p>
                                    <p className="text-lg font-bold">{categories.meta?.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📦</div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {categories.data?.reduce((sum, cat) => sum + cat.products_count, 0) || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="text-xl mr-2">📊</div>
                                <div>
                                    <p className="text-sm text-gray-600">Avg Products/Category</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {categories.data?.length > 0 
                                            ? Math.round(categories.data.reduce((sum, cat) => sum + cat.products_count, 0) / categories.data.length)
                                            : 0
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.data?.map((category) => (
                            <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-600">Products:</span>
                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {category.products_count}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            Created {new Date(category.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link 
                                            href={route('categories.show', category.id)}
                                            className="flex-1"
                                        >
                                            <Button variant="outline" size="sm" className="w-full">
                                                View
                                            </Button>
                                        </Link>
                                        <Link 
                                            href={route('categories.edit', category.id)}
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
                    {categories.data?.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-4xl mb-4">📂</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No categories found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Create your first category to organize your products.
                            </p>
                            <Link href={route('categories.create')}>
                                <Button>Add Category</Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {categories.links && categories.links.length > 3 && (
                        <div className="flex justify-center">
                            <nav className="flex space-x-2">
                                {categories.links.map((link, index) => (
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
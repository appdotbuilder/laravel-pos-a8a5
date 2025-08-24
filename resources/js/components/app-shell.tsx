import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'cashier';
}

interface SharedData {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

interface AppShellProps {
    children: React.ReactNode;
    variant?: string;
}

export function AppShell({ children, variant }: AppShellProps) {
    const { auth } = usePage<SharedData>().props;
    
    // If called with variant="sidebar", return just the children for compatibility
    if (variant === "sidebar") {
        return <>{children}</>;
    }
    const user = auth?.user;

    const isAdmin = user?.role === 'admin';

    const navigation = [
        {
            name: '🏠 Dashboard',
            href: route('dashboard'),
            show: isAdmin
        },
        {
            name: '🛍️ Point of Sale',
            href: route('pos.index'),
            show: true
        },
        {
            name: '📦 Products',
            href: route('products.index'),
            show: isAdmin
        },
        {
            name: '📂 Categories',
            href: route('categories.index'),
            show: isAdmin
        },
        {
            name: '📊 Inventory',
            href: route('inventory.index'),
            show: isAdmin
        }
    ].filter(item => item.show);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <AppLogo className="h-8 w-8" />
                            <h1 className="text-xl font-bold text-gray-900">POS System</h1>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{user?.name}</span>
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {user?.role}
                                </span>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Button variant="outline" size="sm">
                                    Logout
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t">
                    <div className="px-4 py-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}

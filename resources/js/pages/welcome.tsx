import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';

export default function Welcome() {
    return (
        <>
            <Head title="POS System - Welcome" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <AppLogo className="h-8 w-8" />
                                <h1 className="text-xl font-bold text-gray-900">POS System</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('login')}
                                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link href={route('register')}>
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            🛒 Modern Point of Sale
                            <span className="block text-blue-600">System</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Complete retail management solution with inventory tracking, 
                            sales reporting, and multi-user access control. Perfect for 
                            small to medium-sized businesses.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link href={route('register')}>
                                <Button size="lg" className="w-full sm:w-auto">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link href={route('login')}>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Admin Features */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-3xl mb-4">👨‍💼</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Dashboard</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>✅ Complete product management</li>
                                <li>✅ Category organization</li>
                                <li>✅ Inventory control</li>
                                <li>✅ Sales analytics & reports</li>
                                <li>✅ Profit/loss tracking</li>
                            </ul>
                        </div>

                        {/* Cashier Features */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-3xl mb-4">🛍️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Point of Sale</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>✅ Fast product search</li>
                                <li>✅ Barcode/SKU scanning</li>
                                <li>✅ Shopping cart management</li>
                                <li>✅ Quick checkout process</li>
                                <li>✅ Receipt generation</li>
                            </ul>
                        </div>

                        {/* Inventory Features */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-3xl mb-4">📦</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Inventory Management</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>✅ Real-time stock levels</li>
                                <li>✅ Low stock alerts</li>
                                <li>✅ Stock movement tracking</li>
                                <li>✅ Purchase/selling prices</li>
                                <li>✅ Automated calculations</li>
                            </ul>
                        </div>

                        {/* Reporting Features */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-3xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sales Reports</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>✅ Daily/weekly/monthly reports</li>
                                <li>✅ Profit margin analysis</li>
                                <li>✅ Export to Excel/PDF</li>
                                <li>✅ Performance dashboards</li>
                                <li>✅ Custom date ranges</li>
                            </ul>
                        </div>

                        {/* User Management */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-3xl mb-4">🔐</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">User Management</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>✅ Role-based access</li>
                                <li>✅ Admin & cashier roles</li>
                                <li>✅ Secure authentication</li>
                                <li>✅ Activity tracking</li>
                                <li>✅ Permission control</li>
                            </ul>
                        </div>

                        {/* Modern Interface */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-3xl mb-4">✨</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Interface</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li>✅ Clean, intuitive design</li>
                                <li>✅ Responsive layout</li>
                                <li>✅ Fast performance</li>
                                <li>✅ Easy navigation</li>
                                <li>✅ Mobile-friendly</li>
                            </ul>
                        </div>
                    </div>

                    {/* Screenshots/Mockups */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                            See It In Action
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Dashboard Preview */}
                            <div className="text-center">
                                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                                    <div className="text-gray-500">
                                        <div className="text-4xl mb-2">📈</div>
                                        <p className="font-medium">Admin Dashboard</p>
                                        <p className="text-sm">Sales analytics & inventory overview</p>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">Complete Business Overview</h3>
                                <p className="text-gray-600">Monitor sales, track inventory, and analyze performance from one centralized dashboard.</p>
                            </div>

                            {/* POS Preview */}
                            <div className="text-center">
                                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                                    <div className="text-gray-500">
                                        <div className="text-4xl mb-2">🖥️</div>
                                        <p className="font-medium">POS Interface</p>
                                        <p className="text-sm">Fast & efficient checkout</p>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">Streamlined Point of Sale</h3>
                                <p className="text-gray-600">Quick product search, easy cart management, and instant checkout for faster customer service.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center mt-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Transform Your Business? 🚀
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of businesses using our POS system to streamline operations and boost sales.
                        </p>
                        <Link href={route('register')}>
                            <Button size="lg" className="text-lg px-8 py-3">
                                Get Started Today - It's Free!
                            </Button>
                        </Link>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center text-gray-600">
                            <p>&copy; 2024 POS System. Built with Laravel & React.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface Product {
    id: number;
    name: string;
    sku: string;
    selling_price: number;
    stock_quantity: number;
    category: {
        name: string;
    };
}

interface CartItem extends Product {
    quantity: number;
    subtotal: number;
}

export default function PosIndex(): React.JSX.Element {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [amountPaid, setAmountPaid] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const taxAmount = 0; // Can be configured later
    const total = subtotal + taxAmount;
    const changeAmount = Math.max(0, parseFloat(amountPaid) - total);

    const searchProducts = async (query: string) => {
        if (query.length < 1) {
            setProducts([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/pos?query=${encodeURIComponent(query)}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Search error:', error);
            setProducts([]);
        } finally {
            setIsSearching(false);
        }
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock_quantity) {
                alert('Not enough stock available');
                return;
            }
            
            const updatedCart = cart.map(item => 
                item.id === product.id 
                    ? { 
                        ...item, 
                        quantity: item.quantity + 1,
                        subtotal: (item.quantity + 1) * item.selling_price
                      }
                    : item
            );
            setCart(updatedCart);
        } else {
            const cartItem: CartItem = {
                ...product,
                quantity: 1,
                subtotal: product.selling_price
            };
            setCart([...cart, cartItem]);
        }

        // Clear search
        setSearchQuery('');
        setProducts([]);
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        const product = cart.find(item => item.id === productId);
        if (!product) return;

        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (newQuantity > product.stock_quantity) {
            alert('Not enough stock available');
            return;
        }

        const updatedCart = cart.map(item => 
            item.id === productId 
                ? { 
                    ...item, 
                    quantity: newQuantity,
                    subtotal: newQuantity * item.selling_price
                  }
                : item
        );
        setCart(updatedCart);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setAmountPaid('');
    };

    const processSale = async () => {
        if (cart.length === 0) {
            alert('Cart is empty');
            return;
        }

        const paidAmount = parseFloat(amountPaid);
        if (isNaN(paidAmount) || paidAmount < total) {
            alert('Please enter a valid payment amount');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/pos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity
                    })),
                    amount_paid: paidAmount
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(`Sale completed successfully!\nSale #: ${result.sale.sale_number}\nChange: $${changeAmount.toFixed(2)}`);
                clearCart();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Sale processing error:', error);
            alert('Failed to process sale. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Head title="Point of Sale" />
            
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🛍️ Point of Sale</h1>
                        <p className="text-gray-600">Search products and process sales</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Side - Product Search */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Search Bar */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Product Search</h2>
                                <input
                                    type="text"
                                    placeholder="Search by product name or SKU..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        searchProducts(e.target.value);
                                    }}
                                />
                                
                                {/* Search Results */}
                                {searchQuery && (
                                    <div className="mt-4 border rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500">Searching...</div>
                                        ) : products.length > 0 ? (
                                            products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="p-4 border-b last:border-b-0 hover:bg-white cursor-pointer transition-colors"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                SKU: {product.sku} • {product.category.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Stock: {product.stock_quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-green-600">
                                                                ${product.selling_price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No products found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Quick Add Instructions */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Type product name or SKU to search</li>
                                    <li>• Click on search results to add to cart</li>
                                    <li>• Adjust quantities in the cart on the right</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Side - Shopping Cart */}
                        <div className="space-y-6">
                            {/* Cart */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">🛒 Cart ({cart.length})</h2>
                                    {cart.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearCart}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cart.length > 0 ? (
                                        cart.map((item) => (
                                            <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                                                        <p className="text-xs text-gray-600">SKU: {item.sku}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                    <p className="font-semibold text-green-600">
                                                        ${item.subtotal.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            Cart is empty
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Checkout */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">💳 Checkout</h2>
                                
                                {/* Totals */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-green-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment Input */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Amount Paid
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={amountPaid}
                                            onChange={(e) => setAmountPaid(e.target.value)}
                                        />
                                    </div>

                                    {/* Change Display */}
                                    {amountPaid && parseFloat(amountPaid) >= total && (
                                        <div className="bg-green-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-green-800">Change:</span>
                                                <span className="font-bold text-green-600 text-lg">
                                                    ${changeAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Process Sale Button */}
                                    <Button
                                        onClick={processSale}
                                        disabled={cart.length === 0 || !amountPaid || parseFloat(amountPaid) < total || isProcessing}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isProcessing ? 'Processing...' : 'Process Sale'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppShell>
        </>
    );
}
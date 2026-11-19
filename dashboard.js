function ensureDefaultData() {
            if (!localStorage.getItem('inventoryItems')) {
                const defaultInventory = [
                    { sku: 'PRD-101', name: 'Fresh Apple', category: 'Fruit', qty: 45, price: 2.00 },
                    { sku: 'PRD-102', name: 'Carrot', category: 'Vegetable', qty: 4, price: 1.50 },
                    { sku: 'PRD-103', name: 'Potato Chips', category: 'Snack', qty: 28, price: 4.50 },
                    { sku: 'PRD-104', name: 'Mineral Water', category: 'Drink', qty: 50, price: 1.50 },
                    { sku: 'PRD-105', name: 'Orange Juice', category: 'Drink', qty: 0, price: 1.50 },
                    { sku: 'PRD-106', name: 'Banana', category: 'Fruit', qty: 20, price: 2.00 },
                    { sku: 'PRD-107', name: 'Cabbage', category: 'Vegetable', qty: 0, price: 4.50 },
                    { sku: 'PRD-108', name: 'Snickerz', category: 'Snack', qty: 30, price: 2.50 },
                    { sku: 'PRD-109', name: 'Soy Milk', category: 'Drink', qty: 12, price: 2.80 },
                    { sku: 'PRD-110', name: 'Gummy', category: 'Snack', qty: 15, price: 3.50 }

                ];
                localStorage.setItem('inventoryItems', JSON.stringify(defaultInventory));
            }
        }


        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'index.html';
        } else {
            ensureDefaultData();
        }

        document.addEventListener('DOMContentLoaded', function() {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                return;
            }
            ensureDefaultData();

            const username = localStorage.getItem('username') || 'User';
            const userRole = localStorage.getItem('userRole') || 'Staff';
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.innerHTML = `Welcome, <strong>${username}</strong> (${userRole.toUpperCase()})`;
            }
            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                localStorage.removeItem('userRole');

                window.location.href = 'index.html';
            });

            // Cards
            const inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            let totalProducts = inventory.length;
            let lowStock = 0;
            let healthyStock = 0;

            inventory.forEach(item => {
                if (item.qty === 0 || item.qty <= 5) {
                    lowStock++;
                } else {
                    healthyStock++;
                }
            });

            document.getElementById('totalProductsCount').textContent = totalProducts;
            document.getElementById('lowStockCount').textContent = lowStock;
            document.getElementById('healthyStockCount').textContent = healthyStock;
        });
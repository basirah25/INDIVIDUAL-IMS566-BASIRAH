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

            if (!localStorage.getItem('salesHistory')) {
                const defaultSales = [
                    {
                        txnId: 'TXN-1001',
                        date: '2026-11-19 14:30',
                        name: 'Fresh Apple',
                        type: 'Item Sold',
                        change: '-5',
                        actor: 'Manager (manager)'
                    }
                ];
                localStorage.setItem('salesHistory', JSON.stringify(defaultSales));
            }
        }

        // Security check
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'index.html';
        } else {
            ensureDefaultData();
        }

        const username = localStorage.getItem('username') || 'User';
        const userRole = localStorage.getItem('userRole') || 'Staff';
        document.getElementById('userInfo').innerHTML = `Welcome, <strong>${username}</strong> (${userRole.toUpperCase()})`;

        // Logout preserving persistent storage data
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });

        function generateNextSku() {
            ensureDefaultData();
            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];

            let numbers = inventory.map(item => {
                const match = item.sku.match(/\d+/);
                return match ? parseInt(match[0], 10) : null;
            }).filter(num => num !== null).sort((a, b) => a - b);

            let expected = 101;

            for (let i = 0; i < numbers.length; i++) {
                if (numbers[i] > expected) {
                    return `PRD-${expected}`;
                }
                expected = numbers[i] + 1;
            }

            return `PRD-${expected}`;
        }

        // When opening the Add Item modal, auto-fill the next SKU
        document.getElementById('openAddModalBtn').addEventListener('click', function() {
            document.getElementById('newItemSku').value = generateNextSku();
        });

        // Render Inventory Table from localStorage
        function renderInventoryTable() {
            ensureDefaultData();
            const tableBody = document.getElementById('inventoryTableBody');
            tableBody.innerHTML = '';

            const inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];

            inventory.forEach(item => {
                let statusBadge = '<span class="badge bg-success-subtle text-success border border-success">In Stock</span>';
                let badgeClass = 'bg-success';
                if (item.qty === 0) {
                    statusBadge = '<span class="badge bg-danger-subtle text-danger border border-danger">Out of Stock</span>';
                    badgeClass = 'bg-danger';
                } else if (item.qty <= 5) {
                    statusBadge = '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning">Low Stock</span>';
                    badgeClass = 'bg-warning text-dark';
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><code class="text-danger">${item.sku}</code></td>
                    <td class="fw-semibold">${item.name}</td>
                    <td>${item.category}</td>
                    <td class="text-center"><span class="badge ${badgeClass} px-3 py-2 fs-6">${item.qty}</span></td>
                    <td>RM ${parseFloat(item.price).toFixed(2)}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="openManageModal('${item.sku}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        renderInventoryTable();

        // 1. Add New Item Form Handler
        document.getElementById('addItemForm').addEventListener('submit', function(e) {
            e.preventDefault();
            ensureDefaultData();

            const sku = document.getElementById('newItemSku').value.trim();
            const name = document.getElementById('newItemName').value.trim();
            const category = document.getElementById('newItemCategory').value;
            const qty = parseInt(document.getElementById('newItemQty').value);
            const price = parseFloat(document.getElementById('newItemPrice').value);
            const errorAlert = document.getElementById('addItemError');

            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

            // Add new item
            inventory.push({ sku, name, category, qty, price });
            localStorage.setItem('inventoryItems', JSON.stringify(inventory));

            // Log restock activity for the new item
            const now = new Date();
            const dateTimeStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
            const txnId = 'TXN-' + Math.floor(1000 + Math.random() * 9000);

            salesHistory.unshift({
                txnId: txnId,
                date: dateTimeStr,
                name: name,
                type: 'Restocked',
                change: `+${qty}`,
                actor: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} (${username})`
            });
            localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

            renderInventoryTable();

            // Reset form
            document.getElementById('addItemForm').reset();
            errorAlert.classList.add('d-none');
            const modalElement = document.getElementById('addItemModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });

        // 2. Open Manage Modal (Restock / Change Price / Delete)
        function openManageModal(sku) {
            ensureDefaultData();
            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            const item = inventory.find(p => p.sku === sku);
            if (!item) return;

            document.getElementById('manageSku').value = item.sku;
            document.getElementById('manageItemNameDisplay').textContent = `${item.name} (SKU: ${item.sku})`;
            document.getElementById('restockQtyInput').value = '';
            document.getElementById('newPriceInput').value = item.price;

            const manageModal = new bootstrap.Modal(document.getElementById('manageItemModal'));
            manageModal.show();
        }

        // 3. Handle Restock from Manage Modal
        document.getElementById('restockForm').addEventListener('submit', function(e) {
            e.preventDefault();
            ensureDefaultData();

            const sku = document.getElementById('manageSku').value;
            const addQty = parseInt(document.getElementById('restockQtyInput').value);

            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

            const item = inventory.find(p => p.sku === sku);
            if (!item) return;

            item.qty += addQty;
            localStorage.setItem('inventoryItems', JSON.stringify(inventory));

            // Log restock transaction
            const now = new Date();
            const dateTimeStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
            const txnId = 'TXN-' + Math.floor(1000 + Math.random() * 9000);

            salesHistory.unshift({
                txnId: txnId,
                date: dateTimeStr,
                name: item.name,
                type: 'Restocked',
                change: `+${addQty}`,
                actor: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} (${username})`
            });
            localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

            renderInventoryTable();

            // Close modal
            const modalElement = document.getElementById('manageItemModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });

        // 4. Handle Change Price from Manage Modal
        document.getElementById('changePriceForm').addEventListener('submit', function(e) {
            e.preventDefault();
            ensureDefaultData();

            const sku = document.getElementById('manageSku').value;
            const newPrice = parseFloat(document.getElementById('newPriceInput').value);

            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            const item = inventory.find(p => p.sku === sku);
            if (!item) return;

            item.price = newPrice;
            localStorage.setItem('inventoryItems', JSON.stringify(inventory));

            renderInventoryTable();

            // Close modal
            const modalElement = document.getElementById('manageItemModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });

        // 5. Handle Delete Item from Manage Modal
        document.getElementById('deleteItemBtn').addEventListener('click', function() {
            ensureDefaultData();
            const sku = document.getElementById('manageSku').value;

            if (!confirm("Are you sure you want to delete this item from inventory?")) {
                return;
            }

            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            inventory = inventory.filter(p => p.sku !== sku);
            localStorage.setItem('inventoryItems', JSON.stringify(inventory));

            renderInventoryTable();

            // Close modal
            const modalElement = document.getElementById('manageItemModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
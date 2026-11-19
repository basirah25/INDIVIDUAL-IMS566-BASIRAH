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

            if (localStorage.getItem('salesHistoryCleared') === 'true') {
                if (!localStorage.getItem('salesHistory')) {
                    localStorage.setItem('salesHistory', JSON.stringify([]));
                }
                return;
            }

            let existingSales = null;
            try {
                existingSales = JSON.parse(localStorage.getItem('salesHistory'));
            } catch (e) {
                existingSales = null;
            }

            if (!Array.isArray(existingSales) || existingSales.length === 0) {
                const defaultSales = [
                    {
                        txnId: 'TXN-1004',
                        date: '2026-11-19 16:45',
                        name: 'Potato Chips',
                        type: 'Item Sold',
                        change: '-4',
                        actor: 'Manager (manager)'
                    },
                    {
                        txnId: 'TXN-1003',
                        date: '2026-11-19 15:20',
                        name: 'Mineral Water',
                        type: 'Restocked',
                        change: '+20',
                        actor: 'Boss (boss)'
                    },
                    {
                        txnId: 'TXN-1002',
                        date: '2026-11-19 14:30',
                        name: 'Fresh Apple',
                        type: 'Item Sold',
                        change: '-5',
                        actor: 'Manager (manager)'
                    },
                    {
                        txnId: 'TXN-1001',
                        date: '2026-11-19 11:10',
                        name: 'Carrot',
                        type: 'Item Sold',
                        change: '-3',
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

        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });

        // Render Sales Table from localStorage
        function renderSalesTable() {
            ensureDefaultData();
            const salesTableBody = document.getElementById('salesTableBody');
            salesTableBody.innerHTML = '';

            const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

            if (salesHistory.length === 0) {
                salesTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No transactions recorded yet.</td></tr>`;
                return;
            }

            salesHistory.forEach(txn => {
                const badgeClass = txn.type === 'Restocked' ? 'bg-success' : 'bg-danger';
                const changeClass = txn.type === 'Restocked' ? 'text-success' : 'text-danger';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><code>${txn.txnId}</code></td>
                    <td>${txn.date}</td>
                    <td class="fw-semibold">${txn.name}</td>
                    <td><span class="badge ${badgeClass}">${txn.type}</span></td>
                    <td class="text-center ${changeClass} fw-bold">${txn.change}</td>
                    <td>${txn.actor}</td>
                `;
                salesTableBody.appendChild(row);
            });
        }

        // Render table on page load
        renderSalesTable();

        // Clear Log Button Handler
        document.getElementById('clearSalesBtn').addEventListener('click', function() {
            if (confirm("Are you sure you want to clear the sales history?")) {
                localStorage.setItem('salesHistoryCleared', 'true');
                localStorage.setItem('salesHistory', JSON.stringify([]));
                renderSalesTable();
            }
        });

        // Populate dropdown dynamically from localStorage inventory when modal opens
        function loadInventoryDropdown() {
            ensureDefaultData();
            const selectDropdown = document.getElementById('saleProductSelect');
            selectDropdown.innerHTML = '<option value="" disabled selected>Choose item...</option>';

            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];

            inventory.forEach(item => {
                const option = document.createElement('option');
                option.value = item.sku;
                option.textContent = `${item.name} (Available: ${item.qty})`;
                selectDropdown.appendChild(option);
            });
        }

        document.getElementById('recordSaleModal').addEventListener('show.bs.modal', loadInventoryDropdown);

        // Handle Sale Form Submission & Stock Validation
        document.getElementById('saleForm').addEventListener('submit', function(e) {
            e.preventDefault();
            ensureDefaultData();

            const selectedSku = document.getElementById('saleProductSelect').value;
            const qtySold = parseInt(document.getElementById('saleQtyInput').value);
            const errorAlert = document.getElementById('saleErrorAlert');

            let inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];
            let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

            const product = inventory.find(p => p.sku === selectedSku);

            if (!product) {
                errorAlert.textContent = "Selected product not found.";
                errorAlert.classList.remove('d-none');
                return;
            }

            // Validation: Check if quantity sold exceeds current stock
            if (qtySold > product.qty) {
                errorAlert.textContent = `Error: Cannot sell ${qtySold} units. Only ${product.qty} units available in stock for ${product.name}.`;
                errorAlert.classList.remove('d-none');
                return;
            }

            // Deduct quantity from inventory and save
            product.qty -= qtySold;
            localStorage.setItem('inventoryItems', JSON.stringify(inventory));

            // Format current date and time
            const now = new Date();
            const dateTimeStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
            const txnId = 'TXN-' + Math.floor(1000 + Math.random() * 9000);

            // Add new transaction to salesHistory array
            salesHistory.unshift({
                txnId: txnId,
                date: dateTimeStr,
                name: product.name,
                type: 'Item Sold',
                change: `-${qtySold}`,
                actor: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} (${username})`
            });

            localStorage.removeItem('salesHistoryCleared');
            localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

            // Re-render table to show the new sale
            renderSalesTable();

            // Reset form, hide error, and close modal
            document.getElementById('saleForm').reset();
            errorAlert.classList.add('d-none');

            const modalElement = document.getElementById('recordSaleModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
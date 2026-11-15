
document.addEventListener('DOMContentLoaded', function() {
    const ctxDoughnut = document.getElementById('stockDoughnutChart');
    if (ctxDoughnut) {
        // Fetch inventory from localStorage
        const inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];

        let healthyCount = 0;
        let lowStockCount = 0;
        let outOfStockCount = 0;

        inventory.forEach(item => {
            const qty = parseInt(item.qty || 0);
            if (qty === 0) {
                outOfStockCount++;
            } else if (qty <= 5) {
                lowStockCount++;
            } else {
                healthyCount++;
            }
        });

        new Chart(ctxDoughnut.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Healthy Stock', 'Low Stock', 'Out of Stock'],
                datasets: [{
                    data: [healthyCount, lowStockCount, outOfStockCount],
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
});
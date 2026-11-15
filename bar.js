
document.addEventListener('DOMContentLoaded', function() {
    const ctxBar = document.getElementById('stockBarChart');
    if (ctxBar) {

        const inventory = JSON.parse(localStorage.getItem('inventoryItems')) || [];

        const categories = ['Fruit', 'Vegetable', 'Snack', 'Drink'];
        
        const categoryTotals = categories.map(cat => {
            return inventory
                .filter(item => item.category === cat)
                .reduce((sum, item) => sum + parseInt(item.qty || 0), 0);
        });

        new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Total Units in Stock',
                    data: categoryTotals,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',   // Fruit (Pink/Red)
                        'rgba(129, 215, 246, 0.7)',   // Vegetable (Teal)
                        'rgba(255, 206, 86, 0.7)',   // Snack (Yellow)
                        'rgba(153, 102, 255, 0.7)'   // Drink (Purple)
                    ],
                    borderColor: [
                        'rgb(169, 13, 47)',
                        'rgb(48, 108, 227)',
                        'rgb(217, 158, 10)',
                        'rgb(111, 44, 245)'
                    ],
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

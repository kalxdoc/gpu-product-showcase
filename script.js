/**
 * c:\Users\shafi\code\MC\script.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-price');
    const container = document.querySelector('.card-container');

    // Ensure elements exist before running logic
    if (!sortSelect || !container) return;

    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        // Get all card elements as an array
        const cards = Array.from(container.querySelectorAll('.product-card'));

        cards.sort((a, b) => {
            // Extract price text, remove non-numeric characters (except dot), and parse
            const priceTextA = a.querySelector('.price').innerText;
            const priceTextB = b.querySelector('.price').innerText;

            const priceA = parseFloat(priceTextA.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(priceTextB.replace(/[^0-9.]/g, ''));

            if (sortValue === 'low-high') {
                return priceA - priceB;
            } else if (sortValue === 'high-low') {
                return priceB - priceA;
            }
            return 0; // Default/Original order (could be improved by storing original index)
        });

        // Re-append cards to the container in the new order
        cards.forEach(card => container.appendChild(card));
    });
});

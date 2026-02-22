/**
 * c:\Users\shafi\code\MC\script.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-price');
    const container = document.querySelector('.card-container');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Theme toggle logic
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = 'Toggle Light Mode';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = 'Toggle Dark Mode';
            }
        });
    }

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(themeToggleBtn) themeToggleBtn.textContent = 'Toggle Light Mode';
    }

    // --- Cart Persistence Logic ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // --- Product List Page Logic ---
    if (sortSelect && container) {
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            const cards = Array.from(container.querySelectorAll('.product-card'));

            cards.sort((a, b) => {
                const priceTextA = a.querySelector('.price').innerText;
                const priceTextB = b.querySelector('.price').innerText;
                const priceA = parseFloat(priceTextA.replace(/[^0-9.]/g, ''));
                const priceB = parseFloat(priceTextB.replace(/[^0-9.]/g, ''));

                if (sortValue === 'low-high') return priceA - priceB;
                if (sortValue === 'high-low') return priceB - priceA;
                return 0;
            });

            cards.forEach(card => container.appendChild(card));
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const name = card.querySelector('h2').innerText;
                const priceText = card.querySelector('.price').innerText;
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

                addToCart({ name, price });
                alert(`${name} added to cart!`);
            });
        });

        function addToCart(product) {
            const existingItem = cart.find(item => item.name === product.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart();
        }
    }

    // --- Cart Page Logic ---
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');

    if (cartItemsContainer && cartTotalPriceEl) {
        function renderCart() {
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            }

            cart.forEach(item => {
                totalPrice += item.price * item.quantity;
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.innerHTML = `
                    <div class="cart-item-details">
                        <strong>${item.name}</strong> - ৳ ${item.price.toLocaleString()}
                    </div>
                    <div class="quantity-slider">
                        <button class="quantity-btn" data-name="${item.name}" data-change="-1">-</button>
                        <div class="quantity-number"><span>${item.quantity}</span></div>
                        <button class="quantity-btn" data-name="${item.name}" data-change="1">+</button>
                    </div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });

            cartTotalPriceEl.innerText = `৳ ${totalPrice.toLocaleString()}`;

            // Add event listeners to newly created elements
            cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const name = e.target.dataset.name;
                    const change = parseInt(e.target.dataset.change);
                    updateQuantity(name, change);
                });
            });

            cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const name = e.target.dataset.name;
                    removeFromCart(name);
                });
            });
        }

        function updateQuantity(name, change) {
            const item = cart.find(item => item.name === name);
            if (!item) return;
            
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) {
                removeFromCart(name);
                return;
            }
            
            item.quantity = newQuantity;
            saveCart();
            renderCart();
        }

        function removeFromCart(name) {
            cart = cart.filter(item => item.name !== name);
            saveCart();
            renderCart();
        }

        renderCart();
    }
});

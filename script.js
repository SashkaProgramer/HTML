// Массив с товарами
const products = [
    {
        id: 1,
        title: "Смартфон XYZ Pro",
        price: 29999,
        image: "https://via.placeholder.com/300x200.png?text=Смартфон+XYZ+Pro",
        category: "electronics",
        description: "Мощный смартфон с большим экраном и долгой работой от аккумулятора.",
    },
    {
        id: 2,
        title: "Ноутбук PowerBook",
        price: 59999,
        image: "https://via.placeholder.com/300x200.png?text=Ноутбук+PowerBook",
        category: "electronics",
        description: "Производительный ноутбук для работы и развлечений.",
    },
    {
        id: 3,
        title: "Беспроводные наушники SoundX",
        price: 7999,
        image: "https://via.placeholder.com/300x200.png?text=Наушники+SoundX",
        category: "electronics",
        description: "Высококачественные наушники с активным шумоподавлением.",
    },
    {
        id: 4,
        title: "Футболка Classic",
        price: 1299,
        image: "https://via.placeholder.com/300x200.png?text=Футболка+Classic",
        category: "clothing",
        description: "Стильная хлопковая футболка классического кроя.",
    },
    {
        id: 5,
        title: "Джинсы Modern",
        price: 2999,
        image: "https://via.placeholder.com/300x200.png?text=Джинсы+Modern",
        category: "clothing",
        description: "Современные джинсы из качественного денима.",
    },
    {
        id: 6,
        title: "Куртка Winter",
        price: 5999,
        image: "https://via.placeholder.com/300x200.png?text=Куртка+Winter",
        category: "clothing",
        description: "Теплая зимняя куртка с водоотталкивающим покрытием.",
    },
    {
        id: 7,
        title: "Набор посуды HomeChef",
        price: 4599,
        image: "https://via.placeholder.com/300x200.png?text=Набор+посуды+HomeChef",
        category: "home",
        description: "Комплект качественной посуды для вашей кухни.",
    },
    {
        id: 8,
        title: "Светильник Ambient",
        price: 2199,
        image: "https://via.placeholder.com/300x200.png?text=Светильник+Ambient",
        category: "home",
        description: "Стильный светильник для создания уютной атмосферы.",
    },
    {
        id: 9,
        title: "Комплект постельного белья Dream",
        price: 3499,
        image: "https://via.placeholder.com/300x200.png?text=Постельное+белье+Dream",
        category: "home",
        description: "Мягкое постельное белье из натуральных материалов.",
    }
];

// Корзина
let cart = [];

// DOM-элементы
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const closeModal = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkout-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');

// Отображение товаров
function displayProducts(category = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${formatPrice(product.price)} ₽</p>
                <p>${product.description}</p>
                <button class="btn add-to-cart" data-id="${product.id}">
                    В корзину <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Добавляем обработчики событий для кнопок "В корзину"
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Добавление товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${product.title} добавлен в корзину`);
    saveCartToLocalStorage();
}

// Обновление количества товаров в корзине
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Отображение корзины
function displayCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Ваша корзина пуста</p>';
        cartTotalPrice.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">${formatPrice(item.price)} ₽</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = formatPrice(total);
    
    // Добавляем обработчики событий для кнопок в корзине
    const minusBtns = document.querySelectorAll('.minus');
    const plusBtns = document.querySelectorAll('.plus');
    const removeBtns = document.querySelectorAll('.remove-btn');
    
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(productId);
        });
    });
    
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            increaseQuantity(productId);
        });
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Увеличение количества товара в корзине
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCartCount();
        displayCart();
        saveCartToLocalStorage();
    }
}

// Уменьшение количества товара в корзине
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity--;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        updateCartCount();
        displayCart();
        saveCartToLocalStorage();
    }
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCart();
    saveCartToLocalStorage();
}

// Сохранение корзины в localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Загрузка корзины из localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Обработчики событий

// Открытие модального окна корзины
document.querySelector('.cart a').addEventListener('click', function(e) {
    e.preventDefault();
    displayCart();
    cartModal.style.display = 'block';
});

// Закрытие модального окна корзины
closeModal.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Фильтрация товаров
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Удаляем класс active у всех кнопок и добавляем текущей
        filterBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        displayProducts(category);
    });
});

// Оформление заказа
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Ваша корзина пуста');
        return;
    }
    
    alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
    cart = [];
    updateCartCount();
    displayCart();
    cartModal.style.display = 'none';
    saveCartToLocalStorage();
});

// Отправка формы обратной связи
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Здесь можно добавить отправку данных формы на сервер
        alert(`Спасибо за сообщение, ${name}! Мы свяжемся с вами по адресу ${email} в ближайшее время.`);
        
        // Очистка формы
        this.reset();
    });
}

// Добавление стилей для уведомлений
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4a6ee0;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromLocalStorage();
}); 
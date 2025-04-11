// Carrito de compras
let cart = [];

// Función para actualizar el carrito
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center py-4">Tu carrito está vacío</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item d-flex justify-content-between align-items-center py-3 border-bottom';
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">$${item.price.toLocaleString()}</small>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(itemElement);
            total += item.price;
        });
        
        cartTotal.textContent = `$${total.toLocaleString()}`;
        cartCount.textContent = cart.length;
        checkoutBtn.disabled = false;
    }
}

// Agregar producto al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));
        
        cart.push({ name, price });
        updateCart();
        
        // Mostrar notificación
        showToast(`${name} ha sido agregado al carrito`, 'success');
    });
});

// Eliminar producto del carrito
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
        const index = parseInt(button.getAttribute('data-index'));
        
        const removedItem = cart[index].name;
        cart.splice(index, 1);
        updateCart();
        
        // Mostrar notificación
        showToast(`${removedItem} ha sido eliminado del carrito`, 'danger');
    }
});

// Confirmar pago
document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
    const paymentForm = document.getElementById('paymentForm');
    const isValid = paymentForm.checkValidity();
    
    if (!isValid) {
        paymentForm.reportValidity();
        return;
    }
    
    // Cerrar modales de pago y carrito
    const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    paymentModal.hide();
    cartModal.hide();
    
    // Mostrar modal de éxito
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Vaciar carrito
    cart = [];
    updateCart();
    
    // Resetear formulario
    paymentForm.reset();
});

// Función para mostrar notificaciones toast
function showToast(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '11';
    
    let bgClass;
    switch(type) {
        case 'success':
            bgClass = 'bg-success';
            break;
        case 'danger':
            bgClass = 'bg-danger';
            break;
        default:
            bgClass = 'bg-primary';
    }
    
    toastContainer.innerHTML = `
        <div class="toast show align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// Smooth scrolling para los enlaces del navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Cerrar navbar en móvil si está abierto
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        }
    });
});
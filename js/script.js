// ===== Carrito: estado global y persistencia =====
let cart = {};

// Cargar carrito desde localStorage si existe
if (localStorage.getItem('cart')) {
  try{
    cart = JSON.parse(localStorage.getItem('cart'));
  }catch(e){ cart = {}; }
}

// Actualiza el contador (icono navbar)
function updateCartCount(){
  let count = 0;
  for (const id in cart){ count += cart[id].qty; }
  $('#cart-count').text(count);
}
updateCartCount();

// ===== Agregar al carrito (Products) =====
$('.add-to-cart').on('click', function(){
  const id = $(this).data('id');
  const name = $(this).data('name');
  const price = parseFloat($(this).data('price')) || 0;

  if (!cart[id]){
    cart[id] = { name, price, qty: 1 };
  }else{
    cart[id].qty += 1;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  // Mostrar toast Bootstrap
  const toastEl = document.getElementById('add-to-cart-msg');
  if (toastEl){
    const toast = new bootstrap.Toast(toastEl, { delay: 1200 });
    toast.show();
  }
});

// ===== Render del carrito (Cart page) =====
function renderCartItems(){
  const $tbody = $('#cart-items');
  if ($tbody.length === 0) return; // No estamos en cart.html

  $tbody.empty();
  let total = 0, count = 0;
  for (const id in cart){
    const item = cart[id];
    const subtotal = item.price * item.qty;
    total += subtotal; count += item.qty;

    const row = $(`
      <tr>
        <td>${item.name}</td>
        <td class="text-end">$ ${item.price}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-end">$ ${subtotal}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger remove-item" data-id="${id}" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `);
    $tbody.append(row);
  }
  $('#cart-total').text(total);
  if (count === 0) { $('#empty-cart-msg').show(); } else { $('#empty-cart-msg').hide(); }
}
renderCartItems();

// Eliminar item del carrito
$(document).on('click', '.remove-item', function(){
  const id = $(this).data('id');
  if (cart[id]){ delete cart[id]; }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
});

// Finalizar compra
$('#checkout-btn').on('click', function(){
  if ($.isEmptyObject(cart)){
    alert('El carrito está vacío.');
    return;
  }
  alert('¡Compra finalizada! Gracias por tu compra.');
  cart = {};
  localStorage.removeItem('cart');
  updateCartCount();
  renderCartItems();
});

// ===== Formulario de contacto =====
$('#contact-form').on('submit', function(e){
  e.preventDefault();
  const name = $('#name').val().trim();
  const email = $('#email').val().trim();
  const message = $('#message').val().trim();

  if (!name || !email || !message){
    $('#form-status').text('Por favor, completa todos los campos.').css('color', '#dc2626');
    return;
  }
  $('#form-status').text('¡Gracias, ' + name + '! Tu mensaje ha sido enviado.').css('color', '#16a34a');
  this.reset();
});

// === Chatbot widget ===
(function () {
  // 1) URL de tu Space (ajusta con tu usuario/space)
  const CHATBOT_URL = "https://herrerawilliamh-chatbot-datos-gemini.hf.space";

  // 2) Vincular URL al botón "Abrir en nueva pestaña"
  const openNew = document.getElementById('chatbotOpenNew');
  if (openNew) openNew.setAttribute('href', CHATBOT_URL);

  // 3) Carga perezosa del iframe al abrir el offcanvas
  const offcanvasEl = document.getElementById('chatbotOffcanvas');
  if (offcanvasEl) {
    offcanvasEl.addEventListener('show.bs.offcanvas', function () {
      const frame = document.getElementById('chatbotFrame');
      if (frame && !frame.getAttribute('src')) {
        frame.setAttribute('src', CHATBOT_URL);
      }
    });
  }
})();

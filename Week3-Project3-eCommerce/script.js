$(document).ready(function() {
    $("body").css("opacity", 0);
    $("body").animate({ opacity: 1 }, 800);
    
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }


    /* Sepet İşlemlerinin Yönetimini Burada Yaptım. (ürün ekleme, kaldırma, miktar değiştirme vb.) */
    const CartHandler = (() => {
        let cartItems = [];
        
        setTimeout(() => {
            cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            updateCartUI();
        }, 0);

        function addToCart(product) {
            const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
            
            if (existingItemIndex !== -1) {
                cartItems[existingItemIndex].quantity += 1;
            } else {
                cartItems.push({
                    ...product,
                    quantity: 1
                });
            }

            setTimeout(() => {
                saveCart();
            }, 0);
            
            updateCartUI();
            return cartItems;
        }
        

        function removeFromCart(productId) {
            cartItems = cartItems.filter(item => item.id !== productId);
            
            setTimeout(() => {
                saveCart();
            }, 0);
            
            updateCartUI();
            return cartItems;
        }
        

        function updateQuantity(productId, quantity) {
            const itemIndex = cartItems.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                if (quantity <= 0) {
                    return removeFromCart(productId);
                }
                
                cartItems[itemIndex].quantity = quantity;
                
                setTimeout(() => {
                    saveCart();
                }, 0);
                
                updateCartUI();
            }
            
            return cartItems;
        }
        

        function clearCart() {
            cartItems = [];
            
            setTimeout(() => {
                saveCart();
            }, 0);
            
            updateCartUI();
            return cartItems;
        }
        

        function saveCart() {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
        

        function getCartItems() {
            return cartItems;
        }
        

        function getTotalItemCount() {
            return cartItems.reduce((total, item) => total + item.quantity, 0);
        }
        

        function getTotalPrice() {
            return cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0).toFixed(2);
        }
        

        function updateCartUI() {
            const itemCount = getTotalItemCount();

            $('#cartCount').text(itemCount > 0 ? itemCount : '');
            
            $('#cartIcon').toggleClass('empty', itemCount === 0);
            

            renderCartItems();

            updateAllCartButtons();

            toggleCheckoutButton();
            
            updateCartTooltip();
        }
        
        
        /* Sipariş Butonu Pasif / Aktif Yapma Özelliği  Ekledim. (sepet boşsa pasif, doluysa aktif) */
        function toggleCheckoutButton() {
            const itemCount = CartHandler.getTotalItemCount();
            const $checkoutBtn = $('#checkout');
        
            if (itemCount === 0) {
                $checkoutBtn.prop('disabled', true).text('Sepetiniz Boş');
            } else {
                $checkoutBtn.prop('disabled', false).html('<i class="fas fa-shopping-bag"></i> Siparişi Tamamla');
            }
        }
        

        function updateCartTooltip() {
            if (cartItems.length === 0) {
                $('#tooltipSummary').html('Henüz ürün eklemediniz.');
                return;
            }
            
            let tooltipHTML = '';
            const maxItems = 3;
            

            const displayItems = cartItems.slice(-maxItems);
            
            displayItems.forEach(item => {
                tooltipHTML += `
                    <div class="tooltip-item">
                        <img src="${item.image}" alt="${item.title}" class="tooltip-item-img">
                        <div class="tooltip-item-info">
                            <div class="tooltip-item-title">${item.title}</div>
                            <div class="tooltip-item-price">₺${item.price} x ${item.quantity}</div>
                        </div>
                    </div>
                `;
            });
            
            if (cartItems.length > maxItems) {
                tooltipHTML += `<div class="tooltip-more">+${cartItems.length - maxItems} ürün daha...</div>`;
            }

            tooltipHTML += `<div class="tooltip-total">Toplam: ₺${getTotalPrice()}</div>`;
            
            $('#tooltipSummary').html(tooltipHTML);
        }

        function renderCartItems() {
            const $cartItems = $('#cartItems');
            
            if (!$cartItems.length) return;
            
            if (cartItems.length === 0) {
                $cartItems.html(`
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Sepetiniz boş</p>
                    </div>
                `);
                $('#cartTotal').text('₺0.00');
                return;
            }
            
            $cartItems.empty();
            
            cartItems.forEach(item => {
                const $template = $('#cartItemTemplate').clone(true);

                $template.removeAttr('id').css('display', '');

                $template.attr('data-id', item.id);
                $template.find('.cart-item-img').attr('src', item.image).attr('alt', item.title);
                $template.find('.cart-item-title').text(item.title);
                $template.find('.cart-item-price').text(`₺${item.price} x ${item.quantity}`);
                $template.find('.item-quantity').text(item.quantity);
                $template.find('.decrease-quantity, .increase-quantity, .remove-item').attr('data-id', item.id);

                $cartItems.append($template);
            });
            
            $('#cartTotal').text('₺' + getTotalPrice());
        }

        return {
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartItems,
            getTotalItemCount,
            getTotalPrice,
            updateCartUI
        };
    })();


    /* Tüm "Sepete Ekle" Butonlarının Güncelleme İşlemini Burada Yaptım. */
    function updateAllCartButtons() {
        const cartItems = CartHandler.getCartItems();
        $('.add-to-cart').each(function() {
            const productId = parseInt($(this).data('id'));
            const isInCart = cartItems.some(item => item.id === productId);
            
            if (isInCart) {
                $(this).html('<i class="fas fa-check"></i> Sepette').addClass('in-cart');
            } else {
                $(this).html('<i class="fas fa-shopping-cart"></i> Sepete Ekle').removeClass('in-cart');
            }
        });
    }



    /* Favori Ürünlerin Yönetimini Burada Yaptım. */
    const StorageHandler = (() => {
        let favorites = [];
        
        setTimeout(() => {
            favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        }, 0);
        
        function addFavorite(productId) {
            if (!favorites.includes(productId)) {
                favorites.push(productId);
                setTimeout(() => {
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                }, 0);
                return true;
            }
            return false;
        }
        
        function removeFavorite(productId) {
            const initialLength = favorites.length;
            favorites = favorites.filter(id => id !== productId);
            
            if (initialLength !== favorites.length) {
                setTimeout(() => {
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                }, 0);
                return true;
            }
            return false;
        }
        
        function isFavorite(productId) {
            return favorites.includes(productId);
        }
        
        function getFavorites() {
            return favorites;
        }
        
        return {
            addFavorite,
            removeFavorite,
            isFavorite,
            getFavorites
        };
    })();



    /* Global Değişkenlerimi Burada Tanımladım. */
    let productCache = {};
    let activeFilter = 'all';
    let searchQuery = '';
    let isLoading = false;
    let currentPage = 1;
    let postsPerPage = 6;
    let hasMoreProducts = true;

    loadProducts();

    createFeaturedProductsSlider();

    $(window).scroll(debounce(function() {
        const scrollTop = $(window).scrollTop();


        if (scrollTop > 300) {
            $('#backToTop').addClass('visible');
        } else {
            $('#backToTop').removeClass('visible');
        }
    }, 350));


    $('#backToTop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800, 'swing');
        return false;
    });

    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        activeFilter = $(this).data('filter');

        $('#productList').empty();
        currentPage = 1;
        hasMoreProducts = true;

        if (activeFilter === 'favorites') {
            loadFavorites();
        } else {
            loadProducts();
        }
    });

    $('#searchBtn').click(function() {
        performSearch();
    });

    $('#searchInput').keypress(function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });



    /* Event Delegation İle Kullanıcı Etkileşimlerini Burada Yönettim. */
    $('#searchInput').on('input', debounce(function() {
        if ($(this).val().trim().length > 2 || $(this).val().trim().length === 0) {
            performSearch();
        }
    }, 500));

    function performSearch() {
        searchQuery = $('#searchInput').val().trim().toLowerCase();

        $('#productList').empty();
        currentPage = 1;
        hasMoreProducts = true;
        
        loadProducts();
    }

    $('#retryBtn').click(function() {
        $('#error').addClass('hidden');
        loadProducts();
    });



    $(document).on('click', '#cartIcon', function(e) {
        e.preventDefault();
        $('#cartTooltip').removeClass('visible');
        $('#cart').toggleClass('open');
    });


    $(document).on('mouseenter', '#cartIcon', function() {
        $('#cartTooltip').addClass('visible');
    });


    $(document).on('mouseleave', '#cartIcon', function() {
        if (!$('#cartTooltip:hover').length) {
            $('#cartTooltip').removeClass('visible');
        }
    });


    $(document).on('mouseleave', '#cartTooltip', function() {
        $('#cartTooltip').removeClass('visible');
    });


    $(document).on('click', '#closeCart', function(e) {
        e.stopPropagation();
        $('#cart').removeClass('open');
    });


    $(document).on('click', '#cart', function(e) {
        e.stopPropagation();
    });



    $(document).on('click', function(e) {
        if (!$(e.target).closest('#cart, #cartIcon').length) {
            $('#cart').removeClass('open');
        }
    });



    $(document).on('click', '#clearCart', function(e) {
        e.stopPropagation();
        CartHandler.clearCart();
        showNotification('Sepet temizlendi', 'success');
    });



    $(document).on('click', '#productList .add-to-cart', function() {
        const productId = parseInt($(this).data('id'));
        const product = productCache[productId];
        
        if (CartHandler.getCartItems().some(item => item.id === productId)) {
            $('#cart').addClass('open');
            return;
        }

        $(this).addClass('add-animation');
        setTimeout(() => {
            $(this).removeClass('add-animation');
        }, 500);
        
        CartHandler.addToCart(product);
        showNotification('Ürün sepete eklendi', 'success');
    });



    $(document).on('click', '#productList .add-favorite', function() {
        const productId = parseInt($(this).data('id'));
        const $icon = $(this).find('i');
        const $productCard = $(this).closest('.product-card');
        
        if (StorageHandler.isFavorite(productId)) {
            StorageHandler.removeFavorite(productId);
            $icon.removeClass('fas').addClass('far');
            showNotification('Ürün favorilerden çıkarıldı', 'warning');

            if (activeFilter === 'favorites') {
                $productCard.fadeOut(300, function() {
                    $(this).remove();

                    if (StorageHandler.getFavorites().length === 0) {
                        $('#productList').html(`
                            <div class="empty-favorites">
                                <i class="fas fa-heart"></i>
                                <p>Henüz favori ürünleriniz bulunmuyor.</p>
                            </div>
                        `);
                    }
                });
            }
        } else {
            StorageHandler.addFavorite(productId);
            $icon.removeClass('far').addClass('fas');
            showNotification('Ürün favorilere eklendi', 'success');
        }

        updateFavoriteIcons(productId, StorageHandler.isFavorite(productId));
    });



    $(document).on('click', '#productSlider .add-to-cart', function() {
        const productId = parseInt($(this).data('id'));
        const product = productCache[productId];
        
        if (CartHandler.getCartItems().some(item => item.id === productId)) {
            $('#cart').addClass('open');
            return;
        }
        
        CartHandler.addToCart(product);
        showNotification('Ürün sepete eklendi', 'success');
    });



    $(document).on('click', '#productSlider .add-favorite', function() {
        const productId = parseInt($(this).data('id'));
        const $icon = $(this).find('i');
        
        if (StorageHandler.isFavorite(productId)) {
            StorageHandler.removeFavorite(productId);
            $icon.removeClass('fas').addClass('far');
            showNotification('Ürün favorilerden çıkarıldı', 'warning');

        if (activeFilter === 'favorites') {
            $(`.product-card[data-id="${productId}"]`).fadeOut(300, function() {
                $(this).remove();

                if (StorageHandler.getFavorites().length === 0) {
                    $('#productList').html(`
                        <div class="empty-favorites">
                            <i class="fas fa-heart"></i>
                            <p>Henüz favori ürünleriniz bulunmuyor.</p>
                        </div>
                    `);
                }
            });
        }
    } else {
        StorageHandler.addFavorite(productId);
        $icon.removeClass('far').addClass('fas');
        showNotification('Ürün favorilere eklendi', 'success');

        if (activeFilter === 'favorites') {
            $('#productList').empty();
            loadFavorites();
        }
    }
    
    updateFavoriteIcons(productId, StorageHandler.isFavorite(productId));
});



    $(document).on('click', '.quick-view-btn', function(e) {
        e.preventDefault();

        const productId = parseInt($(this).data('id'));

        const product = productCache[productId];

        if (!product) {
            showNotification('Ürün bilgileri yükleniyor...', 'info');

            $.getJSON(`https://fakestoreapi.com/products/${productId}`)
                .done(function(fetchedProduct) {
                    productCache[fetchedProduct.id] = fetchedProduct;
                    showProductQuickView(fetchedProduct);
                })
                .fail(function() {
                    showNotification('Ürün bilgileri yüklenemedi', 'error');
                });
        } else {
            showProductQuickView(product);
        }
    });



    $(document).on('click', '.increase-quantity', function() {
        const productId = parseInt($(this).data('id'));
        const currentItem = CartHandler.getCartItems().find(item => item.id === productId);
        
        if (currentItem) {

            updateCartItemUI(this, currentItem.quantity + 1);
            CartHandler.updateQuantity(productId, currentItem.quantity + 1);
        }
    });

    $(document).on('click', '.decrease-quantity', function() {
        const productId = parseInt($(this).data('id'));
        const currentItem = CartHandler.getCartItems().find(item => item.id === productId);
        
        if (currentItem && currentItem.quantity > 1) {
            updateCartItemUI(this, currentItem.quantity - 1);
            CartHandler.updateQuantity(productId, currentItem.quantity - 1);
        } else if (currentItem && currentItem.quantity === 1) {
            $(this).closest('.cart-item').slideUp(300, function() {
                CartHandler.removeFromCart(productId);
                showNotification('Ürün sepetten çıkarıldı', 'warning');
            });
        }
    });

    $(document).on('click', '.remove-item', function() {
        const productId = parseInt($(this).data('id'));
        
        $(this).closest('.cart-item').slideUp(300, function() {
            CartHandler.removeFromCart(productId);
            showNotification('Ürün sepetten çıkarıldı', 'success');
        });
    });
    
    
    $(document).on('click', '#quickViewModal .modal-add-to-cart', function() {
        const productId = parseInt($(this).data('id'));
        
        let product = $(this).data('product');
    
        if (!product) {
             product = productCache[productId];
            }
    
            if (!product) {
                showNotification('Ürün bilgileri yeniden yükleniyor...', 'info');
        
                $.getJSON(`https://fakestoreapi.com/products/${productId}`)
                .done(function(fetchedProduct) {
                    productCache[fetchedProduct.id] = fetchedProduct;
                    finishAddToCart(fetchedProduct);
                })
                .fail(function() {
                    showNotification('Ürün bilgileri yüklenemedi', 'error');
                });
            } else {
                finishAddToCart(product);
            }

            function finishAddToCart(productToAdd) {
                if (CartHandler.getCartItems().some(item => item.id === productId)) {
                    $('#cart').addClass('open');
                    $('#quickViewModal').fadeOut();
                    return;
                }

                $('.modal-add-to-cart').addClass('add-animation');
                setTimeout(() => {
                    $('.modal-add-to-cart').removeClass('add-animation');
                }, 500);

                CartHandler.addToCart(productToAdd);

                $('.modal-add-to-cart').html('<i class="fas fa-check"></i> Sepette').addClass('in-cart');
        
                showNotification('Ürün sepete eklendi', 'success');

                setTimeout(() => {
                    $('#quickViewModal').fadeOut();
                }, 1000);
            }
        });


/* Karanlık Mod Kontrolü */
    setupDarkMode();


    function getProductPrice(element) {
        return $(element).closest('.product-card').find('.product-price').text();
    }


    function getProductTitle(element) {
        return $(element).closest('.product-card').find('h3').text();
    }

    function updateCartItemUI(element, quantity) {
        const $cartItem = $(element).closest('.cart-item');

        $cartItem.find('.item-quantity').text(quantity);

        const productId = parseInt($cartItem.data('id'));

        const product = CartHandler.getCartItems().find(item => item.id === productId);
        
        if (product) {
            $cartItem.find('.cart-item-price').text(`₺${product.price} x ${quantity}`);
        }
    }


function quickViewProduct(element) {
    const $productCard = $(element).closest('.product-card');

    const productId = parseInt($productCard.data('id'));

    const product = productCache[productId];
    
    if (!product) {
        showNotification('Ürün bilgileri bulunamadı', 'error');
        return;
    }

    showProductQuickView(product);
}


/* Burada Ürün Detaylarını Gösterme İşlemini Yaptım. */
function showProductQuickView(product) {
    const id = product.id;
    const title = product.title;
    const image = product.image;
    const price = `₺${product.price.toFixed(2)}`;
    const category = product.category;
    const description = product.description;

    if ($('#quickViewModal').length) {
        $('#quickViewModal .modal-product-title').text(title);
        $('#quickViewModal .modal-product-image').attr('src', image);
        $('#quickViewModal .modal-product-price').text(price);
        $('#quickViewModal .modal-product-category').text(category);
        $('#quickViewModal .modal-product-description').text(description);
        $('#quickViewModal .modal-add-to-cart').attr('data-id', id);
        $('#quickViewModal .modal-add-to-cart').data('product', product);

        const isInCart = CartHandler.getCartItems().some(item => item.id === id);
        if (isInCart) {
            $('#quickViewModal .modal-add-to-cart').html('<i class="fas fa-check"></i> Sepette').addClass('in-cart');
        } else {
            $('#quickViewModal .modal-add-to-cart').html('<i class="fas fa-shopping-cart"></i> Sepete Ekle').removeClass('in-cart');
        }
    } else {
        const modalHTML = `
            <div id="quickViewModal" class="product-modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-product-details">
                        <div class="modal-product-image-container">
                            <img src="${image}" alt="${title}" class="modal-product-image">
                        </div>
                        <div class="modal-product-info">
                            <h3 class="modal-product-title">${title}</h3>
                            <p class="modal-product-category">${category}</p>
                            <p class="modal-product-price">${price}</p>
                            <div class="modal-product-description">${description}</div> <!-- Açıklama için div ekle -->
                            <button class="modal-add-to-cart add-to-cart" data-id="${id}">
                                <i class="fas fa-shopping-cart"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHTML);

        $('#quickViewModal .modal-add-to-cart').data('product', product);

        $('.close-modal').click(function() {
            $('#quickViewModal').fadeOut();
        });

        $(document).on('click', function(e) {
            if ($(e.target).is('#quickViewModal')) {
                $('#quickViewModal').fadeOut();
            }
        });

        const isInCart = CartHandler.getCartItems().some(item => item.id === id);
        if (isInCart) {
            $('#quickViewModal .modal-add-to-cart').html('<i class="fas fa-check"></i> Sepette').addClass('in-cart');
        } else {
            $('#quickViewModal .modal-add-to-cart').html('<i class="fas fa-shopping-cart"></i> Sepete Ekle').removeClass('in-cart');
        }
    }

    $('#quickViewModal').fadeIn();
}

    function loadFavorites() {
        $('#loader').show();
        const favorites = StorageHandler.getFavorites();

        if (favorites.length === 0) {
            $('#loader').hide();
            $('#productList').html(`
                <div class="empty-favorites">
                    <i class="fas fa-heart"></i>
                    <p>Henüz favori ürünleriniz bulunmuyor.</p>
                </div>
            `);

            $('#loadMoreBtn').remove();
            return;
        }
        
        let loadedCount = 0;
        let productsHTML = '';
        
        favorites.forEach((productId) => {
            if (productCache[productId]) {
                productsHTML += createProductCard(productCache[productId]);
                loadedCount++;
                
                if (loadedCount === favorites.length) {
                    finishLoading();
                }
            } else {
                $.getJSON(`https://fakestoreapi.com/products/${productId}`)
                    .done(function(product) {
                        productCache[product.id] = product;
                        productsHTML += createProductCard(product);
                    })
                    .fail(function() {
                        showNotification('Ürün bilgileri yüklenemedi', 'error');
                    })
                    .always(function() {
                        loadedCount++;
                        
                        if (loadedCount === favorites.length) {
                            finishLoading();
                        }
                    });
            }
        });
        
        function finishLoading() {
            $('#loader').hide();
            $('#productList').html(productsHTML);
            initializeLazyLoading();
            updateAllCartButtons();
            
            Fancybox.bind("[data-fancybox]");

            $('#loadMoreBtn').remove();
        }
    }

    function setupDarkMode() {
        const darkMode = localStorage.getItem('darkMode') || 'disabled';
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (darkMode === 'enabled' || (darkMode === 'disabled' && prefersDarkScheme.matches)) {
            enableDarkMode();
        }
        
        $('#darkModeToggle').click(toggleDarkMode);
        
        function enableDarkMode() {
            $('body').addClass('dark-mode');
            $('#darkModeToggle i').fadeOut(200, function() {
                $(this).removeClass('fa-moon').addClass('fa-sun').fadeIn(200);
            });
            
            setTimeout(() => {
                localStorage.setItem('darkMode', 'enabled');
            }, 0);
        }
        
        function disableDarkMode() {
            $('body').removeClass('dark-mode');
            $('#darkModeToggle i').fadeOut(200, function() {
                $(this).removeClass('fa-sun').addClass('fa-moon').fadeIn(200);
            });
            
            setTimeout(() => {
                localStorage.setItem('darkMode', 'disabled');
            }, 0);
        }
        
        function toggleDarkMode() {
            if ($('body').hasClass('dark-mode')) {
                disableDarkMode();
                showNotification('Açık mod etkinleştirildi', 'success');
            } else {
                enableDarkMode();
                showNotification('Karanlık mod etkinleştirildi', 'success');
            }
        }
        
        prefersDarkScheme.addEventListener('change', (e) => {
            if (e.matches && localStorage.getItem('darkMode') !== 'disabled') {
                enableDarkMode();
            } else if (!e.matches && localStorage.getItem('darkMode') !== 'enabled') {
                disableDarkMode();
            }
        });
    }

    

    function initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('.product-image img:not(.loaded)');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.getAttribute('data-src')) {
                            img.src = img.getAttribute('data-src');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        } else if (img.src && img.src.indexOf('data:image') === -1) {
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '0px 0px 200px 0px'
            });
            
            lazyImages.forEach(img => {
                if (!img.classList.contains('loaded')) {
                    if (img.getAttribute('data-src')) {
                        imageObserver.observe(img);
                    } else if (img.getAttribute('src') && img.getAttribute('src').indexOf('data:image') === -1) {
                        const src = img.getAttribute('src');
                        img.setAttribute('data-src', src);
                        img.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 300 225%22%3E%3Crect width%3D%22300%22 height%3D%22225%22 fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E';
                        imageObserver.observe(img);
                    }
                }
            });
        } else {
            lazyImages.forEach(img => {
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                }
            });
        }
    }
    

function createFeaturedProductsSlider() {
    $.getJSON('https://fakestoreapi.com/products?limit=5')
        .done(function(products) {
            let sliderHTML = '';
            
            products.forEach(product => {
                productCache[product.id] = product;
                
                sliderHTML += `
                    <div class="slider-item">
                        <div class="product-card" data-id="${product.id}">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.title}">
                                <button class="add-favorite" data-id="${product.id}">
                                    <i class="${StorageHandler.isFavorite(product.id) ? 'fas' : 'far'} fa-heart"></i>
                                </button>
                            </div>
                            <div class="product-info">
                                <h3>${product.title}</h3>
                                <p class="product-category">${product.category}</p>
                                <p class="product-price">₺${product.price.toFixed(2)}</p>
                                <div class="product-actions">
                                    <button class="quick-view-btn" data-id="${product.id}">
                                        <i class="fas fa-eye"></i> Hızlı Bakış
                                    </button>
                                    <button class="add-to-cart" data-id="${product.id}">
                                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            $('#productSlider').html(sliderHTML);
            

            $('#productSlider').slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });
            updateAllCartButtons();
        })
        .fail(function() {
            $('#productSlider').html('<p>Öne çıkan ürünler yüklenemedi.</p>');
        });
}
    

/* Ürünleri API'den Çekip Listeleme İşlemini Burada Yaptım. */
    function loadProducts(append = false) {
        if (activeFilter === 'favorites') {
            loadFavorites();
            return;
        }

        if (isLoading) return;
        
        isLoading = true;
        
        if (!append) {
            $('#productList').empty();
            currentPage = 1;
            $('#loader').show();
        } else {
            $('#loadMoreBtn').prop('disabled', true).text('Yükleniyor...');
        }

        $.getJSON('https://fakestoreapi.com/products')
            .done(function(allProducts) {
                if (activeFilter !== 'all' && activeFilter !== 'favorites') {
                    allProducts = allProducts.filter(product => product.category === activeFilter);
                }

                if (searchQuery) {
                    allProducts = allProducts.filter(product => 
                        product.title.toLowerCase().includes(searchQuery) || 
                        product.description.toLowerCase().includes(searchQuery)
                    );
                }
                
                if (allProducts.length === 0) {
                    $('#loader').hide();
                    if ($('#loadMoreBtn').length) $('#loadMoreBtn').remove();
                    
                    if (!append) {
                        $('#productList').html(`
                            <div class="empty-search">
                                <i class="fas fa-search"></i>
                                <p>Ürün bulunamadı.</p>
                            </div>
                        `);
                    }
                    
                    isLoading = false;
                    return;
                }

                const startIndex = (currentPage - 1) * postsPerPage;
                const endIndex = Math.min(startIndex + postsPerPage, allProducts.length);
                const productsToShow = allProducts.slice(startIndex, endIndex);
                

                productsToShow.forEach(product => {
                    productCache[product.id] = product;
                    const $productCard = createProductCardWithClone(product);
                    $('#productList').append($productCard);
                });
                
                $('#loader').hide();
                
                hasMoreProducts = endIndex < allProducts.length;
                
                if (hasMoreProducts) {
                    if ($('#loadMoreBtn').length === 0) {
                        $('<button id="loadMoreBtn" class="load-more-btn">Daha Fazla Yükle</button>')
                            .insertAfter('#productList');
                    } else {
                        $('#loadMoreBtn').prop('disabled', false).text('Daha Fazla Yükle');
                    }
                } else {
                    $('#loadMoreBtn').remove();
                }

                initializeLazyLoading();

                Fancybox.bind("[data-fancybox]");
                
                updateAllCartButtons();
                
                isLoading = false;
            })
            .fail(function(xhr, status, error) {
                $('#loader').hide();
                if ($('#loadMoreBtn').length) {
                    $('#loadMoreBtn').prop('disabled', false).text('Daha Fazla Yükle');
                }
                
                $('#error').html(`
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
                    <div class="error-details">
                        <p>Teknik detaylar: ${error}</p>
                    </div>
                    <button id="retryBtn">Tekrar Dene</button>
                `).removeClass('hidden');
                console.error('Hata:', error);
                isLoading = false;
            });
    }
    

    function updateFavoriteIcons(productId, isFavorite) {
        $(`.add-favorite[data-id="${productId}"] i`).each(function() {
            if (isFavorite) {
                $(this).removeClass('far').addClass('fas');
            } else {
                $(this).removeClass('fas').addClass('far');
            }
        });
    }

    
    /* Ürün Kartı Oluşturma İşlemini Clone() Kullanarak Burada Yaptım. */
    function createProductCardWithClone(product) {
        const $template = $('#productCardTemplate').clone(true);
        
        $template.removeAttr('id').css('display', '');
        
        $template.attr('data-id', product.id);
        $template.find('.product-image-link').attr('href', product.image).attr('data-caption', product.title);
        $template.find('.product-img').attr('src', product.image).attr('alt', product.title);
        $template.find('.add-favorite').attr('data-id', product.id);
        $template.find('.add-favorite i').toggleClass('far', !StorageHandler.isFavorite(product.id));
        $template.find('.add-favorite i').toggleClass('fas', StorageHandler.isFavorite(product.id));
        
        $template.find('.product-title').text(product.title);
        $template.find('.product-category').text(product.category);
        $template.find('.product-price').text(`₺${product.price.toFixed(2)}`);
        $template.find('.product-description').text(`${product.description.substring(0, 100)}...`);
        $template.find('.add-to-cart').attr('data-id', product.id);
        $template.find('.quick-view-btn').attr('data-id', product.id);
        
        return $template;
    }


    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <a href="${product.image}" data-fancybox="gallery" data-caption="${product.title}">
                        <img src="${product.image}" alt="${product.title}" class="lazy-load">
                    </a>
                    <button class="add-favorite" data-id="${product.id}">
                        <i class="${StorageHandler.isFavorite(product.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">₺${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description.substring(0, 100)}...</p>
                    <div class="product-actions">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Hızlı Bakış
                        </button>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;
    }


    /* Bildirim Gösterme İşlemleri Burada. */
    function showNotification(message, type = 'info') {
        $('.notification').remove();
        
        $('<div class="notification"></div>')
            .addClass(type)
            .text(message)
            .appendTo('body')
            .fadeIn()
            .delay(2000)
            .fadeOut(function() {
                $(this).remove();
            });
    }


    /* Daha Fazla Ürün Yükleme İşlemi Burada Gerçekleşiyor. */
    $(document).on('click', '#loadMoreBtn', function() {
        currentPage++;
        $('#loadMoreBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Yükleniyor...');
        loadProducts(true);
    });
});
const appendLocation = '.ins-api-users';

$(document).ready(function() {
    const $userContainer = $(appendLocation);

    const createStyles = () => {
        const style = `
        <style>
        body {
        background-color: #f0f4f8;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        }

        h1 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 30px;
        position: relative;
        }

        h1:after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        border-radius: 2px;
        }

        .ins-api-users {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
        justify-content: center;
        padding: 20px;
        }

        .user-card {
        flex: 1;
        min-width: 300px;
        max-width: 400px;
        border-radius: 12px;
        padding: 20px;
        background: white;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        }

        .user-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .user-card:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
        background: linear-gradient(180deg, #3498db, #2ecc71);
        }

        .user-card h2 {
        margin-top: 0;
        color: #2c3e50;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        font-size: 1.4rem;
        }

        .user-card p {
        margin: 10px 0;
        color: #555;
        }

        .user-card .email {
        color: #3498db;
        text-decoration: none;
        transition: color 0.3s;
        }

        .user-card .email:hover {
        color: #2980b9;
        text-decoration: underline;
        }

        .delete-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
        opacity: 0.7;
        }

        .delete-btn:hover {
        opacity: 1;
        transform: rotate(90deg);
        background-color: #c0392b;
        }

        .delete-btn:after {
        content: '×';
        font-size: 20px;
        font-weight: bold;
        }

        .address {
        margin-top: 15px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border-left: 3px solid #3498db;
        }

        .error-message {
        color: #e74c3c;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        margin: 20px auto;
        max-width: 500px;
        border-left: 5px solid #e74c3c;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .loading {
        text-align: center;
        padding: 30px;
        color: #666;
        font-size: 1.2rem;
        }

        #retry-fetch, #reload-users {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 30px;
        margin-top: 15px;
        cursor: pointer;
        transition: background-color 0.3s;
        font-weight: bold;
        display: block;
        margin: 15px auto 5px;
        }

        #retry-fetch:hover, #reload-users:hover {
        background-color: #2980b9;
        }

        .no-users-message {
        text-align: center;
        padding: 30px;
        color: #666;
        font-size: 1.2rem;
        background-color: #fff;
        border-radius: 8px;
        margin: 20px auto;
        max-width: 500px;
        border-left: 5px solid #f39c12;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .disabled-btn {
        background-color: #95a5a6 !important;
        color: #ddd !important;
        cursor: not-allowed !important;
        opacity: 0.7;
        }
        </style>
        `;

        $('head').append(style);
    };

    const isDataExpired = (userData) => {
        if (!userData || !userData.timestamp) return true;
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();
        return (now - userData.timestamp) > oneDayInMs;
    };

    const displayUsers = (users) => {
        $userContainer.empty();

        if (!users || users.length === 0) {
            if (sessionStorage.getItem('reloadButtonUsed') !== 'true') {
                const noUsersMessage = `
                    <div class="no-users-message">
                        <p>Hiç Kullanıcı Verisi Bulunmuyor.</p>
                        <button id="reload-users">Kullanıcıları Yeniden Yükle</button>
                    </div>
                `;
                $userContainer.html(noUsersMessage);
            } else {
                const noUsersMessage = `
                    <div class="no-users-message">
                        <p>Hiç Kullanıcı Verisi Bulunmuyor.</p>
                        <p>Bu oturumda kullanıcıları tekrar yükleyemezsiniz.</p>
                    </div>
                `;
                $userContainer.html(noUsersMessage);
            }
            return;
        }

        $.each(users, function(index, user) {
            const userCard = $('<div>').addClass('user-card').attr('data-id', user.id);
                
            $('<h2>').text(user.name).appendTo(userCard);
            $('<p>').html(`<strong>Kullanıcı Adı:</strong> ${user.username}`).appendTo(userCard);
            $('<p>').html(`<strong>E-posta:</strong> <a href="mailto:${user.email}" class="email">${user.email}</a>`).appendTo(userCard);
            $('<p>').html(`<strong>Telefon:</strong> ${user.phone}`).appendTo(userCard);
                    
            const addressDiv = $('<div>').addClass('address').appendTo(userCard);
            $('<p>').html(`<strong>Adres:</strong> ${user.address.street}, ${user.address.suite}`).appendTo(addressDiv)
            $('<p>').html(`<strong>Şehir:</strong> ${user.address.city}`).appendTo(addressDiv);
            $('<p>').html(`<strong>Posta Kodu:</strong> ${user.address.zipcode}`).appendTo(addressDiv);

            $('<button>').addClass('delete-btn').attr('data-id', user.id).appendTo(userCard);
                    
            $userContainer.append(userCard);
        });
    };

    const deleteUser = (userId) => {
        let storedData = JSON.parse(localStorage.getItem('userData')) || {users: [], timestamp: 0};

        if (storedData.users && storedData.users.length) {
            storedData.users = storedData.users.filter(user => user.id !== userId);
            localStorage.setItem('userData', JSON.stringify(storedData));

            $(`.user-card[data-id="${userId}"]`).fadeOut(300, function() {
                $(this).remove();

                if (storedData.users.length === 0) {
                    displayUsers([]);
                }
            });
        }
    };

    const fetchUsers = async () => {
        const $loadingMessage = $('<p>').addClass('loading').text('Kullanıcı Verileri Yükleniyor...');
        $userContainer.empty().append($loadingMessage);

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');

            if(!response.ok) {
                throw new Error (`HTTP Hata: ${response.status}`);
            }
            const users = await response.json();
            const timestamp = new Date().getTime();
            localStorage.setItem('userData', JSON.stringify({timestamp, users}));

            return users;
        } catch (error) {
            console.error('Veri Çekilemedi.', error);
            $userContainer.html(`
                <div class="error-message">
                    <p>Kullanıcı verileri yüklenirken bir hata oluştu:</p>
                    <p>${error.message}</p>
                    <p>Lütfen daha sonra tekrar deneyiniz</p>
                    <button id="retry-fetch">Tekrar Dene</button>
                </div>
            `);
            return null;
        }
    };

    const observeUserContainer = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const $reloadButton = $('#reload-users');
                    
                    if ($reloadButton.length) {
                        $reloadButton.one('click', async function() {
                            sessionStorage.setItem('reloadButtonUsed', 'true');

                            $(this).addClass('disabled-btn').prop('disabled', true);

                            const users = await fetchUsers();
                            if (users) {
                                displayUsers(users);
                            }
                        });
                    }
                }
            });
        });
        
        observer.observe($userContainer[0], {
            childList: true,
            subtree: true
        });
    };

    const init = async () => {
        createStyles();
        observeUserContainer();

        let storedData;
        try {
            storedData = JSON.parse(localStorage.getItem('userData')) || {users: [], timestamp: 0};

            if (!storedData.users || !Array.isArray(storedData.users)) {
                throw new Error("localStorage bozulmuş, sıfırlanıyor...");
            }
        } catch (error) {
            console.error(error.message);
            storedData = {users: [], timestamp: 0};
            localStorage.removeItem('userData');
        }
        
        if (storedData.users.length && !isDataExpired(storedData)) {
            console.log("localStorage'dan veriler yüklendi.");
            displayUsers(storedData.users);
        } else {
            console.log("API'den veriler çekiliyor...");
            const users = await fetchUsers();
            if (users) {
                displayUsers(users);
            }
        }

        $userContainer.on('click', '.delete-btn', function() {
            const userId = parseInt($(this).data('id'));
            deleteUser(userId);
        });

        $userContainer.on('click', '#retry-fetch', async function() {
            $userContainer.html('<p class="loading">Yeniden Bağlanıyor...</p>');
            const users = await fetchUsers();
            if (users) {
                displayUsers(users);
            }
        });
    };

    init();
});
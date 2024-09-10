// Utility Functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    document.getElementById('captcha-question').textContent = `${num1} + ${num2} = ?`;
    document.getElementById('captcha-answer').value = num1 + num2; 
}

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    if (token) {
        fetch('/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById('user-name').textContent = data.name || 'Kullanıcı Adı';
            document.getElementById('login-link').textContent = 'Çıkış Yap';
            document.getElementById('login-link').href = '/logout';
            document.getElementById('register-link').style.display = 'none';
            document.getElementById('contact-form').style.display = 'block'; // formu görünür yap
            document.getElementById('login-warning').style.display = 'none'; // uyarıyı gizle
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.log('Token bulunamadı');
        document.getElementById('register-link').style.display = 'inline';
        document.getElementById('contact-form').style.display = 'none'; // formu gizle
        document.getElementById('login-warning').style.display = 'block'; // uyarıyı göster
    }

    generateCaptcha();
});

document.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 50) {
        footer.style.bottom = '0';
    } else {
        footer.style.bottom = '-100px';
    }
});

// Form Submission Handlers
async function handleLoginFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';

    if (response.ok) {
        messageContainer.innerHTML = `<div class="message success">${result.message}</div>`;
        localStorage.setItem('token', result.token);
        setTimeout(() => {
            window.location.href = '/index.html'; // Yönlendirme
        }, 1000);
    } else {
        messageContainer.innerHTML = `<div class="message error">${result.message}</div>`;
    }
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        const messageContainer = document.getElementById('message-container');

        if (response.ok) {
            messageContainer.innerHTML = `<div class="message success">${result.message}</div>`;
        } else {
            messageContainer.innerHTML = `<div class="message error">${result.message}</div>`;
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

async function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const captchaAnswer = formData.get('captcha-answer');
    const userAnswer = formData.get('captcha');

    if (captchaAnswer !== userAnswer) {
        document.getElementById('message-container').innerHTML = '<div class="message error">CAPTCHA yanıtı yanlış</div>';
        generateCaptcha();
        return;
    }

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const token = getCookie('token');
    if (token) {
        data.token = token;
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            const messageContainer = document.getElementById('message-container');

            if (response.ok) {
                messageContainer.innerHTML = `<div class="message success">${result.message}</div>`;
                form.reset();
                generateCaptcha();
            } else {
                messageContainer.innerHTML = `<div class="message error">${result.message}</div>`;
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    } else {
        document.getElementById('message-container').innerHTML = '<div class="message error">Giriş yapmadan mesaj gönderemezsiniz</div>';
    }
}

async function handleApplyFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const captchaAnswer = formData.get('captcha-answer');
    const userAnswer = formData.get('captcha');

    if (captchaAnswer !== userAnswer) {
        document.getElementById('message-container').innerHTML = '<div class="message error">CAPTCHA yanıtı yanlış</div>';
        generateCaptcha();
        return;
    }

    try {
        const response = await fetch('/apply', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        const messageContainer = document.getElementById('message-container');

        if (response.ok) {
            messageContainer.innerHTML = `<div class="message success">${result.message}</div>`;
        } else {
            messageContainer.innerHTML = `<div class="message error">${result.message}</div>`;
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

// form eventleri
document.getElementById('contact-form')?.addEventListener('submit', handleContactFormSubmit);
document.getElementById('login-form')?.addEventListener('submit', handleLoginFormSubmit);
document.getElementById('register-form')?.addEventListener('submit', handleRegisterFormSubmit);
document.getElementById('apply-form')?.addEventListener('submit', handleApplyFormSubmit);

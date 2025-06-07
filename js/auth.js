document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            let strength = 0;
            if (password.length >= 8) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[a-z]/.test(password)) strength += 25;
            if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
            
            if (strength < 50) {
                registerMessage.textContent = 'Password is not secure enough. Please use a stronger password.';
                registerMessage.className = 'message error';
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(user => user.email === email)) {
                registerMessage.textContent = 'An account with this email already exists.';
                registerMessage.className = 'message error';
                return;
            }
            
            users.push({
                name,
                email,
                password, 
                profileImage: 'img/default-avatar.png',
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            
            const overlay = document.getElementById('notificationOverlay');
            const container = document.getElementById('notificationContainer');
            const icon = document.getElementById('notificationIcon');
            const iconElement = document.getElementById('notificationIconElement');
            const title = document.getElementById('notificationTitle');
            const message = document.getElementById('notificationMessage');
            const button = document.getElementById('notificationButton');
            
            container.classList.remove('shake-animation');
            icon.className = 'notification-icon success';
            iconElement.className = 'fas fa-check-circle';
            title.textContent = 'Registration Successful';
            message.textContent = 'Your account has been created! You can now log in.';
            button.textContent = 'Login Now';
            button.onclick = function() {
                overlay.classList.remove('active');
                document.getElementById('container').classList.remove('active');
            };
            
            overlay.classList.add('active');
            
            registerForm.reset();
        });
    }
    
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            const email = emailInput.value;
            const password = passwordInput.value;
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                const { password, ...userWithoutPassword } = user;
                localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                
                const now = new Date().toISOString();
                let activities = JSON.parse(localStorage.getItem('activities') || '[]');
                activities.push({
                    userId: user.email,
                    action: 'login',
                    timestamp: now
                });
                localStorage.setItem('activities', JSON.stringify(activities));
                
                const overlay = document.getElementById('notificationOverlay');
                const container = document.getElementById('notificationContainer');
                const icon = document.getElementById('notificationIcon');
                const iconElement = document.getElementById('notificationIconElement');
                const title = document.getElementById('notificationTitle');
                const message = document.getElementById('notificationMessage');
                const button = document.getElementById('notificationButton');
                
                container.classList.remove('shake-animation');
                icon.className = 'notification-icon success';
                iconElement.className = 'fas fa-check-circle';
                title.textContent = 'Login Successful';
                message.textContent = 'You are being redirected to the dashboard...';
                button.textContent = 'Continue';
                button.onclick = function() {
                    overlay.classList.remove('active');
                    window.location.href = 'dashboard.html';
                };
                
                overlay.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
                
            } else {
                const overlay = document.getElementById('notificationOverlay');
                const container = document.getElementById('notificationContainer');
                const icon = document.getElementById('notificationIcon');
                const iconElement = document.getElementById('notificationIconElement');
                const title = document.getElementById('notificationTitle');
                const message = document.getElementById('notificationMessage');
                const button = document.getElementById('notificationButton');
                
                container.classList.add('shake-animation');
                icon.className = 'notification-icon error';
                iconElement.className = 'fas fa-exclamation-circle';
                title.textContent = 'Authentication Error';
                message.textContent = 'Invalid email or password.';
                button.textContent = 'Try Again';
                button.onclick = function() {
                    overlay.classList.remove('active');
                    emailInput.focus();
                };
                
                overlay.classList.add('active');
                
                emailInput.classList.add('error-highlight');
                passwordInput.classList.add('error-highlight');
                
                setTimeout(() => {
                    emailInput.classList.remove('error-highlight');
                    passwordInput.classList.remove('error-highlight');
                }, 3000);
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        const overlay = document.getElementById('notificationOverlay');
        const container = document.querySelector('.notification-container');
        
        if (overlay && overlay.classList.contains('active')) {
            if (e.target === overlay && !container.contains(e.target)) {
                overlay.classList.remove('active');
            }
        }
    });
    
    const resetForm = document.getElementById('resetForm');
    const resetMessage = document.getElementById('resetMessage');
    
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            const userExists = users.some(user => user.email === email);
            
            if (userExists) {
                resetMessage.textContent = 'Password reset instructions have been sent to your email.';
                resetMessage.className = 'message success';
                
                setTimeout(() => {
                    resetForm.reset();
                    document.getElementById('resetModal').style.display = 'none';
                }, 3000);
            } else {
                resetMessage.textContent = 'No account found with this email.';
                resetMessage.className = 'message error';
            }
        });
    }
});

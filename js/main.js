document.addEventListener('DOMContentLoaded', function() {
    function isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }
    
    function checkAuth() {
        const currentPath = window.location.pathname;
        const protectedPages = [
            '/dashboard.html', 
            '/documents.html', 
            '/account-settings.html'
        ];
        
        const isProtectedPage = protectedPages.some(page => 
            currentPath.endsWith(page)
        );
        
        if (isProtectedPage && !isLoggedIn()) {
            window.location.href = 'index.html';
        } else if (currentPath.endsWith('/index.html') && isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
    }
    
    checkAuth();
    
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    
    if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });
        
        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }
    
    const registerPassword = document.getElementById('registerPassword');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthText = document.getElementById('strengthText');
    
    if (registerPassword && strengthMeter && strengthText) {
        registerPassword.addEventListener('input', updateStrengthMeter);
    }
    
    const newPassword = document.getElementById('newPassword');
    if (newPassword && strengthMeter && strengthText) {
        newPassword.addEventListener('input', updateStrengthMeter);
    }
    
    function updateStrengthMeter(e) {
        const password = e.target.value;
        let strength = 0;
        let message = '';
        
        if (password.length >= 8) {
            strength += 25;
        }
        
        if (/[A-Z]/.test(password)) {
            strength += 25;
        }
        
        if (/[a-z]/.test(password)) {
            strength += 25;
        }
        
        if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
            strength += 25;
        }
        
        strengthMeter.style.width = strength + '%';
        
        if (strength <= 25) {
            strengthMeter.style.backgroundColor = '#f44336';
            message = 'Weak password';
        } else if (strength <= 50) {
            strengthMeter.style.backgroundColor = '#ff9800';
            message = 'Fair password';
        } else if (strength <= 75) {
            strengthMeter.style.backgroundColor = '#ffeb3b';
            message = 'Good password';
        } else {
            strengthMeter.style.backgroundColor = '#4caf50';
            message = 'Strong password';
        }
        
        strengthText.textContent = message;
    }
    
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');
    
    if (closeBtns) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
    }
    
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutConfirmOverlay = document.getElementById('logoutConfirmOverlay');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');
    
    if (logoutBtn && logoutConfirmOverlay) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            logoutConfirmOverlay.classList.add('active');
            
            const container = logoutConfirmOverlay.querySelector('.notification-container');
            if (container) {
                container.classList.add('shake-animation');
                setTimeout(() => {
                    container.classList.remove('shake-animation');
                }, 600);
            }
        });
        
        if (cancelLogout) {
            cancelLogout.addEventListener('click', function() {
                logoutConfirmOverlay.classList.remove('active');
            });
        }
        
        if (confirmLogout) {
            confirmLogout.addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
                this.disabled = true;
                
                setTimeout(() => {
                    localStorage.removeItem('currentUser');
                    
                    const email = JSON.parse(localStorage.getItem('currentUser'))?.email;
                    if (email) {
                        let activities = JSON.parse(localStorage.getItem('activities') || '[]');
                        activities.push({
                            userId: email,
                            action: 'logout',
                            timestamp: new Date().toISOString()
                        });
                        localStorage.setItem('activities', JSON.stringify(activities));
                    }
                    
                    window.location.href = 'index.html';
                }, 1000);
            });
        }
        
        logoutConfirmOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                logoutConfirmOverlay.classList.remove('active');
            }
        });
    }
    
    function loadUserProfileImage() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const profileImage = currentUser.profileImage;
        
        const profileContainers = document.querySelectorAll('.profile-image');
        
        profileContainers.forEach(container => {
            const img = container.querySelector('img');
            
            if (profileImage) {
                if (img) {
                    img.src = profileImage;
                    img.style.display = 'block';
                }
                
                const fallbackIcon = container.querySelector('.profile-image-fallback');
                if (fallbackIcon) {
                    fallbackIcon.style.display = 'none';
                }
            } else {
                if (img) {
                    img.src = 'img/default-avatar.png';
                    img.style.display = 'none';
                }
                
                let fallbackIcon = container.querySelector('.profile-image-fallback');
                if (!fallbackIcon) {
                    fallbackIcon = document.createElement('div');
                    fallbackIcon.className = 'profile-image-fallback';
                    fallbackIcon.innerHTML = '<i class="fas fa-user"></i>';
                    container.appendChild(fallbackIcon);
                } else {
                    fallbackIcon.style.display = 'flex';
                }
            }
        });
    }
    
    loadUserProfileImage();
    
    function checkAndLoadImages() {
        const iconMapping = {
            '3dmigoto': 'img/3dmigoto-icon.png',
            'gimi': 'img/gimi-icon.png',
            'cultivation': 'img/cultivation-icon.png',
            'fps-unlocker': 'img/fps-unlocker-icon.png',
            'akebi': 'img/akebi-icon.png',
            'grasscutter': 'img/grasscutter-icon.png',
            'teyvat-map': 'img/teyvat-map-icon.png',
            'optimizer': 'img/optimizer-icon.png',
            'noclip': 'img/noclip-icon.png',
            'cheat-engine': 'img/cheat-engine-icon.png',
            'memory-editor': 'img/memory-editor-icon.png',
            'reshade': 'img/reshade-icon.png'
        };

        const fallbackIcons = {
            '3dmigoto': 'fa-cube',
            'gimi': 'fa-file-import',
            'cultivation': 'fa-seedling',
            'fps-unlocker': 'fa-bolt',
            'akebi': 'fa-skull',
            'grasscutter': 'fa-magic',
            'teyvat-map': 'fa-map-marked-alt',
            'optimizer': 'fa-calculator',
            'noclip': 'fa-walking',
            'cheat-engine': 'fa-terminal',
            'memory-editor': 'fa-memory',
            'reshade': 'fa-shield-alt'
        };
    }
});

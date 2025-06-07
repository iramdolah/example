document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const profilePreview = document.getElementById('profilePreview');
    const profileImageContainer = document.getElementById('profileContainer');

    if (fullNameInput) fullNameInput.value = currentUser.name;
    if (emailInput) emailInput.value = currentUser.email;

    if (profileImageContainer) {
        if (currentUser.profileImage && currentUser.profileImage !== 'img/default-avatar.png') {
            if (profilePreview) {
                profilePreview.src = currentUser.profileImage;
                profilePreview.style.display = 'block';
            }
            const fallbackIcon = profileImageContainer.querySelector('.profile-image-fallback');
            if (fallbackIcon) {
                fallbackIcon.style.display = 'none';
            }
        } else {
            if (profilePreview) profilePreview.style.display = 'none';
            
            let fallbackIcon = profileImageContainer.querySelector('.profile-image-fallback');
            if (!fallbackIcon) {
                fallbackIcon = document.createElement('div');
                fallbackIcon.className = 'profile-image-fallback';
                fallbackIcon.innerHTML = '<i class="fas fa-user"></i>';
                profileImageContainer.appendChild(fallbackIcon);
            } else {
                fallbackIcon.style.display = 'flex';
            }
        }
    }
    
    const profileForm = document.getElementById('profileForm');
    const profileMessage = document.getElementById('profileMessage');

    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newName = fullNameInput.value;
            
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            
            if (userIndex !== -1) {
                users[userIndex].name = newName;
                localStorage.setItem('users', JSON.stringify(users));
                
                currentUser.name = newName;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                const welcomeUser = document.getElementById('welcomeUser');
                if (welcomeUser) {
                    welcomeUser.textContent = `Welcome, ${newName}!`;
                }
                
                profileMessage.textContent = 'Profile updated successfully!';
                profileMessage.className = 'message success';
                
                profileMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                setTimeout(() => {
                    profileMessage.style.opacity = '0';
                    setTimeout(() => {
                        profileMessage.textContent = '';
                        profileMessage.className = 'message';
                        profileMessage.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        });
    }
    
    const profilePicture = document.getElementById('profilePicture');
    const removeProfilePicture = document.getElementById('removeProfilePicture');
    const pictureMessage = document.getElementById('pictureMessage');
    
    if (profilePicture && profilePreview) {
        const profilePictureContainer = document.querySelector('.profile-picture');
        if (profilePictureContainer) {
            profilePictureContainer.addEventListener('click', function() {
                profilePicture.click();
            });
        }
        
        profilePicture.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                if (!file.type.match('image.*')) {
                    pictureMessage.textContent = 'Please select an image file.';
                    pictureMessage.className = 'message error';
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    pictureMessage.textContent = 'Image size should be less than 5MB.';
                    pictureMessage.className = 'message error';
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    
                    profilePreview.src = imageData;
                    profilePreview.style.display = 'block';
                    
                    const fallbackIcon = document.querySelector('.profile-image-fallback');
                    if (fallbackIcon) fallbackIcon.style.display = 'none';
                    
                    saveProfileImage(imageData);
                    
                    pictureMessage.textContent = 'Profile picture updated successfully!';
                    pictureMessage.className = 'message success';
                    
                    setTimeout(() => {
                        pictureMessage.textContent = '';
                        pictureMessage.className = 'message';
                    }, 3000);
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (removeProfilePicture && profilePreview) {
        removeProfilePicture.addEventListener('click', function() {
            const defaultImage = 'img/default-avatar.png';
            profilePreview.src = defaultImage;
            profilePreview.style.display = 'none';
            
            let fallbackIcon = document.querySelector('.profile-image-fallback');
            if (!fallbackIcon) {
                fallbackIcon = document.createElement('div');
                fallbackIcon.className = 'profile-image-fallback';
                fallbackIcon.innerHTML = '<i class="fas fa-user"></i>';
                const profileContainer = document.querySelector('.profile-picture');
                if (profileContainer) {
                    profileContainer.appendChild(fallbackIcon);
                }
            } else {
                fallbackIcon.style.display = 'flex';
            }
            
            saveProfileImage(null);
            
            pictureMessage.textContent = 'Profile picture removed.';
            pictureMessage.className = 'message success';
            
            setTimeout(() => {
                pictureMessage.textContent = '';
                pictureMessage.className = 'message';
            }, 3000);
        });
    }
    
    function saveProfileImage(imageData) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) return;
        
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].profileImage = imageData;
            localStorage.setItem('users', JSON.stringify(users));
            
            currentUser.profileImage = imageData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updatePageProfileImages(imageData);
        }
    }
    
    function updatePageProfileImages(imageData) {
        const allProfileImages = document.querySelectorAll('.profile-image');
        
        allProfileImages.forEach(container => {
            const img = container.querySelector('img');
            
            if (imageData) {
                if (img) {
                    img.src = imageData;
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
    
    const passwordForm = document.getElementById('passwordForm');
    const passwordMessage = document.getElementById('passwordMessage');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            
            if (userIndex === -1) {
                passwordMessage.textContent = 'User not found.';
                passwordMessage.className = 'message error';
                return;
            }
            
            if (users[userIndex].password !== currentPassword) {
                passwordMessage.textContent = 'Current password is incorrect.';
                passwordMessage.className = 'message error';
                return;
            }
            
            if (newPassword !== confirmPassword) {
                passwordMessage.textContent = 'New passwords do not match.';
                passwordMessage.className = 'message error';
                return;
            }
            
            let strength = 0;
            if (newPassword.length >= 8) strength += 25;
            if (/[A-Z]/.test(newPassword)) strength += 25;
            if (/[a-z]/.test(newPassword)) strength += 25;
            if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword)) strength += 25;
            
            if (strength < 50) {
                passwordMessage.textContent = 'Password is not secure enough. Please use a stronger password.';
                passwordMessage.className = 'message error';
                return;
            }
            
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            passwordMessage.textContent = 'Password changed successfully!';
            passwordMessage.className = 'message success';
            
            passwordForm.reset();
            
            setTimeout(() => {
                passwordMessage.textContent = '';
                passwordMessage.className = 'message';
            }, 3000);
        });
    }
    
    const deleteAccount = document.getElementById('deleteAccount');
    const confirmModal = document.getElementById('confirmModal');
    const cancelAction = document.getElementById('cancelAction');
    const confirmAction = document.getElementById('confirmAction');
    
    if (deleteAccount && confirmModal) {
        deleteAccount.addEventListener('click', function() {
            confirmModal.style.display = 'block';
        });
        
        cancelAction.addEventListener('click', function() {
            confirmModal.style.display = 'none';
        });
        
        confirmAction.addEventListener('click', function() {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const filteredUsers = users.filter(u => u.email !== currentUser.email);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            
            localStorage.removeItem('currentUser');
            
            window.location.href = 'index.html';
        });
    }
});

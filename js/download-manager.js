document.addEventListener('DOMContentLoaded', function() {
    const versionNotification = document.getElementById('versionNotification');
    const notificationContent = document.querySelector('.notification-content span');
    
    setTimeout(() => {
        notificationContent.textContent = 'Checking for updates...';
        versionNotification.classList.add('show');
        
        setTimeout(() => {
            const updates = 3; 
            notificationContent.textContent = `${updates} mods have updates available`;
            
            const icon = document.querySelector('.notification-content i');
            icon.classList.remove('fa-sync-alt');
            icon.classList.add('fa-info-circle');
            
            setTimeout(() => {
                versionNotification.classList.remove('show');
            }, 4000);
        }, 2000);
    }, 1500);
    
    const closeNotification = document.querySelector('.close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', () => {
            versionNotification.classList.remove('show');
        });
    }
});

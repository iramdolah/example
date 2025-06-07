document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const welcomeUser = document.getElementById('welcomeUser');
    if (welcomeUser) {
        welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
    }
    
    const profileImage = document.getElementById('profileImage');
    if (profileImage && currentUser.profileImage) {
        profileImage.src = currentUser.profileImage;
    }
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    if (downloadButtons) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const toolName = this.parentElement.querySelector('h3').textContent;
                alert(`Downloading ${toolName}...\n\nIn a real application, this would start a file download.`);
                
                let activities = JSON.parse(localStorage.getItem('activities') || '[]');
                activities.push({
                    userId: currentUser.email,
                    action: `downloaded_${toolName.toLowerCase().replace(/\s+/g, '_')}`,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('activities', JSON.stringify(activities));
            });
        });
    }
    
    const toolRequestForm = document.getElementById('toolRequestForm');
    if (toolRequestForm) {
        toolRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const toolName = document.getElementById('toolName').value;
            const toolDescription = document.getElementById('toolDescription').value;
            
            let requests = JSON.parse(localStorage.getItem('toolRequests') || '[]');
            requests.push({
                userId: currentUser.email,
                toolName,
                toolDescription,
                status: 'pending',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('toolRequests', JSON.stringify(requests));
            
            alert('Tool request submitted successfully!');
            
            toolRequestForm.reset();
        });
    }
    
    const menuToggle = document.getElementById('menuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    
    if (menuToggle && sidebarMenu) {
        menuToggle.addEventListener('click', function() {
            sidebarMenu.classList.toggle('show');
            
            const icon = menuToggle.querySelector('i');
            if (sidebarMenu.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebarMenu.contains(e.target) && 
                    !menuToggle.contains(e.target) && 
                    sidebarMenu.classList.contains('show')) {
                    sidebarMenu.classList.remove('show');
                    menuToggle.querySelector('i').className = 'fas fa-bars';
                }
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebarMenu.classList.remove('show');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const timestampElements = document.querySelectorAll('.timestamp');
        
        if (timestampElements.length > 0) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const activities = JSON.parse(localStorage.getItem('activities') || '[]');
            
            let latestLogin = null;
            if (currentUser && activities.length > 0) {
                const userActivities = activities.filter(activity => 
                    activity.userId === currentUser.email && activity.action === 'login'
                ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                if (userActivities.length > 0) {
                    latestLogin = new Date(userActivities[0].timestamp);
                }
            }
            
            if (!latestLogin) {
                const sessionLoginTime = sessionStorage.getItem('loginTimestamp');
                
                if (sessionLoginTime) {
                    latestLogin = new Date(parseInt(sessionLoginTime));
                } else {
                    latestLogin = new Date();
                    sessionStorage.setItem('loginTimestamp', latestLogin.getTime());
                    
                    if (currentUser) {
                        const newActivity = {
                            userId: currentUser.email,
                            action: 'login',
                            timestamp: latestLogin.toISOString()
                        };
                        
                        activities.push(newActivity);
                        localStorage.setItem('activities', JSON.stringify(activities));
                    }
                }
            } else {
                sessionStorage.setItem('loginTimestamp', latestLogin.getTime());
            }
            
            timestampElements.forEach(el => {
                el.setAttribute('data-time', latestLogin.getTime());
            });
            
            updateTimestamps();
            
            setInterval(updateTimestamps, 1000);
        }
        
        function updateTimestamps() {
            const now = new Date().getTime();
            
            timestampElements.forEach(el => {
                const timestamp = parseInt(el.getAttribute('data-time'));
                if (!timestamp) return;
                
                const elapsed = now - timestamp;
                el.textContent = formatElapsedTime(elapsed);
            });
        }
        
        function formatElapsedTime(elapsed) {
            const seconds = Math.floor(elapsed / 1000);
            
            if (seconds < 60) {
                return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
            }
            
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) {
                return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            }
            
            const hours = Math.floor(minutes / 60);
            if (hours < 24) {
                return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            }
            
            const days = Math.floor(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    });
    
    function updateTimestamps() {
        const now = new Date().getTime();
        
        timestampElements.forEach(el => {
            const timestamp = parseInt(el.getAttribute('data-time'));
            if (!timestamp) return;
            
            const elapsed = now - timestamp;
            
            const prevTimeData = el.getAttribute('data-prev-time') || '';
            const timeData = formatElapsedTimeData(elapsed);
            
            if (el.getAttribute('data-initialized') !== 'true') {
                el.innerHTML = createTimestampHTML(timeData);
                el.setAttribute('data-initialized', 'true');
            } else if (prevTimeData !== JSON.stringify(timeData)) {
                updateChangingDigits(el, prevTimeData ? JSON.parse(prevTimeData) : {}, timeData);
            }
            
            el.setAttribute('data-prev-time', JSON.stringify(timeData));
        });
    }
    
    function formatElapsedTimeData(elapsed) {
        const seconds = Math.floor(elapsed / 1000);
        
        if (seconds < 60) {
            return { value: seconds, unit: 'second' };
        }
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return { value: minutes, unit: 'minute' };
        }
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return { value: hours, unit: 'hour' };
        }
        
        const days = Math.floor(hours / 24);
        return { value: days, unit: 'day' };
    }
    
    function createTimestampHTML(timeData) {
        const { value, unit } = timeData;
        const valueStr = value.toString();
        const digits = valueStr.split('').map(digit => 
            `<span class="timestamp-digit">${digit}</span>`
        ).join('');
        
        return `${digits}<span class="timestamp-unit">${unit}${value !== 1 ? 's' : ''}</span><span class="timestamp-ago">ago</span>`;
    }
    
    function updateChangingDigits(element, prevData, newData) {
        if (prevData.unit !== newData.unit) {
            element.innerHTML = createTimestampHTML(newData);
            return;
        }
        
        const prevValue = prevData.value?.toString() || '0';
        const newValue = newData.value.toString();
        const digitElements = element.querySelectorAll('.timestamp-digit');
        
        for (let i = 0; i < Math.max(prevValue.length, newValue.length); i++) {
            const prevDigit = i < prevValue.length ? prevValue[i] : '0';
            const newDigit = i < newValue.length ? newValue[i] : '0';
            
            if (i >= digitElements.length) {
                const newDigitEl = document.createElement('span');
                newDigitEl.className = 'timestamp-digit changing';
                newDigitEl.textContent = newDigit;
                
                const unitEl = element.querySelector('.timestamp-unit');
                element.insertBefore(newDigitEl, unitEl);
                
                setTimeout(() => {
                    newDigitEl.classList.remove('changing');
                }, 10);
            } else if (prevDigit !== newDigit) {
                const digitEl = digitElements[i];
                digitEl.classList.add('changing');
                
                setTimeout(() => {
                    digitEl.textContent = newDigit;
                    setTimeout(() => {
                        digitEl.classList.remove('changing');
                    }, 400);
                }, 100);
            }
        }
        
        const unitEl = element.querySelector('.timestamp-unit');
        if (unitEl) {
            unitEl.textContent = `${newData.unit}${newData.value !== 1 ? 's' : ''}`;
        }
    }
});

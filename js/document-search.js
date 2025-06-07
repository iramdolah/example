document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('documentSearch');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchButton || !searchResults) return;
    
    function getAllSearchableContent() {
        const isDashboard = document.querySelector('.document-cards');
        const isDocuments = document.querySelector('.download-cards');
        const isSettings = document.querySelector('.settings-container');
        
        let elements = [];
        
        if (isDashboard) {
            const cards = document.querySelectorAll('.document-card');
            elements = Array.from(cards).map(card => {
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('p').textContent;
                
                return {
                    element: card,
                    title,
                    description,
                    searchText: `${title} ${description}`.toLowerCase(),
                    type: 'document'
                };
            });
        } else if (isDocuments) {
            const cards = document.querySelectorAll('.download-card');
            elements = Array.from(cards).map(card => {
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('p').textContent;
                const version = card.querySelector('.mod-version')?.textContent || '';
                const badge = card.querySelector('.version-badge')?.textContent || '';
                
                return {
                    element: card,
                    title,
                    description,
                    version,
                    badge,
                    searchText: `${title} ${description} ${version} ${badge}`.toLowerCase(),
                    type: 'mod'
                };
            });
        } else if (isSettings) {
            const sections = document.querySelectorAll('.setting-section');
            elements = Array.from(sections).map(section => {
                const title = section.querySelector('h2').textContent;
                const content = Array.from(section.querySelectorAll('label, p, button'))
                    .map(el => el.textContent)
                    .join(' ');
                
                return {
                    element: section,
                    title,
                    description: content,
                    searchText: `${title} ${content}`.toLowerCase(),
                    type: 'setting'
                };
            });
        }
        
        return elements;
    }
    
    let allSearchableContent = getAllSearchableContent();
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length === 0) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            showAllContent();
            return;
        }
        
        const matchedContent = allSearchableContent.filter(item => 
            item.searchText.includes(query)
        );
        
        searchResults.innerHTML = '';
        searchResults.classList.add('active');
        
        if (matchedContent.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found matching your search</div>';
        } else {
            matchedContent.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                const highlightedTitle = highlightText(item.title, query);
                
                resultItem.innerHTML = `
                    <div class="result-title">${highlightedTitle}</div>
                    <div class="result-description">${item.description.substring(0, 60)}${item.description.length > 60 ? '...' : ''}</div>
                `;
                
                resultItem.addEventListener('click', () => {
                    item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    item.element.classList.add('pulse-highlight');
                    setTimeout(() => {
                        item.element.classList.remove('pulse-highlight');
                    }, 2000);
                    
                    searchInput.value = '';
                    searchResults.classList.remove('active');
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        allSearchableContent.forEach(item => {
            if (matchedContent.includes(item)) {
                item.element.style.display = '';
            } else {
                item.element.style.display = 'none';
            }
        });
        
        if (document.querySelector('.document-section')) {
            const sections = document.querySelectorAll('.document-section');
            sections.forEach(section => {
                const visibleItems = Array.from(section.querySelectorAll('.download-card, .document-card'))
                    .filter(item => item.style.display !== 'none');
                    
                if (visibleItems.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = '';
                }
            });
        }
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function showAllContent() {
        allSearchableContent.forEach(item => {
            item.element.style.display = '';
        });
        
        if (document.querySelector('.document-section')) {
            const sections = document.querySelectorAll('.document-section');
            sections.forEach(section => {
                section.style.display = '';
            });
        }
    }
    
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput && e.target !== searchButton) {
            searchResults.classList.remove('active');
        }
    });
    
    searchInput.addEventListener('focus', function() {
        const searchBox = this.closest('.search-box');
        searchBox.style.width = '300px';
    });
    
    searchInput.addEventListener('blur', function() {
        const searchBox = this.closest('.search-box');
        if (this.value === '') {
            searchBox.style.width = '250px';
        }
    });
    
    const observer = new MutationObserver(() => {
        allSearchableContent = getAllSearchableContent();
    });
    
    ['document-section', 'documents-section', 'settings-container'].forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => {
            observer.observe(element, { childList: true, subtree: true });
        });
    });
});

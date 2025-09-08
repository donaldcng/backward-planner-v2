// BULLETPROOF THEME & FONT SIZE SWITCHING FOR BACKWARD PLANNER
console.log('🚀 Backward Planner initializing...');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, binding events...');
    
    // Load saved settings
    const savedTheme = localStorage.getItem('backward-planner-theme') || 'classic-blue';
    const savedFontSize = localStorage.getItem('backward-planner-font-size') || 'medium';
    
    // Apply saved settings
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
    
    // Bind events
    bindThemeEvents();
    bindFontSizeEvents();
    
    console.log('🎉 Event binding complete!');
});

// THEME SWITCHING - GUARANTEED TO WORK
function applyTheme(themeId) {
    console.log('🎨 Applying theme:', themeId);
    
    // Apply theme attribute
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Save to localStorage
    localStorage.setItem('backward-planner-theme', themeId);
    
    // Update visual selection
    updateThemeSelection(themeId);
    
    console.log('✅ Theme applied:', themeId);
}

function updateThemeSelection(activeTheme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const isActive = option.getAttribute('data-theme') === activeTheme;
        option.classList.toggle('active', isActive);
    });
}

function bindThemeEvents() {
    const themeSelector = document.getElementById('theme-selector');
    if (!themeSelector) {
        console.error('❌ Theme selector not found!');
        return;
    }
    
    // Use event delegation
    themeSelector.addEventListener('click', function(event) {
        console.log('🖱️ Theme clicked:', event.target);
        
        // Find the theme option
        let themeOption = event.target;
        while (themeOption && !themeOption.hasAttribute('data-theme')) {
            themeOption = themeOption.parentElement;
            if (themeOption === themeSelector) {
                themeOption = null;
                break;
            }
        }
        
        if (themeOption && themeOption.hasAttribute('data-theme')) {
            const themeId = themeOption.getAttribute('data-theme');
            console.log('🎯 Theme selected:', themeId);
            applyTheme(themeId);
            showToast(`Theme changed to ${themeOption.textContent.trim()}`, 'success');
        }
    });
    
    console.log('✅ Theme events bound');
}

// FONT SIZE SWITCHING - GUARANTEED TO WORK
function applyFontSize(fontSizeId) {
    console.log('📝 Applying font size:', fontSizeId);
    
    // Apply font size attribute
    document.documentElement.setAttribute('data-font-size', fontSizeId);
    
    // Save to localStorage
    localStorage.setItem('backward-planner-font-size', fontSizeId);
    
    // Update visual selection
    updateFontSizeSelection(fontSizeId);
    
    console.log('✅ Font size applied:', fontSizeId);
}

function updateFontSizeSelection(activeFontSize) {
    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            const isActive = radio.value === activeFontSize;
            radio.checked = isActive;
            option.classList.toggle('selected', isActive);
        }
    });
}

function bindFontSizeEvents() {
    const fontSizeSelector = document.getElementById('font-size-selector');
    if (!fontSizeSelector) {
        console.error('❌ Font size selector not found!');
        return;
    }
    
    // Use event delegation
    fontSizeSelector.addEventListener('click', function(event) {
        console.log('🖱️ Font size clicked:', event.target);
        
        let fontOption = event.target;
        let radioInput = null;
        
        // Handle clicking on radio button directly
        if (fontOption.type === 'radio' && fontOption.name === 'fontSize') {
            radioInput = fontOption;
            fontOption = fontOption.closest('.font-option');
        }
        // Handle clicking on label or container
        else {
            while (fontOption && !fontOption.classList.contains('font-option')) {
                fontOption = fontOption.parentElement;
                if (fontOption === fontSizeSelector) {
                    fontOption = null;
                    break;
                }
            }
            
            if (fontOption) {
                radioInput = fontOption.querySelector('input[type="radio"]');
            }
        }
        
        if (radioInput && fontOption) {
            const fontSizeId = radioInput.value;
            console.log('🎯 Font size selected:', fontSizeId);
            
            radioInput.checked = true;
            applyFontSize(fontSizeId);
            showToast(`Font size changed to ${fontSizeId}`, 'success');
        }
    });
    
    console.log('✅ Font size events bound');
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast--${type}`);
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    
    toast.innerHTML = `
        <span>${icons[type] || icons.info}</span>
        <span>${escapeHtml(message)}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// DEBUG FUNCTIONS (Available in browser console)
window.testTheme = function(themeId) {
    applyTheme(themeId);
};

window.testFontSize = function(fontSizeId) {
    applyFontSize(fontSizeId);
};

console.log('🔧 Debug: Use testTheme("dark-mode") or testFontSize("large") in console');
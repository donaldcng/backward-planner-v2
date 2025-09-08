// ==========================================================================
// BACKWARD PLANNER - CORRECTED JAVASCRIPT (LIGHT MODE DEFAULT)
// Fixed: Default light theme, proper theme switching
// ==========================================================================

console.log('🚀 Backward Planner starting (Light Mode Default)...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing...');
    
    // IMPORTANT: Default to light mode if no theme is saved
    const savedTheme = localStorage.getItem('backward-planner-theme');
    const savedFontSize = localStorage.getItem('backward-planner-font-size') || 'medium';
    
    // Clear any existing theme attributes first
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    
    // Only apply saved theme if it exists, otherwise default to light (no theme attribute)
    if (savedTheme && savedTheme !== 'classic-blue') {
        applyTheme(savedTheme);
    } else {
        // Default light theme (classic-blue) - no data-theme attribute needed
        applyTheme('classic-blue');
    }
    
    applyFontSize(savedFontSize);
    bindThemeEvents();
    bindFontSizeEvents();
    
    console.log('🎉 Initialization complete - Default Light Mode Active');
});

// THEME SWITCHING - CORRECTED FOR LIGHT DEFAULT
function applyTheme(themeId) {
    console.log('🎨 Applying theme:', themeId);
    
    // Remove any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    
    // Only set data-theme attribute for non-default themes
    if (themeId !== 'classic-blue') {
        document.documentElement.setAttribute('data-theme', themeId);
    }
    
    // Save to localStorage
    localStorage.setItem('backward-planner-theme', themeId);
    
    // Update visual selection
    updateThemeSelection(themeId);
    
    console.log('✅ Theme applied:', themeId, themeId === 'classic-blue' ? '(Default Light)' : '(Custom Theme)');
}

function updateThemeSelection(activeTheme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const isActive = option.getAttribute('data-theme') === activeTheme;
        option.classList.toggle('active', isActive);
        console.log('Theme option', option.getAttribute('data-theme'), isActive ? 'activated' : 'deactivated');
    });
}

function bindThemeEvents() {
    const themeSelector = document.getElementById('theme-selector');
    if (!themeSelector) {
        console.error('❌ Theme selector not found!');
        return;
    }
    
    // Event delegation for theme switching
    themeSelector.addEventListener('click', function(event) {
        console.log('🖱️ Theme selector clicked');
        
        // Find the clicked theme option
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
    
    console.log('✅ Theme events bound successfully');
}

// FONT SIZE SWITCHING
function applyFontSize(fontSizeId) {
    console.log('📝 Applying font size:', fontSizeId);
    
    // Remove existing font size attributes
    document.documentElement.removeAttribute('data-font-size');
    document.body.removeAttribute('data-font-size');
    
    // Only set attribute for non-default font sizes
    if (fontSizeId !== 'medium') {
        document.documentElement.setAttribute('data-font-size', fontSizeId);
    }
    
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
            console.log('Font option', radio.value, isActive ? 'selected' : 'deselected');
        }
    });
}

function bindFontSizeEvents() {
    const fontSizeSelector = document.getElementById('font-size-selector');
    if (!fontSizeSelector) {
        console.error('❌ Font size selector not found!');
        return;
    }
    
    // Event delegation for font size switching
    fontSizeSelector.addEventListener('click', function(event) {
        console.log('🖱️ Font size selector clicked');
        
        let fontOption = event.target;
        let radioInput = null;
        
        // Handle direct radio click
        if (fontOption.type === 'radio' && fontOption.name === 'fontSize') {
            radioInput = fontOption;
            fontOption = fontOption.closest('.font-option');
        }
        // Handle label/container click
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
    
    console.log('✅ Font size events bound successfully');
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

// FORCE RESET TO LIGHT MODE FUNCTION
function resetToLightMode() {
    console.log('🔄 Forcing reset to light mode...');
    
    // Remove all theme attributes
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    
    // Clear localStorage
    localStorage.removeItem('backward-planner-theme');
    
    // Update UI
    updateThemeSelection('classic-blue');
    
    showToast('Reset to Classic Blue (Light Mode)', 'info');
    
    console.log('✅ Reset to light mode complete');
}

// DEBUG FUNCTIONS
window.testTheme = function(themeId) {
    console.log('🧪 Testing theme:', themeId);
    applyTheme(themeId);
};

window.testFontSize = function(fontSizeId) {
    console.log('🧪 Testing font size:', fontSizeId);
    applyFontSize(fontSizeId);
};

window.resetToLightMode = resetToLightMode;

// IMMEDIATE FIX: Force light mode if page loads dark
setTimeout(function() {
    const computedBg = getComputedStyle(document.body).backgroundColor;
    const bgValues = computedBg.match(/\d+/g);
    
    if (bgValues) {
        const [r, g, b] = bgValues.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // If background is too dark (< 128), force light mode
        if (brightness < 128) {
            console.log('🚨 Dark background detected, forcing light mode...');
            resetToLightMode();
        }
    }
}, 500);

console.log('🔧 Debug: Use resetToLightMode() to fix dark mode issues');
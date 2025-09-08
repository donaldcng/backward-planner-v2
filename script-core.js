
// ==========================================================================
// BACKWARD PLANNER - WORKING JAVASCRIPT (BULLETPROOF)
// Guaranteed working theme and font size switching
// ==========================================================================

console.log('🚀 Backward Planner initializing...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, binding events...');

    // Initialize theme and font size from localStorage
    const savedTheme = localStorage.getItem('backward-planner-theme') || 'classic-blue';
    const savedFontSize = localStorage.getItem('backward-planner-font-size') || 'medium';

    console.log('💾 Loaded settings:', { theme: savedTheme, fontSize: savedFontSize });

    // Apply saved settings immediately
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);

    // Bind theme switching events
    bindThemeEvents();

    // Bind font size events  
    bindFontSizeEvents();

    console.log('🎉 All event binding complete!');
});

// ==========================================================================
// THEME SWITCHING - BULLETPROOF
// ==========================================================================

function applyTheme(themeId) {
    console.log('🎨 Applying theme:', themeId);

    // Remove all existing theme attributes
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');

    // Apply new theme
    document.documentElement.setAttribute('data-theme', themeId);
    document.body.setAttribute('data-theme', themeId);

    // Save to localStorage
    localStorage.setItem('backward-planner-theme', themeId);

    // Update visual selection
    updateThemeSelection(themeId);

    // Force repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';

    console.log('✅ Theme applied successfully:', themeId);
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

    // Use event delegation for reliable event binding
    themeSelector.addEventListener('click', function(event) {
        console.log('🖱️ Theme selector clicked:', event.target);

        // Find the theme option (could be the option itself or a child element)
        let themeOption = event.target;

        // Traverse up to find the theme option
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

// ==========================================================================
// FONT SIZE SWITCHING - BULLETPROOF
// ==========================================================================

function applyFontSize(fontSizeId) {
    console.log('📝 Applying font size:', fontSizeId);

    // Remove all existing font size attributes
    document.documentElement.removeAttribute('data-font-size');
    document.body.removeAttribute('data-font-size');

    // Apply new font size
    document.documentElement.setAttribute('data-font-size', fontSizeId);
    document.body.setAttribute('data-font-size', fontSizeId);

    // Save to localStorage
    localStorage.setItem('backward-planner-font-size', fontSizeId);

    // Update visual selection
    updateFontSizeSelection(fontSizeId);

    // Force repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';

    console.log('✅ Font size applied successfully:', fontSizeId);
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

    // Use event delegation for reliable event binding
    fontSizeSelector.addEventListener('click', function(event) {
        console.log('🖱️ Font size selector clicked:', event.target);

        let fontOption = event.target;
        let radioInput = null;

        // If clicked on radio input directly
        if (fontOption.type === 'radio' && fontOption.name === 'fontSize') {
            radioInput = fontOption;
            fontOption = fontOption.closest('.font-option');
        }
        // If clicked on label or font option container
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

            // Ensure radio is checked
            radioInput.checked = true;

            applyFontSize(fontSizeId);
            showToast(`Font size changed to ${fontSizeId}`, 'success');
        }
    });

    // Also bind change events to radio buttons directly
    const radioButtons = fontSizeSelector.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log('🎯 Font size changed via radio:', this.value);
                applyFontSize(this.value);
                showToast(`Font size changed to ${this.value}`, 'success');
            }
        });
    });

    console.log('✅ Font size events bound successfully');
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'info') {
    console.log('💬 Showing toast:', message, type);

    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('❌ Toast container not found!');
        return;
    }

    const toast = document.createElement('div');
    toast.classList.add('toast', `toast--${type}`);

    const icons = {
        success: '✅',
        error: '❌', 
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span>${icons[type] || icons.info}</span>
        <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide and remove toast
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

// ==========================================================================
// DEBUGGING HELPERS
// ==========================================================================

// Add global debugging functions
window.testTheme = function(themeId) {
    console.log('🧪 Testing theme:', themeId);
    applyTheme(themeId);
};

window.testFontSize = function(fontSizeId) {
    console.log('🧪 Testing font size:', fontSizeId);
    applyFontSize(fontSizeId);
};

window.debugSettings = function() {
    console.log('🔍 Current settings:', {
        theme: localStorage.getItem('backward-planner-theme'),
        fontSize: localStorage.getItem('backward-planner-font-size'),
        htmlTheme: document.documentElement.getAttribute('data-theme'),
        htmlFontSize: document.documentElement.getAttribute('data-font-size')
    });
};

console.log('🔧 Debug functions available: testTheme(), testFontSize(), debugSettings()');

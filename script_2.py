# Create a minimal CSS addition to ensure themes work
css_theme_fix = '''
/* ADD TO TOP OF YOUR STYLE.CSS - THEME FIX */

/* Ensure theme switching works - add !important for reliability */
[data-theme="forest-green"] {
  --primary: #047857 !important;
  --primary-hover: #065f46 !important;
  --primary-light: #d1fae5 !important;
}

[data-theme="sunset-orange"] {
  --primary: #ea580c !important;
  --primary-hover: #c2410c !important;
  --primary-light: #fed7aa !important;
}

[data-theme="dark-mode"] {
  --primary: #3b82f6 !important;
  --primary-hover: #2563eb !important;
  --primary-light: #1e3a8a !important;
  --background: #0f172a !important;
  --surface: #1e293b !important;
  --surface-hover: #334155 !important;
  --border: #475569 !important;
  --text: #f1f5f9 !important;
  --text-secondary: #cbd5e1 !important;
  --text-muted: #94a3b8 !important;
}

[data-theme="purple-dark"] {
  --primary: #a855f7 !important;
  --primary-hover: #9333ea !important;
  --primary-light: #581c87 !important;
  --background: #18181b !important;
  --surface: #3f3f46 !important;
  --surface-hover: #52525b !important;
  --border: #71717a !important;
  --text: #fafafa !important;
  --text-secondary: #d4d4d8 !important;
  --text-muted: #a1a1aa !important;
}

/* Font size switching - add !important for reliability */
[data-font-size="small"] {
  --font-base: 0.875rem !important;
  --font-lg: 1rem !important;
  --font-xl: 1.125rem !important;
  --font-2xl: 1.25rem !important;
}

[data-font-size="large"] {
  --font-base: 1.125rem !important;
  --font-lg: 1.25rem !important;
  --font-xl: 1.5rem !important;
  --font-2xl: 1.75rem !important;
}
'''

print("CSS Theme Fix to add to the top of style.css:")
print(css_theme_fix)

print("\n" + "="*50)
print("🔧 QUICK DEBUGGING STEPS:")
print("="*50)

debug_steps = """
1. Test in Browser Console:
   - Open your live site: https://donaldcng.github.io/backward-planner-v2/
   - Press F12 to open console
   - Type: testTheme("dark-mode")
   - Type: testFontSize("large")
   - Look for console messages

2. Check if Elements Exist:
   - In console type: document.getElementById('theme-selector')
   - Should return an element, not null
   - In console type: document.getElementById('font-size-selector')
   - Should return an element, not null

3. Manual Theme Test:
   - In console type: document.documentElement.setAttribute('data-theme', 'dark-mode')
   - Page should immediately turn dark
   - If not, CSS theme selectors are the problem

4. Check Current Files:
   - View source of your live site
   - Verify script.js is loading properly
   - Check for JavaScript errors in console
"""

print(debug_steps)
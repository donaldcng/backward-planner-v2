# Let me create a complete, working CSS file that won't get truncated
css_content = '''/* Backward Planner - Complete CSS (Working Version) */

:root {
  --primary: #1d4ed8;
  --primary-hover: #1e40af;
  --primary-light: #e0e7ff;
  --bg: #ffffff;
  --surface: #f9fafb;
  --surface-hover: #f3f4f6;
  --border: #d1d5db;
  --text: #111827;
  --text-2: #374151;
  --text-3: #6b7280;
  --success: #047857;
  --danger: #dc2626;
  --shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --radius: 0.5rem;
  --space: 1rem;
}

[data-theme="forest-green"] { --primary: #047857; --primary-hover: #065f46; --primary-light: #d1fae5; }
[data-theme="sunset-orange"] { --primary: #ea580c; --primary-hover: #c2410c; --primary-light: #fed7aa; }
[data-theme="dark-mode"] { --primary: #3b82f6; --bg: #0f172a; --surface: #1e293b; --surface-hover: #334155; --border: #475569; --text: #f1f5f9; --text-2: #cbd5e1; --text-3: #94a3b8; }
[data-theme="purple-dark"] { --primary: #a855f7; --bg: #18181b; --surface: #3f3f46; --surface-hover: #52525b; --border: #71717a; --text: #fafafa; --text-2: #d4d4d8; --text-3: #a1a1aa; }

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  transition: all 0.3s ease;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space); width: 100%; }

/* Navigation */
.nav {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.nav__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem var(--space);
  min-height: 48px;
}

.nav__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.nav__toggle-bar {
  width: 18px;
  height: 2px;
  background: var(--text);
  margin: 1px 0;
  transition: 0.3s;
}

.nav__menu {
  display: flex;
  list-style: none;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
}

.nav__link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--text-2);
  text-decoration: none;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.nav__link:hover, .nav__link--active {
  color: var(--primary);
  background: var(--primary-light);
}

@media (max-width: 600px) {
  .nav__toggle { display: flex; }
  .nav__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface);
    flex-direction: column;
    gap: 0;
    box-shadow: var(--shadow-lg);
    border-top: 1px solid var(--border);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s;
  }
  .nav__menu--open { max-height: 200px; }
  .nav__link { padding: 0.75rem; border-bottom: 1px solid var(--border); border-radius: 0; }
}

/* Main */
.main { min-height: calc(100vh - 48px); padding: 1.5rem 0; }

.page { display: none; }
.page--active { display: block; animation: fadeIn 0.3s ease; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page__header {
  text-align: center;
  margin-bottom: 2rem;
}

.page__header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.page__header p {
  font-size: 1rem;
  color: var(--text-2);
  max-width: 500px;
  margin: 0 auto;
}

/* Cards */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.2s;
}

.card:hover { box-shadow: var(--shadow-lg); }

.card__header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.card__header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.card__header p {
  color: var(--text-2);
  margin: 0;
  font-size: 0.875rem;
}

.card__content { padding: 1.25rem; }

/* Forms */
.form-group { margin-bottom: 1.25rem; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  gap: var(--space);
  align-items: end;
}

@media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }

label {
  display: block;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input[type="text"], input[type="number"], input[type="date"], textarea, select {
  width: 100%;
  padding: 0.75rem var(--space);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  color: var(--text);
  background: var(--bg);
  transition: all 0.2s;
  min-height: 48px;
  font-family: inherit;
}

input[type="date"] {
  padding: var(--space) 1.25rem;
  min-height: 56px;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

textarea { resize: vertical; min-height: 80px; }

/* Checkboxes */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 0;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: normal;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 0.25rem;
  margin-right: 0.75rem;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s;
  background: var(--bg);
}

.checkbox-label input:checked + .checkbox-custom {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem var(--space);
  border: 2px solid transparent;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 40px;
  gap: 0.5rem;
  white-space: nowrap;
  font-family: inherit;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn--primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.btn--secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--surface-hover);
  transform: translateY(-1px);
}

.btn--outline {
  background: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

.btn--outline:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.btn--danger {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
}

.btn--small {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  min-height: 32px;
}

/* Timeline */
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space);
  margin-bottom: var(--space);
}

.timeline-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.export-group { display: flex; gap: 0.25rem; }
.timeline-controls { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }

@media (max-width: 500px) {
  .timeline-header { flex-direction: column; }
  .timeline-controls { flex-direction: column; }
  .timeline-controls .btn { width: 100%; }
}

/* Table */
.table-container {
  overflow-x: auto;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-top: var(--space);
}

.plan-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  background: var(--surface);
}

.plan-table th, .plan-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.plan-table th {
  background: var(--surface-hover);
  font-weight: 600;
  text-transform: uppercase;
}

.plan-table tbody tr:hover { background: var(--surface-hover); }

@media (max-width: 600px) { .hide-mobile { display: none; } }

/* Empty states */
.no-tasks-message {
  text-align: center;
  padding: 2.5rem var(--space);
  border-radius: var(--radius);
  background: var(--surface-hover);
  border: 2px dashed var(--border);
  margin-top: var(--space);
}

.empty-state { max-width: 300px; margin: 0 auto; }
.empty-state__icon { font-size: 1.875rem; margin-bottom: var(--space); opacity: 0.6; }
.empty-state h4 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem; }
.empty-state p { color: var(--text-2); font-size: 0.875rem; }

/* Deadline display */
.deadline-display {
  margin-top: var(--space);
  padding: var(--space) 1.25rem;
  background: var(--primary-light);
  border-radius: var(--radius);
  text-align: center;
  font-weight: 600;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.deadline-display:empty { display: none; }

/* Theme grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space);
  margin-top: var(--space);
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: var(--space);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  background: var(--surface);
}

.theme-option:hover, .theme-option.active {
  border-color: var(--primary);
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.theme-preview {
  width: 70px;
  height: 45px;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.theme-preview--blue { background: linear-gradient(45deg, #1d4ed8 0%, #3b82f6 50%, #e0e7ff 100%); }
.theme-preview--green { background: linear-gradient(45deg, #047857 0%, #10b981 50%, #d1fae5 100%); }
.theme-preview--orange { background: linear-gradient(45deg, #ea580c 0%, #f97316 50%, #fed7aa 100%); }
.theme-preview--dark { background: linear-gradient(45deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%); }
.theme-preview--purple-dark { background: linear-gradient(45deg, #18181b 0%, #3f3f46 50%, #a855f7 100%); }

/* Font options */
.font-size-options { display: flex; flex-direction: column; gap: 0.75rem; margin-top: var(--space); }

.font-option {
  display: flex;
  align-items: center;
  padding: var(--space);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--surface);
  font-weight: 500;
}

.font-option:hover, .font-option.selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.font-option input { margin-right: 0.75rem; }

/* Modal */
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: var(--space);
}

.modal.active { display: flex; }

.modal__overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
}

.modal__content {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.modal__header h3 { font-size: 1.25rem; font-weight: 600; margin: 0; }

.modal__close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-2);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  width: 32px; height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__close:hover { background: var(--surface-hover); }

.modal__body { padding: 1.25rem; }

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem;
  border-top: 1px solid var(--border);
}

/* Loading & Toast */
.loading {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
}

.loading__spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space);
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.toast-container {
  position: fixed;
  top: var(--space);
  right: var(--space);
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 350px;
}

.toast {
  padding: 0.75rem var(--space);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transform: translateX(100%);
  transition: transform 0.3s;
  font-size: 0.875rem;
  color: var(--text);
}

.toast.show { transform: translateX(0); }

.toast--success { border-left: 4px solid var(--success); }
.toast--error { border-left: 4px solid var(--danger); }
.toast--info { border-left: 4px solid var(--primary); }

/* Utilities */
.text-center { text-align: center; }

/* Responsive */
@media (max-width: 768px) {
  .container { padding: 0 0.75rem; }
  .main { padding: var(--space) 0; }
  .card__header, .card__content { padding: var(--space); }
  .theme-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Focus */
:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }'''

# Save the CSS to a file
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Complete CSS file saved successfully!")
print(f"Total length: {len(css_content)} characters")
# Update the CSS to make the date picker button larger
css_update = '''
/* Update for larger date picker button */
input[type="date"] {
  padding: 1rem 1.25rem !important;
  min-height: 64px !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  cursor: pointer;
  border: 3px solid var(--border) !important;
  border-radius: 0.75rem !important;
  background-color: var(--bg);
  transition: all 0.2s;
  position: relative;
}

input[type="date"]:hover {
  border-color: var(--primary) !important;
  background-color: var(--surface-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

input[type="date"]:focus {
  outline: none !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px var(--primary-light) !important;
}

/* Custom date picker icon styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%231d4ed8'%3e%3cpath fill-rule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clip-rule='evenodd'/%3e%3c/svg%3e");
  background-position: right 16px center;
  background-repeat: no-repeat;
  background-size: 24px;
}

/* Holiday items styling improvement */
.holiday-items {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space);
  background: var(--surface-hover);
}

.holiday-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
}

.holiday-item:last-child {
  border-bottom: none;
}

.holiday-date {
  font-weight: 600;
  min-width: 100px;
  color: var(--primary);
}
'''

print("CSS update for larger date picker button:")
print(css_update)

# Also create a holiday items container in the HTML
html_holiday_section = '''
<!-- Add this to your HTML in the holiday settings card -->
<div class="holiday-list">
  <h4>📋 Hong Kong Public Holidays (2024-2027)</h4>
  <div class="holiday-items" id="holiday-items">
    <!-- Holidays will be populated by JavaScript -->
  </div>
</div>
'''

print("\nHTML structure needed for holidays:")
print(html_holiday_section)
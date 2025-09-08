// ==========================================================================
// Enhanced Backward Planner - Complete JavaScript Application
// Preserves all original functionality while adding new enhancements
// ==========================================================================

// Application State
const state = {
  // Original functionality preserved
  deadline: null,
  tasks: [],
  dateFormat: 'yyyy-MM-dd',
  skipHolidays: true,
  holidays: [],
  holidaySet: new Set(),
  
  // New enhancements
  currentTheme: localStorage.getItem('backward-planner-theme') || 'classic-blue',
  currentFontSize: localStorage.getItem('backward-planner-font-size') || 'medium',
  currentPage: 'planning',
  projectName: '',
  projectDescription: '',
  
  // UI state
  isGeneratingTimeline: false,
  sortableInstance: null,
  editingTaskIndex: -1
};

// DOM References
const refs = {
  // Navigation
  navToggle: document.getElementById('navToggle'),
  navMenu: document.getElementById('navMenu'),
  navLinks: document.querySelectorAll('.nav__link'),
  
  // Pages
  pages: document.querySelectorAll('.page'),
  
  // Project Setup
  projectNameInput: document.getElementById('project-name'),
  projectDescriptionInput: document.getElementById('project-description'),
  deadlineInput: document.getElementById('deadline'),
  setDeadlineBtn: document.getElementById('set-deadline'),
  deadlineDisplay: document.getElementById('deadline-display'),
  
  // Tasks
  taskSection: document.getElementById('task-section'),
  taskNameInput: document.getElementById('task-name'),
  taskDurationInput: document.getElementById('task-duration'),
  addTaskBtn: document.getElementById('add-task'),
  
  // Timeline
  generateTimelineBtn: document.getElementById('generate-timeline'),
  loadSampleBtn: document.getElementById('load-sample'),
  planTable: document.getElementById('plan-table'),
  planBody: document.getElementById('plan-body'),
  noTasksMsg: document.getElementById('no-tasks-msg'),
  
  // Actions
  clearAllBtn: document.getElementById('clear-all'),
  exportBtn: document.getElementById('export-btn'),
  importBtn: document.getElementById('import-btn'),
  importFile: document.getElementById('import-file'),
  
  // Settings
  themeSelector: document.getElementById('theme-selector'),
  fontSizeSelector: document.getElementById('font-size-selector'),
  dateFormatSelect: document.getElementById('date-format'),
  excludeHolidaysCheckbox: document.getElementById('exclude-holidays'),
  holidayItems: document.getElementById('holiday-items'),
  resetSettingsBtn: document.getElementById('reset-settings'),
  saveSettingsBtn: document.getElementById('save-settings'),
  
  // Modal
  editTaskModal: document.getElementById('edit-task-modal'),
  editTaskForm: document.getElementById('edit-task-form'),
  editTaskNameInput: document.getElementById('edit-task-name'),
  editTaskDurationInput: document.getElementById('edit-task-duration'),
  editTaskDescriptionInput: document.getElementById('edit-task-description'),
  cancelEditBtn: document.getElementById('cancel-edit'),
  saveEditBtn: document.getElementById('save-edit'),
  
  // Loading & Toast
  loading: document.getElementById('loading'),
  toastContainer: document.getElementById('toast-container')
};

// Hong Kong Holidays Data (preserved from original)
const holidaysData = {
  "vcalendar": [{
    "vevent": [
      {"dtstart": ["20240101"], "summary": "New Year's Day"},
      {"dtstart": ["20240210"], "summary": "Lunar New Year's Day"},
      {"dtstart": ["20240212"], "summary": "The third day of Lunar New Year"},
      {"dtstart": ["20240213"], "summary": "The fourth day of Lunar New Year"},
      {"dtstart": ["20240329"], "summary": "Good Friday"},
      {"dtstart": ["20240330"], "summary": "The day following Good Friday"},
      {"dtstart": ["20240401"], "summary": "Easter Monday"},
      {"dtstart": ["20240404"], "summary": "Ching Ming Festival"},
      {"dtstart": ["20240501"], "summary": "Labour Day"},
      {"dtstart": ["20240515"], "summary": "The Birthday of the Buddha"},
      {"dtstart": ["20240610"], "summary": "Tuen Ng Festival"},
      {"dtstart": ["20240701"], "summary": "Hong Kong Special Administrative Region Establishment Day"},
      {"dtstart": ["20240918"], "summary": "The day following the Chinese Mid-Autumn Festival"},
      {"dtstart": ["20241001"], "summary": "National Day"},
      {"dtstart": ["20241011"], "summary": "Chung Yeung Festival"},
      {"dtstart": ["20241225"], "summary": "Christmas Day"},
      {"dtstart": ["20241226"], "summary": "The first weekday after Christmas Day"},
      {"dtstart": ["20250101"], "summary": "New Year's Day"},
      {"dtstart": ["20250129"], "summary": "Lunar New Year's Day"},
      {"dtstart": ["20250130"], "summary": "The second day of Lunar New Year"},
      {"dtstart": ["20250131"], "summary": "The third day of Lunar New Year"},
      {"dtstart": ["20250404"], "summary": "Ching Ming Festival"},
      {"dtstart": ["20250418"], "summary": "Good Friday"},
      {"dtstart": ["20250419"], "summary": "The day following Good Friday"},
      {"dtstart": ["20250421"], "summary": "Easter Monday"},
      {"dtstart": ["20250501"], "summary": "Labour Day"},
      {"dtstart": ["20250505"], "summary": "The Birthday of the Buddha"},
      {"dtstart": ["20250531"], "summary": "Tuen Ng Festival"},
      {"dtstart": ["20250701"], "summary": "Hong Kong Special Administrative Region Establishment Day"},
      {"dtstart": ["20251001"], "summary": "National Day"},
      {"dtstart": ["20251007"], "summary": "The day following the Chinese Mid-Autumn Festival"},
      {"dtstart": ["20251029"], "summary": "Chung Yeung Festival"},
      {"dtstart": ["20251225"], "summary": "Christmas Day"},
      {"dtstart": ["20251226"], "summary": "The first weekday after Christmas Day"}
    ]
  }]
};

// ==========================================================================
// Application Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  loadHolidays();
  bindEventListeners();
  applyTheme(state.currentTheme);
  applyFontSize(state.currentFontSize);
  renderHolidays();
  updateUI();
  
  // Initialize drag and drop when tasks are present
  initDragAndDrop();
  
  showToast('Welcome to Backward Planner!', 'info');
}

// ==========================================================================
// Event Listeners
// ==========================================================================

function bindEventListeners() {
  // Navigation
  refs.navToggle?.addEventListener('click', toggleMobileMenu);
  refs.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Project Setup
  refs.setDeadlineBtn?.addEventListener('click', handleSetDeadline);
  refs.projectNameInput?.addEventListener('input', handleProjectNameChange);
  refs.projectDescriptionInput?.addEventListener('input', handleProjectDescriptionChange);
  
  // Tasks
  refs.addTaskBtn?.addEventListener('click', handleAddTask);
  refs.taskNameInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTask();
  });
  
  // Timeline
  refs.generateTimelineBtn?.addEventListener('click', handleGenerateTimeline);
  refs.loadSampleBtn?.addEventListener('click', loadSampleProject);
  
  // Actions
  refs.clearAllBtn?.addEventListener('click', handleClearAll);
  refs.exportBtn?.addEventListener('click', handleExport);
  refs.importBtn?.addEventListener('click', () => refs.importFile?.click());
  refs.importFile?.addEventListener('change', handleImport);
  
  // Settings
  refs.themeSelector?.addEventListener('click', handleThemeChange);
  refs.fontSizeSelector?.addEventListener('change', handleFontSizeChange);
  refs.dateFormatSelect?.addEventListener('change', handleDateFormatChange);
  refs.excludeHolidaysCheckbox?.addEventListener('change', handleHolidayToggle);
  refs.resetSettingsBtn?.addEventListener('click', resetSettings);
  refs.saveSettingsBtn?.addEventListener('click', saveSettings);
  
  // Modal
  refs.cancelEditBtn?.addEventListener('click', closeEditModal);
  refs.saveEditBtn?.addEventListener('click', saveTaskEdit);
  refs.editTaskModal?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__overlay')) closeEditModal();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);
}

// ==========================================================================
// Navigation
// ==========================================================================

function toggleMobileMenu() {
  refs.navMenu?.classList.toggle('nav__menu--open');
  const isOpen = refs.navMenu?.classList.contains('nav__menu--open');
  refs.navToggle?.setAttribute('aria-expanded', isOpen);
}

function handleNavigation(e) {
  e.preventDefault();
  const page = e.currentTarget.dataset.page;
  if (page) {
    showPage(page);
    // Close mobile menu
    refs.navMenu?.classList.remove('nav__menu--open');
    refs.navToggle?.setAttribute('aria-expanded', 'false');
  }
}

function showPage(pageId) {
  state.currentPage = pageId;
  
  // Update pages
  refs.pages.forEach(page => {
    page.classList.toggle('page--active', page.id === pageId + 'Page');
  });
  
  // Update navigation
  refs.navLinks.forEach(link => {
    const isActive = link.dataset.page === pageId;
    link.classList.toggle('nav__link--active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// ==========================================================================
// Project Management
// ==========================================================================

function handleProjectNameChange(e) {
  state.projectName = e.target.value;
}

function handleProjectDescriptionChange(e) {
  state.projectDescription = e.target.value;
}

function handleSetDeadline() {
  const dateValue = refs.deadlineInput?.value;
  if (!dateValue) {
    showToast('Please select a deadline date', 'warning');
    return;
  }
  
  const deadline = new Date(dateValue + 'T00:00:00');
  if (deadline <= new Date()) {
    showToast('Deadline must be in the future', 'warning');
    return;
  }
  
  state.deadline = deadline;
  updateDeadlineDisplay();
  refs.taskSection.style.display = 'block';
  showToast('Deadline set successfully!', 'success');
}

function updateDeadlineDisplay() {
  if (refs.deadlineDisplay && state.deadline) {
    refs.deadlineDisplay.textContent = `Deadline: ${formatDate(state.deadline)}`;
    refs.deadlineDisplay.style.display = 'block';
  }
}

// ==========================================================================
// Task Management
// ==========================================================================

function handleAddTask() {
  const name = refs.taskNameInput?.value.trim();
  const duration = parseInt(refs.taskDurationInput?.value, 10);
  
  if (!name) {
    showToast('Please enter a task name', 'warning');
    refs.taskNameInput?.focus();
    return;
  }
  
  if (!duration || duration < 1) {
    showToast('Please enter a valid duration (minimum 1 day)', 'warning');
    refs.taskDurationInput?.focus();
    return;
  }
  
  if (!state.deadline) {
    showToast('Please set a deadline first', 'warning');
    return;
  }
  
  // Add task to state
  state.tasks.push({
    id: Date.now(),
    name: name,
    duration: duration,
    description: '',
    startDate: null,
    endDate: null
  });
  
  // Clear inputs
  refs.taskNameInput.value = '';
  refs.taskDurationInput.value = '';
  
  // Calculate timeline and update UI
  calculateTimeline();
  updateUI();
  
  showToast(`Task "${name}" added successfully!`, 'success');
  refs.taskNameInput?.focus();
}

function editTask(index) {
  if (index < 0 || index >= state.tasks.length) return;
  
  state.editingTaskIndex = index;
  const task = state.tasks[index];
  
  refs.editTaskNameInput.value = task.name;
  refs.editTaskDurationInput.value = task.duration;
  refs.editTaskDescriptionInput.value = task.description || '';
  
  refs.editTaskModal?.classList.add('active');
  refs.editTaskNameInput?.focus();
}

function saveTaskEdit() {
  if (state.editingTaskIndex < 0) return;
  
  const name = refs.editTaskNameInput?.value.trim();
  const duration = parseInt(refs.editTaskDurationInput?.value, 10);
  const description = refs.editTaskDescriptionInput?.value.trim();
  
  if (!name || !duration || duration < 1) {
    showToast('Please enter valid task details', 'warning');
    return;
  }
  
  // Update task
  const task = state.tasks[state.editingTaskIndex];
  task.name = name;
  task.duration = duration;
  task.description = description;
  
  calculateTimeline();
  updateUI();
  closeEditModal();
  
  showToast('Task updated successfully!', 'success');
}

function deleteTask(index) {
  if (index < 0 || index >= state.tasks.length) return;
  
  const task = state.tasks[index];
  if (confirm(`Delete task "${task.name}"?`)) {
    state.tasks.splice(index, 1);
    calculateTimeline();
    updateUI();
    showToast('Task deleted successfully!', 'success');
  }
}

function closeEditModal() {
  refs.editTaskModal?.classList.remove('active');
  state.editingTaskIndex = -1;
}

// ==========================================================================
// Timeline Calculation (Preserved Original Logic)
// ==========================================================================

function calculateTimeline() {
  if (!state.deadline || state.tasks.length === 0) return;
  
  let currentEndDate = getValidEndDate(state.deadline);
  
  // Process tasks in reverse order (backward planning)
  for (let i = state.tasks.length - 1; i >= 0; i--) {
    const task = state.tasks[i];
    
    // Set task end date
    task.endDate = new Date(currentEndDate);
    
    // Calculate start date
    task.startDate = findStartDate(currentEndDate, task.duration);
    
    // Next task ends when current task starts (minus 1 working day)
    if (i > 0) {
      currentEndDate = findPreviousWorkingDay(task.startDate);
    }
  }
}

function getValidEndDate(date) {
  let d = new Date(date);
  if (isWeekend(d) || isExcludedHoliday(d)) {
    while (isWeekend(d) || isExcludedHoliday(d)) {
      d = addDays(d, -1);
    }
  }
  return normalizeDate(d);
}

function findStartDate(endDate, duration) {
  let daysLeft = duration - 1;
  let d = new Date(endDate);
  
  while (daysLeft > 0) {
    d = addDays(d, -1);
    if (!isWeekend(d) && !isExcludedHoliday(d)) {
      daysLeft--;
    }
  }
  
  return normalizeDate(d);
}

function findPreviousWorkingDay(date) {
  let d = addDays(date, -1);
  while (isWeekend(d) || isExcludedHoliday(d)) {
    d = addDays(d, -1);
  }
  return normalizeDate(d);
}

function handleGenerateTimeline() {
  if (!state.deadline) {
    showToast('Please set a deadline first', 'warning');
    return;
  }
  
  if (state.tasks.length === 0) {
    showToast('Please add some tasks first', 'warning');
    return;
  }
  
  state.isGeneratingTimeline = true;
  showLoading('Calculating timeline...');
  
  // Simulate calculation delay for UX
  setTimeout(() => {
    calculateTimeline();
    updateUI();
    hideLoading();
    state.isGeneratingTimeline = false;
    showToast('Timeline generated successfully!', 'success');
    
    // Initialize drag and drop
    initDragAndDrop();
  }, 1000);
}

// ==========================================================================
// Holidays Management (Preserved Original)
// ==========================================================================

function loadHolidays() {
  const vevents = holidaysData.vcalendar[0].vevent;
  state.holidays = vevents.map(evt => {
    const raw = evt.dtstart[0];
    const d = new Date(
      parseInt(raw.slice(0, 4)), // year
      parseInt(raw.slice(4, 6)) - 1, // month (0-based)
      parseInt(raw.slice(6, 8)) // day
    );
    return { 
      date: normalizeDate(d), 
      summary: evt.summary 
    };
  });
  
  // Build holiday set for fast lookup
  state.holidaySet.clear();
  state.holidays.forEach(h => state.holidaySet.add(+h.date));
}

function renderHolidays() {
  if (!refs.holidayItems) return;
  
  refs.holidayItems.innerHTML = '';
  state.holidays
    .filter(holiday => holiday.date.getFullYear() >= new Date().getFullYear())
    .sort((a, b) => a.date - b.date)
    .forEach(({ date, summary }) => {
      const div = document.createElement('div');
      div.className = 'holiday-item';
      div.innerHTML = `
        <span class="holiday-date">${formatDate(date)}</span>
        <span>${summary}</span>
      `;
      refs.holidayItems.appendChild(div);
    });
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

function isExcludedHoliday(date) {
  return state.skipHolidays && state.holidaySet.has(+normalizeDate(date));
}

function handleHolidayToggle() {
  state.skipHolidays = refs.excludeHolidaysCheckbox?.checked ?? true;
  calculateTimeline();
  updateUI();
  
  const message = state.skipHolidays ? 
    'Holidays will be skipped in calculations' : 
    'Holidays will be included as working days';
  showToast(message, 'info');
}

// ==========================================================================
// Drag and Drop (New Enhancement)
// ==========================================================================

function initDragAndDrop() {
  if (!refs.planBody || typeof Sortable === 'undefined') return;
  
  // Destroy existing instance
  if (state.sortableInstance) {
    state.sortableInstance.destroy();
  }
  
  // Create new sortable instance
  state.sortableInstance = Sortable.create(refs.planBody, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    handle: 'tr',
    onEnd: function(evt) {
      // Reorder tasks array to match new DOM order
      const newTasks = [];
      const rows = refs.planBody.querySelectorAll('tr');
      
      rows.forEach(row => {
        const taskName = row.cells[0]?.textContent?.trim();
        const task = state.tasks.find(t => t.name === taskName);
        if (task) {
          newTasks.push(task);
        }
      });
      
      if (newTasks.length === state.tasks.length) {
        state.tasks = newTasks;
        calculateTimeline();
        updateUI();
        showToast('Tasks reordered successfully!', 'success');
      }
    }
  });
}

// ==========================================================================
// UI Rendering
// ==========================================================================

function updateUI() {
  renderTasks();
  updateButtons();
}

function renderTasks() {
  if (!refs.planTable || !refs.planBody || !refs.noTasksMsg) return;
  
  const hasTasksWithTimeline = state.tasks.length > 0 && state.tasks[0].startDate;
  
  // Show/hide table and empty message
  refs.planTable.style.display = hasTasksWithTimeline ? 'table' : 'none';
  refs.noTasksMsg.style.display = hasTasksWithTimeline ? 'none' : 'block';
  
  if (hasTasksWithTimeline) {
    refs.planBody.innerHTML = '';
    
    state.tasks.forEach((task, index) => {
      const row = document.createElement('tr');
      row.classList.add('task-row');
      row.innerHTML = `
        <td>
          <strong>${escapeHtml(task.name)}</strong>
          ${task.description ? `<br><small class="text-muted">${escapeHtml(task.description)}</small>` : ''}
        </td>
        <td>${formatDate(task.startDate)}</td>
        <td>${getWeekday(task.startDate)}</td>
        <td>${formatDate(task.endDate)}</td>
        <td>${getWeekday(task.endDate)}</td>
        <td>${task.duration} day${task.duration !== 1 ? 's' : ''}</td>
        <td>
          <button class="btn btn--small btn--outline" onclick="editTask(${index})" aria-label="Edit task">
            ✏️ Edit
          </button>
          <button class="btn btn--small btn--danger" onclick="deleteTask(${index})" aria-label="Delete task">
            🗑️ Delete
          </button>
        </td>
      `;
      refs.planBody.appendChild(row);
    });
  }
}

function updateButtons() {
  const hasTasks = state.tasks.length > 0;
  const hasTimeline = hasTasks && state.tasks[0].startDate;
  
  if (refs.generateTimelineBtn) {
    refs.generateTimelineBtn.disabled = !hasTasks || state.isGeneratingTimeline;
    refs.generateTimelineBtn.textContent = state.isGeneratingTimeline ? 
      'Calculating...' : 'Generate Timeline';
  }
  
  if (refs.exportBtn) {
    refs.exportBtn.disabled = !hasTimeline;
  }
  
  if (refs.clearAllBtn) {
    refs.clearAllBtn.disabled = !hasTasks;
  }
}

// ==========================================================================
// Theme Management (New Enhancement)
// ==========================================================================

function applyTheme(themeId) {
  state.currentTheme = themeId;
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('backward-planner-theme', themeId);
  
  // Update theme selector UI
  if (refs.themeSelector) {
    refs.themeSelector.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === themeId);
    });
  }
}

function handleThemeChange(e) {
  const themeOption = e.target.closest('.theme-option');
  if (themeOption) {
    const themeId = themeOption.dataset.theme;
    applyTheme(themeId);
    showToast(`Theme changed to ${themeOption.textContent.trim()}`, 'success');
  }
}

// ==========================================================================
// Font Size Management (New Enhancement)
// ==========================================================================

function applyFontSize(fontSizeId) {
  state.currentFontSize = fontSizeId;
  document.documentElement.setAttribute('data-font-size', fontSizeId);
  localStorage.setItem('backward-planner-font-size', fontSizeId);
  
  // Update font size selector UI
  if (refs.fontSizeSelector) {
    const radio = refs.fontSizeSelector.querySelector(`input[value="${fontSizeId}"]`);
    if (radio) radio.checked = true;
  }
}

function handleFontSizeChange(e) {
  if (e.target.type === 'radio' && e.target.name === 'fontSize') {
    const fontSizeId = e.target.value;
    applyFontSize(fontSizeId);
    
    const labels = {
      small: 'Small (Compact)',
      medium: 'Medium (Default)',
      large: 'Large (Accessible)'
    };
    
    showToast(`Font size changed to ${labels[fontSizeId]}`, 'success');
  }
}

// ==========================================================================
// Settings Management
// ==========================================================================

function handleDateFormatChange() {
  state.dateFormat = refs.dateFormatSelect?.value || 'yyyy-MM-dd';
  updateUI();
  renderHolidays();
  
  const formats = {
    'yyyy-MM-dd': 'YYYY-MM-DD',
    'MM/dd/yyyy': 'MM/DD/YYYY',
    'dd MMM yyyy': 'DD MMM YYYY'
  };
  
  showToast(`Date format changed to ${formats[state.dateFormat]}`, 'success');
}

function resetSettings() {
  if (confirm('Reset all settings to defaults?')) {
    // Reset to defaults
    applyTheme('classic-blue');
    applyFontSize('medium');
    state.dateFormat = 'yyyy-MM-dd';
    state.skipHolidays = true;
    
    // Update UI
    if (refs.dateFormatSelect) refs.dateFormatSelect.value = state.dateFormat;
    if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.checked = state.skipHolidays;
    
    calculateTimeline();
    updateUI();
    renderHolidays();
    
    showToast('Settings reset to defaults', 'success');
  }
}

function saveSettings() {
  // Settings are automatically saved via localStorage
  showToast('Settings saved successfully!', 'success');
}

// ==========================================================================
// Import/Export (Enhanced from Original)
// ==========================================================================

function handleExport() {
  if (!state.deadline || state.tasks.length === 0) {
    showToast('Nothing to export. Please create a project first.', 'warning');
    return;
  }
  
  const exportData = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    project: {
      name: state.projectName,
      description: state.projectDescription,
      deadline: state.deadline.toISOString()
    },
    tasks: state.tasks.map(task => ({
      id: task.id,
      name: task.name,
      description: task.description,
      duration: task.duration,
      startDate: task.startDate?.toISOString(),
      endDate: task.endDate?.toISOString()
    })),
    settings: {
      dateFormat: state.dateFormat,
      skipHolidays: state.skipHolidays,
      theme: state.currentTheme,
      fontSize: state.currentFontSize
    }
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `backward-planner-${formatDateForFilename(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Project exported successfully!', 'success');
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      importProject(data);
    } catch (error) {
      showToast('Invalid JSON file', 'error');
      console.error('Import error:', error);
    }
  };
  reader.readAsText(file);
  
  // Clear file input
  e.target.value = '';
}

function importProject(data) {
  try {
    // Validate data structure
    if (!data || !data.project || !Array.isArray(data.tasks)) {
      throw new Error('Invalid project file format');
    }
    
    // Import project details
    state.projectName = data.project.name || '';
    state.projectDescription = data.project.description || '';
    state.deadline = new Date(data.project.deadline);
    
    // Import tasks
    state.tasks = data.tasks.map(task => ({
      id: task.id || Date.now() + Math.random(),
      name: task.name || 'Unnamed Task',
      description: task.description || '',
      duration: parseInt(task.duration) || 1,
      startDate: task.startDate ? new Date(task.startDate) : null,
      endDate: task.endDate ? new Date(task.endDate) : null
    }));
    
    // Import settings if available
    if (data.settings) {
      if (data.settings.dateFormat) {
        state.dateFormat = data.settings.dateFormat;
      }
      if (typeof data.settings.skipHolidays === 'boolean') {
        state.skipHolidays = data.settings.skipHolidays;
      }
      if (data.settings.theme) {
        applyTheme(data.settings.theme);
      }
      if (data.settings.fontSize) {
        applyFontSize(data.settings.fontSize);
      }
    }
    
    // Update UI
    if (refs.projectNameInput) refs.projectNameInput.value = state.projectName;
    if (refs.projectDescriptionInput) refs.projectDescriptionInput.value = state.projectDescription;
    if (refs.deadlineInput) refs.deadlineInput.value = state.deadline.toISOString().split('T')[0];
    if (refs.dateFormatSelect) refs.dateFormatSelect.value = state.dateFormat;
    if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.checked = state.skipHolidays;
    
    updateDeadlineDisplay();
    refs.taskSection.style.display = 'block';
    calculateTimeline();
    updateUI();
    initDragAndDrop();
    
    showToast('Project imported successfully!', 'success');
    showPage('planning');
    
  } catch (error) {
    showToast('Error importing project: ' + error.message, 'error');
    console.error('Import error:', error);
  }
}

// ==========================================================================
// Sample Project (New Enhancement)
// ==========================================================================

function loadSampleProject() {
  const sampleData = {
    project: {
      name: "Website Redesign Project",
      description: "Complete redesign of company website with new branding and mobile optimization",
      deadline: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString() // 60 days from now
    },
    tasks: [
      { name: "Research & Discovery", duration: 5, description: "User research, competitor analysis, and requirements gathering" },
      { name: "Information Architecture", duration: 3, description: "Site mapping and content strategy" },
      { name: "Wireframing", duration: 5, description: "Create wireframes for all key pages and user flows" },
      { name: "Visual Design", duration: 10, description: "High-fidelity mockups and visual design for all pages" },
      { name: "Frontend Development", duration: 15, description: "HTML, CSS, and JavaScript development" },
      { name: "Backend Development", duration: 10, description: "Server-side functionality and database integration" },
      { name: "Content Creation", duration: 7, description: "Write and optimize all website content" },
      { name: "Testing & QA", duration: 5, description: "Cross-browser testing, mobile testing, and bug fixes" },
      { name: "Launch Preparation", duration: 3, description: "Final deployment, domain setup, and go-live activities" }
    ]
  };
  
  if (state.tasks.length > 0) {
    if (!confirm('This will replace your current project. Continue?')) {
      return;
    }
  }
  
  importProject(sampleData);
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function handleClearAll() {
  if (confirm('Clear all tasks and project data?')) {
    state.tasks = [];
    state.deadline = null;
    state.projectName = '';
    state.projectDescription = '';
    
    if (refs.projectNameInput) refs.projectNameInput.value = '';
    if (refs.projectDescriptionInput) refs.projectDescriptionInput.value = '';
    if (refs.deadlineInput) refs.deadlineInput.value = '';
    if (refs.deadlineDisplay) refs.deadlineDisplay.textContent = '';
    
    refs.taskSection.style.display = 'none';
    updateUI();
    
    showToast('All data cleared', 'success');
  }
}

function handleKeyboard(e) {
  // Escape key closes modals
  if (e.key === 'Escape') {
    closeEditModal();
  }
  
  // Ctrl/Cmd + Enter in task input adds task
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.target === refs.taskNameInput) {
    handleAddTask();
  }
}

function formatDate(date) {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (state.dateFormat) {
    case 'MM/dd/yyyy':
      return `${month}/${day}/${year}`;
    case 'dd MMM yyyy':
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${monthNames[date.getMonth()]} ${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

function formatDateForFilename(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekday(date) {
  if (!date) return '';
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[date.getDay()];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================================================
// Loading & Toast UI (New Enhancement)
// ==========================================================================

function showLoading(message = 'Loading...') {
  if (refs.loading) {
    refs.loading.querySelector('p').textContent = message;
    refs.loading.style.display = 'flex';
  }
}

function hideLoading() {
  if (refs.loading) {
    refs.loading.style.display = 'none';
  }
}

function showToast(message, type = 'info') {
  if (!refs.toastContainer) return;
  
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast--${type}`);
  
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <span>${icons[type] || icons.info}</span>
    <span>${escapeHtml(message)}</span>
  `;
  
  refs.toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================================================
// Global Functions (for inline event handlers)
// ==========================================================================

// Make functions available globally for onclick handlers
window.editTask = editTask;
window.deleteTask = deleteTask;
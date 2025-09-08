// ==========================================================================
// BACKWARD PLANNER - COMPLETE JAVASCRIPT
// All functionality working: theme switching, task management, exports
// ==========================================================================

console.log('🚀 Backward Planner v2.2.0 initializing...');

// Application State
const state = {
  deadline: null,
  tasks: [],
  dateFormat: 'yyyy-MM-dd',
  skipHolidays: true,
  holidays: [],
  holidaySet: new Set(),
  currentTheme: localStorage.getItem('backward-planner-theme') || 'classic-blue',
  currentFontSize: localStorage.getItem('backward-planner-font-size') || 'medium',
  currentPage: 'planning',
  projectName: '',
  projectDescription: '',
  isGeneratingTimeline: false,
  editingTaskIndex: -1
};

// Hong Kong Holidays Data (2024-2027)
const holidaysData = [
  // 2024
  { date: '2024-01-01', name: "New Year's Day" },
  { date: '2024-02-10', name: "Lunar New Year's Day" },
  { date: '2024-02-12', name: "The third day of Lunar New Year" },
  { date: '2024-02-13', name: "The fourth day of Lunar New Year" },
  { date: '2024-03-29', name: "Good Friday" },
  { date: '2024-03-30', name: "The day following Good Friday" },
  { date: '2024-04-01', name: "Easter Monday" },
  { date: '2024-04-04', name: "Ching Ming Festival" },
  { date: '2024-05-01', name: "Labour Day" },
  { date: '2024-05-15', name: "The Birthday of the Buddha" },
  { date: '2024-06-10', name: "Tuen Ng Festival" },
  { date: '2024-07-01', name: "Hong Kong SAR Establishment Day" },
  { date: '2024-09-18', name: "The day following Chinese Mid-Autumn Festival" },
  { date: '2024-10-01', name: "National Day" },
  { date: '2024-10-11', name: "Chung Yeung Festival" },
  { date: '2024-12-25', name: "Christmas Day" },
  { date: '2024-12-26', name: "The first weekday after Christmas Day" },
  // 2025
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-29', name: "Lunar New Year's Day" },
  { date: '2025-01-30', name: "The second day of Lunar New Year" },
  { date: '2025-01-31', name: "The third day of Lunar New Year" },
  { date: '2025-04-04', name: "Ching Ming Festival" },
  { date: '2025-04-18', name: "Good Friday" },
  { date: '2025-04-19', name: "The day following Good Friday" },
  { date: '2025-04-21', name: "Easter Monday" },
  { date: '2025-05-01', name: "Labour Day" },
  { date: '2025-05-05', name: "The Birthday of the Buddha" },
  { date: '2025-05-31', name: "Tuen Ng Festival" },
  { date: '2025-07-01', name: "Hong Kong SAR Establishment Day" },
  { date: '2025-10-01', name: "National Day" },
  { date: '2025-10-07', name: "The day following Chinese Mid-Autumn Festival" },
  { date: '2025-10-29', name: "Chung Yeung Festival" },
  { date: '2025-12-25', name: "Christmas Day" },
  { date: '2025-12-26', name: "The first weekday after Christmas Day" },
  // 2026
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-02-17', name: "Lunar New Year's Day" },
  { date: '2026-02-18', name: "The second day of Lunar New Year" },
  { date: '2026-02-19', name: "The third day of Lunar New Year" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-04-04', name: "The day following Good Friday" },
  { date: '2026-04-06', name: "Ching Ming Festival" },
  { date: '2026-04-07', name: "Easter Monday" },
  { date: '2026-05-01', name: "Labour Day" },
  { date: '2026-05-25', name: "The Birthday of the Buddha" },
  { date: '2026-06-19', name: "Tuen Ng Festival" },
  { date: '2026-07-01', name: "Hong Kong SAR Establishment Day" },
  { date: '2026-09-26', name: "The day following Chinese Mid-Autumn Festival" },
  { date: '2026-10-01', name: "National Day" },
  { date: '2026-10-19', name: "Chung Yeung Festival" },
  { date: '2026-12-25', name: "Christmas Day" },
  { date: '2026-12-26', name: "The first weekday after Christmas Day" },
  // 2027
  { date: '2027-01-01', name: "New Year's Day" },
  { date: '2027-02-06', name: "Lunar New Year's Day" },
  { date: '2027-02-08', name: "The second day of Lunar New Year" },
  { date: '2027-02-09', name: "The third day of Lunar New Year" },
  { date: '2027-03-26', name: "Good Friday" },
  { date: '2027-03-29', name: "Easter Monday" },
  { date: '2027-04-05', name: "Ching Ming Festival" },
  { date: '2027-05-01', name: "Labour Day" },
  { date: '2027-05-13', name: "The Birthday of the Buddha" },
  { date: '2027-06-09', name: "Tuen Ng Festival" },
  { date: '2027-07-01', name: "Hong Kong SAR Establishment Day" },
  { date: '2027-09-15', name: "The day following Chinese Mid-Autumn Festival" },
  { date: '2027-10-01', name: "National Day" },
  { date: '2027-10-07', name: "Chung Yeung Festival" },
  { date: '2027-12-25', name: "Christmas Day" },
  { date: '2027-12-27', name: "The first weekday after Christmas Day" }
];

// DOM Elements
const elements = {
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
  exportJsonBtn: document.getElementById('export-json'),
  exportCsvBtn: document.getElementById('export-csv'),
  exportHtmlBtn: document.getElementById('export-html'),
  importBtn: document.getElementById('import-btn'),
  importFile: document.getElementById('import-file'),
  
  // Settings
  themeSelector: document.getElementById('theme-selector'),
  fontSizeSelector: document.getElementById('font-size-selector'),
  excludeHolidaysCheckbox: document.getElementById('exclude-holidays'),
  holidayItems: document.getElementById('holiday-items'),
  
  // Modal
  editTaskModal: document.getElementById('edit-task-modal'),
  editTaskNameInput: document.getElementById('edit-task-name'),
  editTaskDurationInput: document.getElementById('edit-task-duration'),
  editTaskDescriptionInput: document.getElementById('edit-task-description'),
  cancelEditBtn: document.getElementById('cancel-edit'),
  saveEditBtn: document.getElementById('save-edit'),
  modalCloseBtn: document.querySelector('.modal__close'),
  
  // UI
  loading: document.getElementById('loading'),
  toastContainer: document.getElementById('toast-container')
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM loaded, initializing app...');
  
  // Initialize components
  loadHolidays();
  bindEventListeners();
  initializeThemeAndFont();
  renderHolidays();
  updateUI();
  
  console.log('🎉 Backward Planner initialized successfully');
  showToast('Welcome to Backward Planner!', 'info');
});

function initializeThemeAndFont() {
  // Clear any existing attributes first
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
  
  // Apply saved theme (only if not classic-blue)
  if (state.currentTheme !== 'classic-blue') {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
  }
  
  // Apply saved font size (only if not medium)
  if (state.currentFontSize !== 'medium') {
    document.documentElement.setAttribute('data-font-size', state.currentFontSize);
  }
  
  // Update UI selections
  updateThemeSelection(state.currentTheme);
  updateFontSizeSelection(state.currentFontSize);
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

function bindEventListeners() {
  // Navigation
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Project Setup
  if (elements.setDeadlineBtn) elements.setDeadlineBtn.addEventListener('click', handleSetDeadline);
  if (elements.projectNameInput) elements.projectNameInput.addEventListener('input', handleProjectNameChange);
  if (elements.projectDescriptionInput) elements.projectDescriptionInput.addEventListener('input', handleProjectDescriptionChange);
  if (elements.deadlineInput) elements.deadlineInput.addEventListener('change', handleDeadlineInputChange);
  
  // Tasks
  if (elements.addTaskBtn) elements.addTaskBtn.addEventListener('click', handleAddTask);
  if (elements.taskNameInput) {
    elements.taskNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddTask();
    });
  }
  
  // Timeline
  if (elements.generateTimelineBtn) elements.generateTimelineBtn.addEventListener('click', handleGenerateTimeline);
  if (elements.loadSampleBtn) elements.loadSampleBtn.addEventListener('click', loadSampleProject);
  
  // Actions
  if (elements.clearAllBtn) elements.clearAllBtn.addEventListener('click', handleClearAll);
  if (elements.exportJsonBtn) elements.exportJsonBtn.addEventListener('click', handleExportJSON);
  if (elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', handleExportCSV);
  if (elements.exportHtmlBtn) elements.exportHtmlBtn.addEventListener('click', handleExportHTML);
  if (elements.importBtn) elements.importBtn.addEventListener('click', () => elements.importFile?.click());
  if (elements.importFile) elements.importFile.addEventListener('change', handleImport);
  
  // Settings
  bindThemeEvents();
  bindFontSizeEvents();
  if (elements.excludeHolidaysCheckbox) elements.excludeHolidaysCheckbox.addEventListener('change', handleHolidayToggle);
  
  // Modal
  bindModalEvents();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);
}

function bindThemeEvents() {
  if (!elements.themeSelector) return;
  
  elements.themeSelector.addEventListener('click', function(event) {
    let themeOption = event.target;
    
    while (themeOption && !themeOption.hasAttribute('data-theme')) {
      themeOption = themeOption.parentElement;
      if (themeOption === elements.themeSelector) {
        themeOption = null;
        break;
      }
    }
    
    if (themeOption && themeOption.hasAttribute('data-theme')) {
      const themeId = themeOption.getAttribute('data-theme');
      applyTheme(themeId);
      showToast(`Theme changed to ${themeOption.textContent.trim()}`, 'success');
    }
  });
}

function bindFontSizeEvents() {
  if (!elements.fontSizeSelector) return;
  
  elements.fontSizeSelector.addEventListener('click', function(event) {
    let fontOption = event.target;
    let radioInput = null;
    
    if (fontOption.type === 'radio' && fontOption.name === 'fontSize') {
      radioInput = fontOption;
      fontOption = fontOption.closest('.font-option');
    } else {
      while (fontOption && !fontOption.classList.contains('font-option')) {
        fontOption = fontOption.parentElement;
        if (fontOption === elements.fontSizeSelector) {
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
      radioInput.checked = true;
      applyFontSize(fontSizeId);
      showToast(`Font size changed to ${fontSizeId}`, 'success');
    }
  });
}

function bindModalEvents() {
  if (elements.cancelEditBtn) elements.cancelEditBtn.addEventListener('click', closeEditModal);
  if (elements.saveEditBtn) elements.saveEditBtn.addEventListener('click', saveTaskEdit);
  if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeEditModal);
  
  if (elements.editTaskModal) {
    elements.editTaskModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__overlay') || e.target === elements.editTaskModal) {
        closeEditModal();
      }
    });
  }
}

// ==========================================================================
// THEME & FONT SIZE MANAGEMENT
// ==========================================================================

function applyTheme(themeId) {
  console.log('🎨 Applying theme:', themeId);
  
  state.currentTheme = themeId;
  
  // Remove existing theme attributes
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
  
  // Only set attribute for non-default themes
  if (themeId !== 'classic-blue') {
    document.documentElement.setAttribute('data-theme', themeId);
  }
  
  // Save to localStorage
  localStorage.setItem('backward-planner-theme', themeId);
  
  // Update visual selection
  updateThemeSelection(themeId);
}

function updateThemeSelection(activeTheme) {
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    const isActive = option.getAttribute('data-theme') === activeTheme;
    option.classList.toggle('active', isActive);
  });
}

function applyFontSize(fontSizeId) {
  console.log('📝 Applying font size:', fontSizeId);
  
  state.currentFontSize = fontSizeId;
  
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

// ==========================================================================
// NAVIGATION
// ==========================================================================

function toggleMobileMenu() {
  elements.navMenu?.classList.toggle('nav__menu--open');
}

function handleNavigation(e) {
  e.preventDefault();
  const page = e.currentTarget.dataset.page;
  if (page) {
    showPage(page);
    elements.navMenu?.classList.remove('nav__menu--open');
  }
}

function showPage(pageId) {
  state.currentPage = pageId;
  
  elements.pages.forEach(page => {
    page.classList.toggle('page--active', page.id === pageId + 'Page');
  });
  
  elements.navLinks.forEach(link => {
    const isActive = link.dataset.page === pageId;
    link.classList.toggle('nav__link--active', isActive);
  });
}

// ==========================================================================
// PROJECT MANAGEMENT
// ==========================================================================

function handleProjectNameChange(e) {
  state.projectName = e.target.value;
}

function handleProjectDescriptionChange(e) {
  state.projectDescription = e.target.value;
}

function handleSetDeadline() {
  const dateValue = elements.deadlineInput?.value;
  if (!dateValue) {
    showToast('Please select a deadline date', 'error');
    return;
  }
  
  const deadline = new Date(dateValue + 'T00:00:00');
  if (deadline <= new Date()) {
    showToast('Deadline must be in the future', 'error');
    return;
  }
  
  state.deadline = deadline;
  updateDeadlineDisplay();
  if (elements.taskSection) elements.taskSection.style.display = 'block';
  
  clearExistingTimeline();
  showToast('Deadline set successfully!', 'success');
}

function handleDeadlineInputChange() {
  if (elements.deadlineInput?.value && state.tasks.length > 0) {
    clearExistingTimeline();
    showToast('Deadline changed. Click "Generate Timeline" to recalculate.', 'info');
  }
}

function clearExistingTimeline() {
  state.tasks.forEach(task => {
    task.startDate = null;
    task.endDate = null;
  });
  state.isGeneratingTimeline = false;
  updateUI();
}

function updateDeadlineDisplay() {
  if (elements.deadlineDisplay && state.deadline) {
    elements.deadlineDisplay.textContent = `Deadline: ${formatDate(state.deadline)}`;
    elements.deadlineDisplay.style.display = 'block';
  }
}

// ==========================================================================
// TASK MANAGEMENT
// ==========================================================================

function handleAddTask() {
  const name = elements.taskNameInput?.value.trim();
  const duration = parseInt(elements.taskDurationInput?.value, 10);
  
  if (!name) {
    showToast('Please enter a task name', 'error');
    elements.taskNameInput?.focus();
    return;
  }
  
  if (!duration || duration < 1) {
    showToast('Please enter a valid duration (minimum 1 day)', 'error');
    elements.taskDurationInput?.focus();
    return;
  }
  
  if (!state.deadline) {
    showToast('Please set a deadline first', 'error');
    return;
  }
  
  const newTask = {
    id: Date.now(),
    name: name,
    duration: duration,
    description: '',
    startDate: null,
    endDate: null
  };
  
  state.tasks.push(newTask);
  
  if (elements.taskNameInput) elements.taskNameInput.value = '';
  if (elements.taskDurationInput) elements.taskDurationInput.value = '';
  
  updateTaskList();
  updateUI();
  
  showToast(`Task "${name}" added successfully!`, 'success');
  elements.taskNameInput?.focus();
}

function editTask(index) {
  if (index < 0 || index >= state.tasks.length) {
    showToast('Invalid task index', 'error');
    return;
  }
  
  state.editingTaskIndex = index;
  const task = state.tasks[index];
  
  if (elements.editTaskNameInput) elements.editTaskNameInput.value = task.name;
  if (elements.editTaskDurationInput) elements.editTaskDurationInput.value = task.duration;
  if (elements.editTaskDescriptionInput) elements.editTaskDescriptionInput.value = task.description || '';
  
  if (elements.editTaskModal) {
    elements.editTaskModal.classList.add('active');
    elements.editTaskModal.style.display = 'flex';
  }
  
  elements.editTaskNameInput?.focus();
}

function saveTaskEdit() {
  if (state.editingTaskIndex < 0 || state.editingTaskIndex >= state.tasks.length) {
    showToast('Invalid task to save', 'error');
    return;
  }
  
  const name = elements.editTaskNameInput?.value.trim();
  const duration = parseInt(elements.editTaskDurationInput?.value, 10);
  const description = elements.editTaskDescriptionInput?.value.trim();
  
  if (!name || !duration || duration < 1) {
    showToast('Please enter valid task details', 'error');
    return;
  }
  
  const task = state.tasks[state.editingTaskIndex];
  task.name = name;
  task.duration = duration;
  task.description = description;
  
  // Recalculate timeline if it exists
  if (state.tasks[0]?.startDate) {
    calculateTimeline();
  }
  
  updateUI();
  closeEditModal();
  
  showToast('Task updated successfully!', 'success');
}

function closeEditModal() {
  if (elements.editTaskModal) {
    elements.editTaskModal.classList.remove('active');
    elements.editTaskModal.style.display = 'none';
  }
  state.editingTaskIndex = -1;
}

function deleteTask(index) {
  if (index < 0 || index >= state.tasks.length) return;
  
  const task = state.tasks[index];
  if (confirm(`Delete task "${task.name}"?`)) {
    state.tasks.splice(index, 1);
    
    if (state.tasks.length > 0 && state.tasks[0]?.startDate) {
      calculateTimeline();
    }
    updateUI();
    showToast('Task deleted successfully!', 'success');
  }
}

function updateTaskList() {
  if (!elements.noTasksMsg) return;
  
  if (state.tasks.length === 0) {
    elements.noTasksMsg.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">📋</div>
        <h4>No tasks added yet</h4>
        <p>Add your first task above to get started with planning</p>
      </div>
    `;
    elements.noTasksMsg.style.display = 'block';
    if (elements.planTable) elements.planTable.style.display = 'none';
  } else {
    elements.noTasksMsg.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⏳</div>
        <h4>${state.tasks.length} task${state.tasks.length !== 1 ? 's' : ''} added</h4>
        <p>Click "Generate Timeline" to see your project schedule</p>
      </div>
    `;
    elements.noTasksMsg.style.display = 'block';
    if (elements.planTable) elements.planTable.style.display = 'none';
  }
}

// ==========================================================================
// TIMELINE CALCULATION
// ==========================================================================

function handleGenerateTimeline() {
  if (!state.deadline) {
    showToast('Please set a deadline first', 'error');
    return;
  }
  
  if (state.tasks.length === 0) {
    showToast('Please add some tasks first', 'error');
    return;
  }
  
  if (state.isGeneratingTimeline) {
    return;
  }
  
  state.isGeneratingTimeline = true;
  showLoading('Calculating timeline...');
  
  setTimeout(() => {
    try {
      const success = calculateTimeline();
      if (success) {
        updateUI();
        showToast('Timeline generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Timeline generation error:', error);
      showToast('Error generating timeline: ' + error.message, 'error');
    } finally {
      hideLoading();
      state.isGeneratingTimeline = false;
    }
  }, 500);
}

function calculateTimeline() {
  if (!state.deadline || state.tasks.length === 0) {
    return false;
  }
  
  try {
    let currentEndDate = getValidEndDate(state.deadline);
    
    for (let i = state.tasks.length - 1; i >= 0; i--) {
      const task = state.tasks[i];
      
      task.endDate = new Date(currentEndDate);
      task.startDate = findStartDate(currentEndDate, task.duration);
      
      if (i > 0) {
        currentEndDate = findPreviousWorkingDay(task.startDate);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error calculating timeline:', error);
    showToast('Error calculating timeline: ' + error.message, 'error');
    return false;
  }
}

function getValidEndDate(date) {
  let d = new Date(date);
  let attempts = 0;
  const maxAttempts = 30;
  
  while ((isWeekend(d) || isExcludedHoliday(d)) && attempts < maxAttempts) {
    d = addDays(d, -1);
    attempts++;
  }
  
  return normalizeDate(d);
}

function findStartDate(endDate, duration) {
  if (duration <= 0) return new Date(endDate);
  
  let daysLeft = duration - 1;
  let d = new Date(endDate);
  let attempts = 0;
  const maxAttempts = duration * 7;
  
  while (daysLeft > 0 && attempts < maxAttempts) {
    d = addDays(d, -1);
    if (!isWeekend(d) && !isExcludedHoliday(d)) {
      daysLeft--;
    }
    attempts++;
  }
  
  return normalizeDate(d);
}

function findPreviousWorkingDay(date) {
  let d = addDays(date, -1);
  let attempts = 0;
  const maxAttempts = 30;
  
  while ((isWeekend(d) || isExcludedHoliday(d)) && attempts < maxAttempts) {
    d = addDays(d, -1);
    attempts++;
  }
  
  return normalizeDate(d);
}

// ==========================================================================
// HOLIDAYS MANAGEMENT
// ==========================================================================

function loadHolidays() {
  const currentYear = new Date().getFullYear();
  
  state.holidays = holidaysData.filter(holiday => {
    const year = parseInt(holiday.date.slice(0, 4));
    return year >= currentYear && year <= currentYear + 2;
  }).map(holiday => {
    const [year, month, day] = holiday.date.split('-').map(Number);
    return {
      date: normalizeDate(new Date(year, month - 1, day)),
      name: holiday.name
    };
  });
  
  state.holidaySet.clear();
  state.holidays.forEach(h => state.holidaySet.add(+h.date));
  
  console.log(`Loaded ${state.holidays.length} holidays`);
}

function renderHolidays() {
  if (!elements.holidayItems) {
    console.log('No holiday items container found');
    return;
  }
  
  elements.holidayItems.innerHTML = '';
  
  if (state.holidays.length === 0) {
    elements.holidayItems.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No holidays loaded</p>';
    return;
  }
  
  state.holidays
    .sort((a, b) => a.date - b.date)
    .forEach(({ date, name }) => {
      const div = document.createElement('div');
      div.className = 'holiday-item';
      div.innerHTML = `
        <span class="holiday-date">${formatDate(date)}</span>
        <span>${name}</span>
      `;
      elements.holidayItems.appendChild(div);
    });
  
  console.log(`Rendered ${state.holidays.length} holidays`);
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isExcludedHoliday(date) {
  return state.skipHolidays && state.holidaySet.has(+normalizeDate(date));
}

function handleHolidayToggle() {
  state.skipHolidays = elements.excludeHolidaysCheckbox?.checked ?? true;
  
  if (state.tasks.length > 0 && state.tasks[0]?.startDate) {
    calculateTimeline();
    updateUI();
  }
  
  const message = state.skipHolidays ? 
    'Holidays will be skipped in calculations' : 
    'Holidays will be included as working days';
  showToast(message, 'info');
}

// ==========================================================================
// UI RENDERING
// ==========================================================================

function updateUI() {
  renderTasks();
  updateButtons();
}

function renderTasks() {
  if (!elements.planTable || !elements.planBody || !elements.noTasksMsg) return;
  
  const hasTasksWithTimeline = state.tasks.length > 0 && state.tasks[0]?.startDate;
  
  if (hasTasksWithTimeline) {
    elements.planTable.style.display = 'table';
    elements.noTasksMsg.style.display = 'none';
    
    elements.planBody.innerHTML = '';
    state.tasks.forEach((task, index) => {
      const row = document.createElement('tr');
      row.classList.add('task-row');
      row.innerHTML = `
        <td>
          <strong>${escapeHtml(task.name)}</strong>
          ${task.description ? `<br><small class="text-muted">${escapeHtml(task.description)}</small>` : ''}
        </td>
        <td class="hide-mobile">${formatDate(task.startDate)}</td>
        <td class="hide-mobile">${getWeekday(task.startDate)}</td>
        <td>${formatDate(task.endDate)}</td>
        <td class="hide-mobile">${getWeekday(task.endDate)}</td>
        <td>${task.duration} day${task.duration !== 1 ? 's' : ''}</td>
        <td class="hide-mobile">
          <button class="btn btn--small btn--outline" onclick="editTask(${index})" title="Edit task">
            ✏️ Edit
          </button>
          <button class="btn btn--small btn--danger" onclick="deleteTask(${index})" title="Delete task">
            🗑️ Delete
          </button>
        </td>
      `;
      elements.planBody.appendChild(row);
    });
  } else {
    updateTaskList();
  }
}

function updateButtons() {
  const hasTasks = state.tasks.length > 0;
  const hasTimeline = hasTasks && state.tasks[0]?.startDate;
  
  if (elements.generateTimelineBtn) {
    elements.generateTimelineBtn.disabled = !hasTasks || state.isGeneratingTimeline;
    elements.generateTimelineBtn.textContent = state.isGeneratingTimeline ? 
      'Calculating...' : 'Generate Timeline';
  }
  
  if (elements.exportJsonBtn) elements.exportJsonBtn.disabled = !hasTimeline;
  if (elements.exportCsvBtn) elements.exportCsvBtn.disabled = !hasTimeline;
  if (elements.exportHtmlBtn) elements.exportHtmlBtn.disabled = !hasTimeline;
  if (elements.clearAllBtn) elements.clearAllBtn.disabled = !hasTasks;
}

// ==========================================================================
// EXPORT FUNCTIONS
// ==========================================================================

function handleExportJSON() {
  if (!state.deadline || state.tasks.length === 0) {
    showToast('Nothing to export. Please create a project first.', 'error');
    return;
  }
  
  const exportData = {
    version: '2.2.0',
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
  
  downloadFile(
    JSON.stringify(exportData, null, 2),
    `backward-planner-${formatDateForFilename(new Date())}.json`,
    'application/json'
  );
  
  showToast('Project exported as JSON successfully!', 'success');
}

function handleExportCSV() {
  if (!state.tasks.length || !state.tasks[0]?.startDate) {
    showToast('No timeline to export. Generate timeline first.', 'error');
    return;
  }
  
  const csvHeaders = ['Task Name', 'Start Date', 'End Date', 'Duration (days)', 'Description'];
  const csvRows = state.tasks.map(task => [
    `"${task.name.replace(/"/g, '""')}"`,
    formatDate(task.startDate),
    formatDate(task.endDate),
    task.duration,
    `"${(task.description || '').replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
  
  downloadFile(
    csvContent,
    `backward-planner-timeline-${formatDateForFilename(new Date())}.csv`,
    'text/csv'
  );
  
  showToast('Timeline exported as CSV successfully!', 'success');
}

function handleExportHTML() {
  if (!state.tasks.length || !state.tasks[0]?.startDate) {
    showToast('No timeline to export. Generate timeline first.', 'error');
    return;
  }
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Project Timeline - ${state.projectName || 'Backward Planner'}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
    h1 { color: #1d4ed8; margin-bottom: 10px; }
    .info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border: 1px solid #e2e8f0; }
    th { background-color: #f1f5f9; font-weight: 600; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <h1>📅 ${state.projectName || 'Project Timeline'}</h1>
  <div class="info">
    <p><strong>Description:</strong> ${state.projectDescription || 'No description provided'}</p>
    <p><strong>Deadline:</strong> ${formatDate(state.deadline)}</p>
    <p><strong>Total Tasks:</strong> ${state.tasks.length}</p>
    <p><strong>Generated:</strong> ${formatDate(new Date())}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Task Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Duration</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      ${state.tasks.map(task => `
        <tr>
          <td><strong>${escapeHtml(task.name)}</strong></td>
          <td>${formatDate(task.startDate)}</td>
          <td>${formatDate(task.endDate)}</td>
          <td>${task.duration} day${task.duration !== 1 ? 's' : ''}</td>
          <td>${escapeHtml(task.description || '')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generated by Backward Planner v2.2.0</p>
  </div>
</body>
</html>`;
  
  downloadFile(
    htmlContent,
    `backward-planner-timeline-${formatDateForFilename(new Date())}.html`,
    'text/html'
  );
  
  showToast('Timeline exported as HTML successfully!', 'success');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// IMPORT/SAMPLE PROJECT
// ==========================================================================

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
  
  e.target.value = '';
}

function importProject(data) {
  try {
    if (!data || !data.project || !Array.isArray(data.tasks)) {
      throw new Error('Invalid project file format');
    }
    
    state.projectName = data.project.name || '';
    state.projectDescription = data.project.description || '';
    state.deadline = new Date(data.project.deadline);
    
    state.tasks = data.tasks.map(task => ({
      id: task.id || Date.now() + Math.random(),
      name: task.name || 'Unnamed Task',
      description: task.description || '',
      duration: parseInt(task.duration) || 1,
      startDate: null,
      endDate: null
    }));
    
    if (data.settings) {
      if (data.settings.dateFormat) state.dateFormat = data.settings.dateFormat;
      if (typeof data.settings.skipHolidays === 'boolean') state.skipHolidays = data.settings.skipHolidays;
      if (data.settings.theme) applyTheme(data.settings.theme);
      if (data.settings.fontSize) applyFontSize(data.settings.fontSize);
    }
    
    if (elements.projectNameInput) elements.projectNameInput.value = state.projectName;
    if (elements.projectDescriptionInput) elements.projectDescriptionInput.value = state.projectDescription;
    if (elements.deadlineInput) elements.deadlineInput.value = state.deadline.toISOString().split('T')[0];
    if (elements.excludeHolidaysCheckbox) elements.excludeHolidaysCheckbox.checked = state.skipHolidays;
    
    updateDeadlineDisplay();
    if (elements.taskSection) elements.taskSection.style.display = 'block';
    
    updateUI();
    
    showToast('Project imported successfully!', 'success');
    showPage('planning');
    
  } catch (error) {
    showToast('Error importing project: ' + error.message, 'error');
    console.error('Import error:', error);
  }
}

function loadSampleProject() {
  const sampleData = {
    project: {
      name: "Website Redesign Project",
      description: "Complete redesign of company website with new branding and mobile optimization",
      deadline: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString()
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
// UTILITY FUNCTIONS
// ==========================================================================

function handleClearAll() {
  if (confirm('Clear all tasks and project data?')) {
    state.tasks = [];
    state.deadline = null;
    state.projectName = '';
    state.projectDescription = '';
    
    if (elements.projectNameInput) elements.projectNameInput.value = '';
    if (elements.projectDescriptionInput) elements.projectDescriptionInput.value = '';
    if (elements.deadlineInput) elements.deadlineInput.value = '';
    if (elements.deadlineDisplay) elements.deadlineDisplay.textContent = '';
    
    if (elements.taskSection) elements.taskSection.style.display = 'none';
    updateUI();
    
    showToast('All data cleared', 'success');
  }
}

function handleKeyboard(e) {
  if (e.key === 'Escape') {
    closeEditModal();
  }
  
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.target === elements.taskNameInput) {
    handleAddTask();
  }
}

function formatDate(date) {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
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
// LOADING & TOAST UI
// ==========================================================================

function showLoading(message = 'Loading...') {
  if (elements.loading) {
    const loadingText = elements.loading.querySelector('p');
    if (loadingText) loadingText.textContent = message;
    elements.loading.style.display = 'flex';
  }
}

function hideLoading() {
  if (elements.loading) {
    elements.loading.style.display = 'none';
  }
}

function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;
  
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
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }, 4000);
}

// ==========================================================================
// GLOBAL FUNCTIONS (for HTML onclick handlers)
// ==========================================================================

window.editTask = editTask;
window.deleteTask = deleteTask;

// Debug functions
window.testTheme = function(themeId) {
  console.log('🧪 Testing theme:', themeId);
  applyTheme(themeId);
};

window.testFontSize = function(fontSizeId) {
  console.log('🧪 Testing font size:', fontSizeId);
  applyFontSize(fontSizeId);
};

window.resetToLightMode = function() {
  console.log('🔄 Resetting to light mode...');
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('backward-planner-theme');
  updateThemeSelection('classic-blue');
  showToast('Reset to Classic Blue (Light Mode)', 'info');
};

console.log('🔧 Debug functions: testTheme(), testFontSize(), resetToLightMode()');
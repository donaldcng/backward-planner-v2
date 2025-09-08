// ==========================================================================
// Enhanced Backward Planner - Complete JavaScript (Edge & Sidebar Compatible)
// All Bugs Fixed + Edge Sidebar Support
// ==========================================================================

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
  sortableInstance: null,
  editingTaskIndex: -1,
  
  // Edge sidebar detection
  isEdgeSidebar: false
};

// DOM References
const refs = {
  navToggle: document.getElementById('navToggle'),
  navMenu: document.getElementById('navMenu'),
  navLinks: document.querySelectorAll('.nav__link'),
  
  pages: document.querySelectorAll('.page'),
  
  projectNameInput: document.getElementById('project-name'),
  projectDescriptionInput: document.getElementById('project-description'),
  deadlineInput: document.getElementById('deadline'),
  setDeadlineBtn: document.getElementById('set-deadline'),
  deadlineDisplay: document.getElementById('deadline-display'),
  
  taskSection: document.getElementById('task-section'),
  taskNameInput: document.getElementById('task-name'),
  taskDurationInput: document.getElementById('task-duration'),
  addTaskBtn: document.getElementById('add-task'),
  
  generateTimelineBtn: document.getElementById('generate-timeline'),
  loadSampleBtn: document.getElementById('load-sample'),
  planTable: document.getElementById('plan-table'),
  planBody: document.getElementById('plan-body'),
  noTasksMsg: document.getElementById('no-tasks-msg'),
  
  clearAllBtn: document.getElementById('clear-all'),
  exportBtn: document.getElementById('export-btn'),
  exportCsvBtn: document.getElementById('export-csv'),
  exportPdfBtn: document.getElementById('export-pdf'),
  importBtn: document.getElementById('import-btn'),
  importFile: document.getElementById('import-file'),
  
  themeSelector: document.getElementById('theme-selector'),
  fontSizeSelector: document.getElementById('font-size-selector'),
  dateFormatSelect: document.getElementById('date-format'),
  excludeHolidaysCheckbox: document.getElementById('exclude-holidays'),
  holidayItems: document.getElementById('holiday-items'),
  resetSettingsBtn: document.getElementById('reset-settings'),
  saveSettingsBtn: document.getElementById('save-settings'),
  
  editTaskModal: document.getElementById('edit-task-modal'),
  editTaskForm: document.getElementById('edit-task-form'),
  editTaskNameInput: document.getElementById('edit-task-name'),
  editTaskDurationInput: document.getElementById('edit-task-duration'),
  editTaskDescriptionInput: document.getElementById('edit-task-description'),
  cancelEditBtn: document.getElementById('cancel-edit'),
  saveEditBtn: document.getElementById('save-edit'),
  
  loading: document.getElementById('loading'),
  toastContainer: document.getElementById('toast-container')
};

// Hong Kong Holidays Data (2024-2027)
const holidaysData = {
  "vcalendar": [{
    "vevent": [
      // 2024 Holidays
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
      
      // 2025 Holidays
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
      {"dtstart": ["20251226"], "summary": "The first weekday after Christmas Day"},
      
      // 2026 Holidays
      {"dtstart": ["20260101"], "summary": "New Year's Day"},
      {"dtstart": ["20260217"], "summary": "Lunar New Year's Day"},
      {"dtstart": ["20260218"], "summary": "The second day of Lunar New Year"},
      {"dtstart": ["20260219"], "summary": "The third day of Lunar New Year"},
      {"dtstart": ["20260403"], "summary": "Good Friday"},
      {"dtstart": ["20260404"], "summary": "The day following Good Friday"},
      {"dtstart": ["20260406"], "summary": "The day following Ching Ming Festival"},
      {"dtstart": ["20260407"], "summary": "The day following Easter Monday"},
      {"dtstart": ["20260501"], "summary": "Labour Day"},
      {"dtstart": ["20260525"], "summary": "The day following the Birthday of the Buddha"},
      {"dtstart": ["20260619"], "summary": "Tuen Ng Festival"},
      {"dtstart": ["20260701"], "summary": "Hong Kong Special Administrative Region Establishment Day"},
      {"dtstart": ["20260926"], "summary": "The day following the Chinese Mid-Autumn Festival"},
      {"dtstart": ["20261001"], "summary": "National Day"},
      {"dtstart": ["20261019"], "summary": "The day following Chung Yeung Festival"},
      {"dtstart": ["20261225"], "summary": "Christmas Day"},
      {"dtstart": ["20261226"], "summary": "The first weekday after Christmas Day"},
      
      // 2027 Holidays
      {"dtstart": ["20270101"], "summary": "New Year's Day"},
      {"dtstart": ["20270206"], "summary": "Lunar New Year's Day"},
      {"dtstart": ["20270208"], "summary": "The second day of Lunar New Year"},
      {"dtstart": ["20270209"], "summary": "The third day of Lunar New Year"},
      {"dtstart": ["20270326"], "summary": "Good Friday"},
      {"dtstart": ["20270329"], "summary": "Easter Monday"},
      {"dtstart": ["20270405"], "summary": "Ching Ming Festival"},
      {"dtstart": ["20270501"], "summary": "Labour Day"},
      {"dtstart": ["20270513"], "summary": "The Birthday of the Buddha"},
      {"dtstart": ["20270609"], "summary": "Tuen Ng Festival"},
      {"dtstart": ["20270701"], "summary": "Hong Kong Special Administrative Region Establishment Day"},
      {"dtstart": ["20270915"], "summary": "The day following the Chinese Mid-Autumn Festival"},
      {"dtstart": ["20271001"], "summary": "National Day"},
      {"dtstart": ["20271007"], "summary": "Chung Yeung Festival"},
      {"dtstart": ["20271225"], "summary": "Christmas Day"},
      {"dtstart": ["20271227"], "summary": "The first weekday after Christmas Day"}
    ]
  }]
};

// ==========================================================================
// Application Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  console.log('Initializing Enhanced Backward Planner for Edge Sidebar...');
  
  detectEdgeSidebar();
  loadHolidays();
  bindEventListeners();
  applyTheme(state.currentTheme);
  applyFontSize(state.currentFontSize);
  renderHolidays();
  updateUI();
  
  showToast('Welcome to Backward Planner!', 'info');
}

// ==========================================================================
// Edge Sidebar Detection & Optimization
// ==========================================================================

function detectEdgeSidebar() {
  // Detect Edge sidebar by checking viewport width and user agent
  const isEdge = navigator.userAgent.includes('Edg/');
  const isNarrow = window.innerWidth <= 400;
  const isVeryNarrow = window.innerWidth <= 320;
  
  state.isEdgeSidebar = isEdge && (isNarrow || isVeryNarrow);
  
  if (state.isEdgeSidebar) {
    document.body.classList.add('edge-sidebar');
    console.log('Edge sidebar detected, applying optimizations...');
  }
  
  // Listen for resize events
  window.addEventListener('resize', () => {
    const wasEdgeSidebar = state.isEdgeSidebar;
    detectEdgeSidebar();
    
    if (wasEdgeSidebar !== state.isEdgeSidebar) {
      if (state.isEdgeSidebar) {
        document.body.classList.add('edge-sidebar');
      } else {
        document.body.classList.remove('edge-sidebar');
      }
    }
  });
}

// ==========================================================================
// Event Listeners - FIXED for Edge Compatibility
// ==========================================================================

function bindEventListeners() {
  // Navigation
  if (refs.navToggle) {
    refs.navToggle.addEventListener('click', toggleMobileMenu);
    refs.navToggle.addEventListener('touchend', toggleMobileMenu);
  }
  
  refs.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
    link.addEventListener('touchend', handleNavigation);
  });
  
  // Project Setup
  if (refs.setDeadlineBtn) refs.setDeadlineBtn.addEventListener('click', handleSetDeadline);
  if (refs.projectNameInput) refs.projectNameInput.addEventListener('input', handleProjectNameChange);
  if (refs.projectDescriptionInput) refs.projectDescriptionInput.addEventListener('input', handleProjectDescriptionChange);
  if (refs.deadlineInput) refs.deadlineInput.addEventListener('change', handleDeadlineInputChange); // NEW: Handle deadline changes
  
  // Tasks
  if (refs.addTaskBtn) refs.addTaskBtn.addEventListener('click', handleAddTask);
  if (refs.taskNameInput) {
    refs.taskNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddTask();
    });
  }
  
  // Timeline
  if (refs.generateTimelineBtn) refs.generateTimelineBtn.addEventListener('click', handleGenerateTimeline);
  if (refs.loadSampleBtn) refs.loadSampleBtn.addEventListener('click', loadSampleProject);
  
  // Actions
  if (refs.clearAllBtn) refs.clearAllBtn.addEventListener('click', handleClearAll);
  if (refs.exportBtn) refs.exportBtn.addEventListener('click', handleExportJSON);
  if (refs.exportCsvBtn) refs.exportCsvBtn.addEventListener('click', handleExportCSV);
  if (refs.exportPdfBtn) refs.exportPdfBtn.addEventListener('click', handleExportPDF);
  if (refs.importBtn) refs.importBtn.addEventListener('click', () => refs.importFile?.click());
  if (refs.importFile) refs.importFile.addEventListener('change', handleImport);
  
  // Settings - FIXED for Edge
  if (refs.themeSelector) {
    // Use event delegation for better Edge compatibility
    refs.themeSelector.addEventListener('click', handleThemeChangeFixed);
    refs.themeSelector.addEventListener('touchend', handleThemeChangeFixed);
  }
  
  if (refs.fontSizeSelector) {
    // Multiple event listeners for font size - FIXED
    refs.fontSizeSelector.addEventListener('change', handleFontSizeChangeFixed);
    refs.fontSizeSelector.addEventListener('click', handleFontSizeChangeFixed);
    refs.fontSizeSelector.addEventListener('touchend', handleFontSizeChangeFixed);
    
    // Also listen to individual radio buttons
    const radioButtons = refs.fontSizeSelector.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', handleFontSizeChangeFixed);
      radio.addEventListener('click', handleFontSizeChangeFixed);
    });
  }
  
  if (refs.dateFormatSelect) refs.dateFormatSelect.addEventListener('change', handleDateFormatChange);
  if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.addEventListener('change', handleHolidayToggle);
  if (refs.resetSettingsBtn) refs.resetSettingsBtn.addEventListener('click', resetSettings);
  if (refs.saveSettingsBtn) refs.saveSettingsBtn.addEventListener('click', saveSettings);
  
  // Modal
  if (refs.cancelEditBtn) refs.cancelEditBtn.addEventListener('click', closeEditModal);
  if (refs.saveEditBtn) refs.saveEditBtn.addEventListener('click', saveTaskEdit);
  if (refs.editTaskModal) {
    refs.editTaskModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__overlay')) closeEditModal();
    });
  }
  
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
    refs.navMenu?.classList.remove('nav__menu--open');
    refs.navToggle?.setAttribute('aria-expanded', 'false');
  }
}

function showPage(pageId) {
  state.currentPage = pageId;
  
  refs.pages.forEach(page => {
    page.classList.toggle('page--active', page.id === pageId + 'Page');
  });
  
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
// Project Management - FIXED Import + Deadline Change Bug
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
  if (refs.taskSection) refs.taskSection.style.display = 'block';
  
  // FIXED: Clear timeline when deadline changes
  clearExistingTimeline();
  
  showToast('Deadline set successfully!', 'success');
}

// NEW: Handle deadline input changes (for import + deadline change bug)
function handleDeadlineInputChange() {
  if (refs.deadlineInput?.value && state.tasks.length > 0) {
    // Clear existing timeline when deadline changes after import
    clearExistingTimeline();
    showToast('Deadline changed. Click "Generate Timeline" to recalculate.', 'info');
  }
}

function clearExistingTimeline() {
  // Clear timeline data from tasks
  state.tasks.forEach(task => {
    task.startDate = null;
    task.endDate = null;
  });
  
  // Reset generation state
  state.isGeneratingTimeline = false;
  
  // Update UI to show tasks need timeline generation
  updateUI();
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
  
  console.log('Adding task:', { name, duration });
  
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
  
  const newTask = {
    id: Date.now(),
    name: name,
    duration: duration,
    description: '',
    startDate: null,
    endDate: null
  };
  
  state.tasks.push(newTask);
  console.log('Task added, total tasks:', state.tasks.length);
  
  if (refs.taskNameInput) refs.taskNameInput.value = '';
  if (refs.taskDurationInput) refs.taskDurationInput.value = '';
  
  updateTaskList();
  updateUI();
  
  showToast(`Task "${name}" added successfully!`, 'success');
  refs.taskNameInput?.focus();
}

function updateTaskList() {
  if (!refs.noTasksMsg) return;
  
  if (state.tasks.length === 0) {
    refs.noTasksMsg.textContent = state.deadline ? 'No tasks added yet.' : 'Please set a deadline first.';
    refs.noTasksMsg.style.display = 'block';
    if (refs.planTable) refs.planTable.style.display = 'none';
  } else {
    refs.noTasksMsg.textContent = `${state.tasks.length} task(s) added. Click "Generate Timeline" to see the schedule.`;
    refs.noTasksMsg.style.display = 'block';
    if (refs.planTable) refs.planTable.style.display = 'none';
  }
}

function editTask(index) {
  if (index < 0 || index >= state.tasks.length) return;
  
  state.editingTaskIndex = index;
  const task = state.tasks[index];
  
  if (refs.editTaskNameInput) refs.editTaskNameInput.value = task.name;
  if (refs.editTaskDurationInput) refs.editTaskDurationInput.value = task.duration;
  if (refs.editTaskDescriptionInput) refs.editTaskDescriptionInput.value = task.description || '';
  
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
  
  const task = state.tasks[state.editingTaskIndex];
  task.name = name;
  task.duration = duration;
  task.description = description;
  
  if (state.tasks[0]?.startDate) {
    calculateTimeline();
  }
  updateUI();
  closeEditModal();
  
  showToast('Task updated successfully!', 'success');
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

function closeEditModal() {
  refs.editTaskModal?.classList.remove('active');
  state.editingTaskIndex = -1;
}

// ==========================================================================
// Timeline Calculation
// ==========================================================================

function calculateTimeline() {
  if (!state.deadline || state.tasks.length === 0) {
    console.log('Cannot calculate timeline: missing deadline or tasks');
    return false;
  }
  
  try {
    console.log('Calculating timeline for', state.tasks.length, 'tasks');
    
    let currentEndDate = getValidEndDate(state.deadline);
    console.log('Starting from end date:', currentEndDate);
    
    for (let i = state.tasks.length - 1; i >= 0; i--) {
      const task = state.tasks[i];
      
      task.endDate = new Date(currentEndDate);
      task.startDate = findStartDate(currentEndDate, task.duration);
      
      console.log(`Task ${task.name}: ${formatDate(task.startDate)} to ${formatDate(task.endDate)} (${task.duration} days)`);
      
      if (i > 0) {
        currentEndDate = findPreviousWorkingDay(task.startDate);
      }
    }
    
    console.log('Timeline calculated successfully');
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
  
  if (attempts >= maxAttempts) {
    console.warn('Max attempts reached finding valid end date');
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
  
  if (attempts >= maxAttempts) {
    console.warn(`Max attempts reached finding start date for duration ${duration}`);
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
  
  if (attempts >= maxAttempts) {
    console.warn('Max attempts reached finding previous working day');
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
  
  if (state.isGeneratingTimeline) {
    console.log('Timeline generation already in progress');
    return;
  }
  
  console.log('Starting timeline generation...');
  state.isGeneratingTimeline = true;
  showLoading('Calculating timeline...');
  
  setTimeout(() => {
    try {
      const success = calculateTimeline();
      if (success) {
        updateUI();
        initDragAndDrop();
        showToast('Timeline generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Timeline generation error:', error);
      showToast('Error generating timeline: ' + error.message, 'error');
    } finally {
      hideLoading();
      state.isGeneratingTimeline = false;
      console.log('Timeline generation completed');
    }
  }, 500);
}

// ==========================================================================
// Holidays Management
// ==========================================================================

function loadHolidays() {
  const vevents = holidaysData.vcalendar[0].vevent;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const endYear = currentYear + 2;
  
  state.holidays = vevents
    .map(evt => {
      const raw = evt.dtstart[0];
      const year = parseInt(raw.slice(0, 4));
      
      if (year < startYear || year > endYear) {
        return null;
      }
      
      const d = new Date(
        year,
        parseInt(raw.slice(4, 6)) - 1,
        parseInt(raw.slice(6, 8))
      );
      return { 
        date: normalizeDate(d), 
        summary: evt.summary 
      };
    })
    .filter(holiday => holiday !== null);
  
  state.holidaySet.clear();
  state.holidays.forEach(h => state.holidaySet.add(+h.date));
  
  console.log(`Loaded ${state.holidays.length} holidays for years ${startYear}-${endYear}`);
}

function renderHolidays() {
  if (!refs.holidayItems) return;
  
  refs.holidayItems.innerHTML = '';
  state.holidays
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
  return day === 0 || day === 6;
}

function isExcludedHoliday(date) {
  return state.skipHolidays && state.holidaySet.has(+normalizeDate(date));
}

function handleHolidayToggle() {
  state.skipHolidays = refs.excludeHolidaysCheckbox?.checked ?? true;
  
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
// Drag and Drop
// ==========================================================================

function initDragAndDrop() {
  if (!refs.planBody || typeof Sortable === 'undefined') return;
  
  if (state.sortableInstance) {
    state.sortableInstance.destroy();
  }
  
  try {
    state.sortableInstance = Sortable.create(refs.planBody, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      handle: 'tr',
      onEnd: function(evt) {
        const newTasks = [];
        const rows = refs.planBody.querySelectorAll('tr');
        
        rows.forEach(row => {
          const taskName = row.cells[0]?.textContent?.trim();
          const cleanTaskName = taskName?.split('\n')[0] || '';
          const task = state.tasks.find(t => t.name === cleanTaskName);
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
  } catch (error) {
    console.error('Error initializing drag and drop:', error);
  }
}

// ==========================================================================
// UI Rendering
// ==========================================================================

function updateUI() {
  console.log('Updating UI, tasks:', state.tasks.length);
  renderTasks();
  updateButtons();
}

function renderTasks() {
  if (!refs.planTable || !refs.planBody || !refs.noTasksMsg) return;
  
  const hasTasksWithTimeline = state.tasks.length > 0 && state.tasks[0]?.startDate;
  
  console.log('Rendering tasks:', {
    tasksCount: state.tasks.length,
    hasTimeline: hasTasksWithTimeline
  });
  
  if (hasTasksWithTimeline) {
    refs.planTable.style.display = 'table';
    refs.noTasksMsg.style.display = 'none';
    
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
  } else {
    refs.planTable.style.display = 'none';
    refs.noTasksMsg.style.display = 'block';
    
    if (state.tasks.length === 0) {
      refs.noTasksMsg.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <h4>No tasks added yet</h4>
          <p>Add your first task above to get started with planning</p>
        </div>
      `;
    } else {
      refs.noTasksMsg.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">⏳</div>
          <h4>${state.tasks.length} task${state.tasks.length !== 1 ? 's' : ''} added</h4>
          <p>Click "Generate Timeline" to see your project schedule</p>
        </div>
      `;
    }
  }
}

function updateButtons() {
  const hasTasks = state.tasks.length > 0;
  const hasTimeline = hasTasks && state.tasks[0]?.startDate;
  
  if (refs.generateTimelineBtn) {
    refs.generateTimelineBtn.disabled = !hasTasks || state.isGeneratingTimeline;
    refs.generateTimelineBtn.textContent = state.isGeneratingTimeline ? 
      'Calculating...' : 'Generate Timeline';
  }
  
  if (refs.exportBtn) refs.exportBtn.disabled = !hasTimeline;
  if (refs.exportCsvBtn) refs.exportCsvBtn.disabled = !hasTimeline;
  if (refs.exportPdfBtn) refs.exportPdfBtn.disabled = !hasTimeline;
  if (refs.clearAllBtn) refs.clearAllBtn.disabled = !hasTasks;
}

// ==========================================================================
// Theme Management - FIXED for Edge
// ==========================================================================

const themes = [
  { id: 'classic-blue', name: 'Classic Blue', type: 'light' },
  { id: 'forest-green', name: 'Forest Green', type: 'light' },
  { id: 'sunset-orange', name: 'Sunset Orange', type: 'light' },
  { id: 'dark-mode', name: 'Dark Mode', type: 'dark' },
  { id: 'purple-dark', name: 'Purple Dark', type: 'dark' }
];

function applyTheme(themeId) {
  console.log('Applying theme:', themeId);
  
  const theme = themes.find(t => t.id === themeId);
  if (!theme) {
    console.warn('Invalid theme ID, using default');
    themeId = 'classic-blue';
  }
  
  state.currentTheme = themeId;
  
  // Force theme application by removing and adding the attribute
  document.documentElement.removeAttribute('data-theme');
  setTimeout(() => {
    document.documentElement.setAttribute('data-theme', themeId);
  }, 10);
  
  localStorage.setItem('backward-planner-theme', themeId);
  
  if (refs.themeSelector) {
    refs.themeSelector.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === themeId);
    });
  }
  
  console.log('Theme applied successfully:', themeId);
}

// FIXED: Theme change handler for Edge
function handleThemeChangeFixed(e) {
  e.preventDefault();
  
  let themeOption = null;
  
  if (e.target.classList.contains('theme-option')) {
    themeOption = e.target;
  } else {
    themeOption = e.target.closest('.theme-option');
  }
  
  if (themeOption) {
    const themeId = themeOption.dataset.theme;
    if (themeId && themes.find(t => t.id === themeId)) {
      console.log('Theme selected:', themeId);
      applyTheme(themeId);
      const theme = themes.find(t => t.id === themeId);
      showToast(`Theme changed to ${theme?.name || themeId}`, 'success');
    }
  }
}

// ==========================================================================
// Font Size Management - FIXED for Edge
// ==========================================================================

const fontSizes = [
  { id: 'small', name: 'Small (Compact)' },
  { id: 'medium', name: 'Medium (Default)' },
  { id: 'large', name: 'Large (Accessible)' }
];

function applyFontSize(fontSizeId) {
  console.log('Applying font size:', fontSizeId);
  
  const fontSize = fontSizes.find(f => f.id === fontSizeId);
  if (!fontSize) {
    console.warn('Invalid font size ID, using default');
    fontSizeId = 'medium';
  }
  
  state.currentFontSize = fontSizeId;
  
  // Force font size application
  document.documentElement.removeAttribute('data-font-size');
  setTimeout(() => {
    document.documentElement.setAttribute('data-font-size', fontSizeId);
  }, 10);
  
  localStorage.setItem('backward-planner-font-size', fontSizeId);
  
  if (refs.fontSizeSelector) {
    const radio = refs.fontSizeSelector.querySelector(`input[value="${fontSizeId}"]`);
    if (radio) {
      radio.checked = true;
    }
    
    // Update visual selection
    refs.fontSizeSelector.querySelectorAll('.font-option').forEach(option => {
      const radioInOption = option.querySelector('input[type="radio"]');
      option.classList.toggle('selected', radioInOption?.value === fontSizeId);
    });
  }
  
  console.log('Font size applied successfully:', fontSizeId);
}

// FIXED: Font size change handler for Edge
function handleFontSizeChangeFixed(e) {
  let fontSizeId = null;
  
  // Handle radio button change
  if (e.target.type === 'radio' && e.target.name === 'fontSize') {
    fontSizeId = e.target.value;
  }
  // Handle clicking on label/option
  else {
    const fontOption = e.target.closest('.font-option');
    if (fontOption) {
      const radio = fontOption.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        fontSizeId = radio.value;
      }
    }
  }
  
  if (fontSizeId && fontSizes.find(f => f.id === fontSizeId)) {
    console.log('Font size selected:', fontSizeId);
    applyFontSize(fontSizeId);
    const fontSize = fontSizes.find(f => f.id === fontSizeId);
    showToast(`Font size changed to ${fontSize?.name || fontSizeId}`, 'success');
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
    applyTheme('classic-blue');
    applyFontSize('medium');
    state.dateFormat = 'yyyy-MM-dd';
    state.skipHolidays = true;
    
    if (refs.dateFormatSelect) refs.dateFormatSelect.value = state.dateFormat;
    if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.checked = state.skipHolidays;
    
    if (state.tasks.length > 0 && state.tasks[0]?.startDate) {
      calculateTimeline();
    }
    updateUI();
    renderHolidays();
    
    showToast('Settings reset to defaults', 'success');
  }
}

function saveSettings() {
  showToast('Settings saved successfully!', 'success');
}

// ==========================================================================
// Export Functions - ENHANCED with Multiple Formats
// ==========================================================================

function handleExportJSON() {
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
  
  downloadFile(
    JSON.stringify(exportData, null, 2),
    `backward-planner-${formatDateForFilename(new Date())}.json`,
    'application/json'
  );
  
  showToast('Project exported as JSON successfully!', 'success');
}

function handleExportCSV() {
  if (!state.tasks.length || !state.tasks[0]?.startDate) {
    showToast('No timeline to export. Generate timeline first.', 'warning');
    return;
  }
  
  const csvHeaders = ['Task Name', 'Start Date', 'Start Day', 'End Date', 'End Day', 'Duration (days)', 'Description'];
  const csvRows = state.tasks.map(task => [
    `"${task.name.replace(/"/g, '""')}"`,
    formatDate(task.startDate),
    getWeekday(task.startDate),
    formatDate(task.endDate),
    getWeekday(task.endDate),
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

function handleExportPDF() {
  if (!state.tasks.length || !state.tasks[0]?.startDate) {
    showToast('No timeline to export. Generate timeline first.', 'warning');
    return;
  }
  
  // Create a simple HTML table for PDF export
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Project Timeline - ${state.projectName || 'Backward Planner'}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2563eb; margin-bottom: 10px; }
        .project-info { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border: 1px solid #e2e8f0; }
        th { background-color: #f1f5f9; font-weight: 600; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .footer { margin-top: 30px; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <h1>📅 ${state.projectName || 'Project Timeline'}</h1>
      <div class="project-info">
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
            <th>Start Day</th>
            <th>End Date</th>
            <th>End Day</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${state.tasks.map(task => `
            <tr>
              <td><strong>${escapeHtml(task.name)}</strong>${task.description ? `<br><small>${escapeHtml(task.description)}</small>` : ''}</td>
              <td>${formatDate(task.startDate)}</td>
              <td>${getWeekday(task.startDate)}</td>
              <td>${formatDate(task.endDate)}</td>
              <td>${getWeekday(task.endDate)}</td>
              <td>${task.duration} day${task.duration !== 1 ? 's' : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Generated by Backward Planner - https://github.com/donaldcng/backward-planner-v2</p>
      </div>
    </body>
    </html>
  `;
  
  // For PDF, we'll create an HTML file that can be printed to PDF
  downloadFile(
    htmlContent,
    `backward-planner-timeline-${formatDateForFilename(new Date())}.html`,
    'text/html'
  );
  
  showToast('Timeline exported as HTML successfully! Open the file and print to PDF.', 'info');
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
// Import/Export
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
    
    // FIXED: Clear timeline data to force recalculation
    state.tasks = data.tasks.map(task => ({
      id: task.id || Date.now() + Math.random(),
      name: task.name || 'Unnamed Task',
      description: task.description || '',
      duration: parseInt(task.duration) || 1,
      startDate: null, // Force recalculation
      endDate: null
    }));
    
    if (data.settings) {
      if (data.settings.dateFormat) state.dateFormat = data.settings.dateFormat;
      if (typeof data.settings.skipHolidays === 'boolean') state.skipHolidays = data.settings.skipHolidays;
      if (data.settings.theme) applyTheme(data.settings.theme);
      if (data.settings.fontSize) applyFontSize(data.settings.fontSize);
    }
    
    if (refs.projectNameInput) refs.projectNameInput.value = state.projectName;
    if (refs.projectDescriptionInput) refs.projectDescriptionInput.value = state.projectDescription;
    if (refs.deadlineInput) refs.deadlineInput.value = state.deadline.toISOString().split('T')[0];
    if (refs.dateFormatSelect) refs.dateFormatSelect.value = state.dateFormat;
    if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.checked = state.skipHolidays;
    
    updateDeadlineDisplay();
    if (refs.taskSection) refs.taskSection.style.display = 'block';
    
    updateUI();
    
    showToast('Project imported successfully! Click "Generate Timeline" to see the schedule.', 'success');
    showPage('planning');
    
  } catch (error) {
    showToast('Error importing project: ' + error.message, 'error');
    console.error('Import error:', error);
  }
}

// ==========================================================================
// Sample Project
// ==========================================================================

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
    
    if (refs.taskSection) refs.taskSection.style.display = 'none';
    updateUI();
    
    showToast('All data cleared', 'success');
  }
}

function handleKeyboard(e) {
  if (e.key === 'Escape') {
    closeEditModal();
  }
  
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
// Loading & Toast UI
// ==========================================================================

function showLoading(message = 'Loading...') {
  if (refs.loading) {
    const loadingText = refs.loading.querySelector('p');
    if (loadingText) loadingText.textContent = message;
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
  
  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }, 4000);
}

// ==========================================================================
// Global Functions
// ==========================================================================

window.editTask = editTask;
window.deleteTask = deleteTask;
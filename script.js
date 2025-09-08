// ==========================================================================
// Backward Planner - JavaScript (EDITING & THEME BUGS FIXED)
// Fixed: Task editing, Theme switching, Font size changes
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
  editingTaskIndex: -1
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
  excludeHolidaysCheckbox: document.getElementById('exclude-holidays'),
  holidayItems: document.getElementById('holiday-items'),
  
  editTaskModal: document.getElementById('edit-task-modal'),
  editTaskForm: document.getElementById('edit-task-form'),
  editTaskNameInput: document.getElementById('edit-task-name'),
  editTaskDurationInput: document.getElementById('edit-task-duration'),
  editTaskDescriptionInput: document.getElementById('edit-task-description'),
  cancelEditBtn: document.getElementById('cancel-edit'),
  saveEditBtn: document.getElementById('save-edit'),
  modalCloseBtn: document.querySelector('.modal__close'),
  
  loading: document.getElementById('loading'),
  toastContainer: document.getElementById('toast-container')
};

// Hong Kong Holidays Data (2024-2027)
const holidaysData = [
  // 2024 Holidays
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
  
  // 2025 Holidays
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
  
  // 2026 Holidays
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
  
  // 2027 Holidays
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

// ==========================================================================
// Application Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  console.log('Initializing Backward Planner...');
  
  loadHolidays();
  bindEventListeners();
  applyTheme(state.currentTheme);
  applyFontSize(state.currentFontSize);
  renderHolidays();
  updateUI();
  
  showToast('Welcome to Backward Planner!', 'info');
}

// ==========================================================================
// Event Listeners - FIXED
// ==========================================================================

function bindEventListeners() {
  console.log('Binding event listeners...');
  
  // Navigation
  if (refs.navToggle) {
    refs.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  refs.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Project Setup
  if (refs.setDeadlineBtn) refs.setDeadlineBtn.addEventListener('click', handleSetDeadline);
  if (refs.projectNameInput) refs.projectNameInput.addEventListener('input', handleProjectNameChange);
  if (refs.projectDescriptionInput) refs.projectDescriptionInput.addEventListener('input', handleProjectDescriptionChange);
  if (refs.deadlineInput) refs.deadlineInput.addEventListener('change', handleDeadlineInputChange);
  
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
  if (refs.exportPdfBtn) refs.exportPdfBtn.addEventListener('click', handleExportHTML);
  if (refs.importBtn) refs.importBtn.addEventListener('click', () => refs.importFile?.click());
  if (refs.importFile) refs.importFile.addEventListener('change', handleImport);
  
  // Settings - COMPLETELY FIXED
  bindThemeEvents();
  bindFontSizeEvents();
  
  if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.addEventListener('change', handleHolidayToggle);
  
  // Modal events - FIXED
  bindModalEvents();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);
  
  console.log('Event listeners bound successfully');
}

// FIXED: Theme event binding
function bindThemeEvents() {
  if (refs.themeSelector) {
    // Bind click events to each theme option
    const themeOptions = refs.themeSelector.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        e.preventDefault();
        const themeId = this.getAttribute('data-theme');
        if (themeId) {
          console.log('Theme clicked:', themeId);
          applyTheme(themeId);
          showToast(`Theme changed to ${this.textContent.trim()}`, 'success');
        }
      });
    });
    console.log('Theme events bound to', themeOptions.length, 'options');
  }
}

// FIXED: Font size event binding
function bindFontSizeEvents() {
  if (refs.fontSizeSelector) {
    // Bind events to radio buttons and labels
    const fontOptions = refs.fontSizeSelector.querySelectorAll('.font-option');
    fontOptions.forEach(option => {
      const radio = option.querySelector('input[type="radio"]');
      
      // Click on label
      option.addEventListener('click', function(e) {
        if (e.target.type !== 'radio') {
          e.preventDefault();
          radio.checked = true;
        }
        const fontSizeId = radio.value;
        console.log('Font size clicked:', fontSizeId);
        applyFontSize(fontSizeId);
        showToast(`Font size changed to ${fontSizeId}`, 'success');
      });
      
      // Change on radio button
      radio.addEventListener('change', function() {
        if (this.checked) {
          const fontSizeId = this.value;
          console.log('Font size changed:', fontSizeId);
          applyFontSize(fontSizeId);
          showToast(`Font size changed to ${fontSizeId}`, 'success');
        }
      });
    });
    console.log('Font size events bound to', fontOptions.length, 'options');
  }
}

// FIXED: Modal event binding
function bindModalEvents() {
  if (refs.cancelEditBtn) refs.cancelEditBtn.addEventListener('click', closeEditModal);
  if (refs.saveEditBtn) refs.saveEditBtn.addEventListener('click', saveTaskEdit);
  if (refs.modalCloseBtn) refs.modalCloseBtn.addEventListener('click', closeEditModal);
  
  if (refs.editTaskModal) {
    refs.editTaskModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__overlay') || e.target === refs.editTaskModal) {
        closeEditModal();
      }
    });
  }
}

// ==========================================================================
// Navigation
// ==========================================================================

function toggleMobileMenu() {
  refs.navMenu?.classList.toggle('nav__menu--open');
}

function handleNavigation(e) {
  e.preventDefault();
  const page = e.currentTarget.dataset.page;
  if (page) {
    showPage(page);
    refs.navMenu?.classList.remove('nav__menu--open');
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
  if (refs.taskSection) refs.taskSection.style.display = 'block';
  
  clearExistingTimeline();
  showToast('Deadline set successfully!', 'success');
}

function handleDeadlineInputChange() {
  if (refs.deadlineInput?.value && state.tasks.length > 0) {
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
  if (refs.deadlineDisplay && state.deadline) {
    refs.deadlineDisplay.textContent = `Deadline: ${formatDate(state.deadline)}`;
    refs.deadlineDisplay.style.display = 'block';
  }
}

// ==========================================================================
// Task Management - FIXED EDITING
// ==========================================================================

function handleAddTask() {
  const name = refs.taskNameInput?.value.trim();
  const duration = parseInt(refs.taskDurationInput?.value, 10);
  
  if (!name) {
    showToast('Please enter a task name', 'error');
    refs.taskNameInput?.focus();
    return;
  }
  
  if (!duration || duration < 1) {
    showToast('Please enter a valid duration (minimum 1 day)', 'error');
    refs.taskDurationInput?.focus();
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
  
  if (refs.taskNameInput) refs.taskNameInput.value = '';
  if (refs.taskDurationInput) refs.taskDurationInput.value = '';
  
  updateTaskList();
  updateUI();
  
  showToast(`Task "${name}" added successfully!`, 'success');
  refs.taskNameInput?.focus();
}

// FIXED: Task editing functions
function editTask(index) {
  console.log('Editing task at index:', index);
  
  if (index < 0 || index >= state.tasks.length) {
    showToast('Invalid task index', 'error');
    return;
  }
  
  state.editingTaskIndex = index;
  const task = state.tasks[index];
  
  if (refs.editTaskNameInput) refs.editTaskNameInput.value = task.name;
  if (refs.editTaskDurationInput) refs.editTaskDurationInput.value = task.duration;
  if (refs.editTaskDescriptionInput) refs.editTaskDescriptionInput.value = task.description || '';
  
  if (refs.editTaskModal) {
    refs.editTaskModal.classList.add('active');
    refs.editTaskModal.style.display = 'flex';
  }
  
  refs.editTaskNameInput?.focus();
}

function saveTaskEdit() {
  console.log('Saving task edit, index:', state.editingTaskIndex);
  
  if (state.editingTaskIndex < 0 || state.editingTaskIndex >= state.tasks.length) {
    showToast('Invalid task to save', 'error');
    return;
  }
  
  const name = refs.editTaskNameInput?.value.trim();
  const duration = parseInt(refs.editTaskDurationInput?.value, 10);
  const description = refs.editTaskDescriptionInput?.value.trim();
  
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
  if (refs.editTaskModal) {
    refs.editTaskModal.classList.remove('active');
    refs.editTaskModal.style.display = 'none';
  }
  state.editingTaskIndex = -1;
}

function deleteTask(index) {
  console.log('Deleting task at index:', index);
  
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
  if (!refs.noTasksMsg) return;
  
  if (state.tasks.length === 0) {
    refs.noTasksMsg.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">📋</div>
        <h4>No tasks added yet</h4>
        <p>Add your first task above to get started with planning</p>
      </div>
    `;
    refs.noTasksMsg.style.display = 'block';
    if (refs.planTable) refs.planTable.style.display = 'none';
  } else {
    refs.noTasksMsg.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⏳</div>
        <h4>${state.tasks.length} task${state.tasks.length !== 1 ? 's' : ''} added</h4>
        <p>Click "Generate Timeline" to see your project schedule</p>
      </div>
    `;
    refs.noTasksMsg.style.display = 'block';
    if (refs.planTable) refs.planTable.style.display = 'none';
  }
}

// ==========================================================================
// Timeline Calculation
// ==========================================================================

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

// ==========================================================================
// Holidays Management
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
  if (!refs.holidayItems) {
    console.log('No holiday items container found');
    return;
  }
  
  refs.holidayItems.innerHTML = '';
  
  if (state.holidays.length === 0) {
    refs.holidayItems.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No holidays loaded</p>';
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
      refs.holidayItems.appendChild(div);
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
// UI Rendering - FIXED with Edit Buttons
// ==========================================================================

function updateUI() {
  renderTasks();
  updateButtons();
}

function renderTasks() {
  if (!refs.planTable || !refs.planBody || !refs.noTasksMsg) return;
  
  const hasTasksWithTimeline = state.tasks.length > 0 && state.tasks[0]?.startDate;
  
  if (hasTasksWithTimeline) {
    refs.planTable.style.display = 'table';
    refs.noTasksMsg.style.display = 'none';
    
    refs.planBody.innerHTML = '';
    state.tasks.forEach((task, index) => {
      const row = document.createElement('tr');
      row.classList.add('task-row');
      row.innerHTML = `
        <td><strong>${escapeHtml(task.name)}</strong>
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
      refs.planBody.appendChild(row);
    });
  } else {
    updateTaskList();
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
// Theme Management - COMPLETELY FIXED
// ==========================================================================

function applyTheme(themeId) {
  console.log('Applying theme:', themeId);
  
  // Validate theme
  const validThemes = ['classic-blue', 'forest-green', 'sunset-orange', 'dark-mode', 'purple-dark'];
  if (!validThemes.includes(themeId)) {
    console.warn('Invalid theme:', themeId, 'using default');
    themeId = 'classic-blue';
  }
  
  state.currentTheme = themeId;
  
  // Remove all theme classes first
  validThemes.forEach(theme => {
    document.documentElement.classList.remove(`theme-${theme}`);
    document.documentElement.removeAttribute('data-theme');
  });
  
  // Apply new theme
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.classList.add(`theme-${themeId}`);
  
  // Save to localStorage
  localStorage.setItem('backward-planner-theme', themeId);
  
  // Update UI selection
  if (refs.themeSelector) {
    refs.themeSelector.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === themeId);
    });
  }
  
  console.log('Theme applied successfully:', themeId);
  
  // Force a repaint
  setTimeout(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }, 10);
}

// ==========================================================================
// Font Size Management - COMPLETELY FIXED
// ==========================================================================

function applyFontSize(fontSizeId) {
  console.log('Applying font size:', fontSizeId);
  
  // Validate font size
  const validSizes = ['small', 'medium', 'large'];
  if (!validSizes.includes(fontSizeId)) {
    console.warn('Invalid font size:', fontSizeId, 'using default');
    fontSizeId = 'medium';
  }
  
  state.currentFontSize = fontSizeId;
  
  // Remove all font size classes first
  validSizes.forEach(size => {
    document.documentElement.classList.remove(`font-${size}`);
    document.documentElement.removeAttribute('data-font-size');
  });
  
  // Apply new font size
  document.documentElement.setAttribute('data-font-size', fontSizeId);
  document.documentElement.classList.add(`font-${fontSizeId}`);
  
  // Save to localStorage
  localStorage.setItem('backward-planner-font-size', fontSizeId);
  
  // Update UI selection
  if (refs.fontSizeSelector) {
    const radio = refs.fontSizeSelector.querySelector(`input[value="${fontSizeId}"]`);
    if (radio) {
      radio.checked = true;
    }
    
    refs.fontSizeSelector.querySelectorAll('.font-option').forEach(option => {
      const radioInOption = option.querySelector('input[type="radio"]');
      option.classList.toggle('selected', radioInOption?.value === fontSizeId);
    });
  }
  
  console.log('Font size applied successfully:', fontSizeId);
  
  // Force a repaint
  setTimeout(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }, 10);
}

// ==========================================================================
// Export Functions
// ==========================================================================

function handleExportJSON() {
  if (!state.deadline || state.tasks.length === 0) {
    showToast('Nothing to export. Please create a project first.', 'error');
    return;
  }
  
  const exportData = {
    version: '2.1.1',
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
    <p>Generated by Backward Planner - https://github.com/donaldcng/backward-planner-v2</p>
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
// Import/Sample Project
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
    
    if (refs.projectNameInput) refs.projectNameInput.value = state.projectName;
    if (refs.projectDescriptionInput) refs.projectDescriptionInput.value = state.projectDescription;
    if (refs.deadlineInput) refs.deadlineInput.value = state.deadline.toISOString().split('T')[0];
    if (refs.excludeHolidaysCheckbox) refs.excludeHolidaysCheckbox.checked = state.skipHolidays;
    
    updateDeadlineDisplay();
    if (refs.taskSection) refs.taskSection.style.display = 'block';
    
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
// Global Functions - REQUIRED
// ==========================================================================

window.editTask = editTask;
window.deleteTask = deleteTask;
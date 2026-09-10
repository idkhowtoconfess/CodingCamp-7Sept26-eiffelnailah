// ===== Greeting Section =====
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('timeDisplay').textContent = timeString;
    document.getElementById('dateDisplay').textContent = dateString;

    let greeting = 'Hello!';
    if (hour < 12) {
        greeting = 'Good Morning!';
    } else if (hour < 18) {
        greeting = 'Good Afternoon!';
    } else {
        greeting = 'Good Evening!';
    }
    document.getElementById('greeting').textContent = greeting;
}

setInterval(updateGreeting, 1000);
updateGreeting();

// ===== Focus Timer Section =====
let timerInterval = null;
let timeLeft = 25 * 60;
let isTimerRunning = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(timeLeft);
}

document.getElementById('startTimer').addEventListener('click', () => {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                alert('Timer complete! Time to take a break.');
            }
        }, 1000);
    }
});

document.getElementById('stopTimer').addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
    }
});

document.getElementById('resetTimer').addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isTimerRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// ===== To-Do List Section =====
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editingTodoId = null;

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="todo-edit">Edit</button>
                <button class="todo-delete">Delete</button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('addTodo').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        input.value = '';
    }
});

document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('addTodo').click();
    }
});

document.getElementById('todoList').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const id = parseInt(li.dataset.id);
    const todo = todos.find(t => t.id === id);

    if (e.target.classList.contains('todo-checkbox')) {
        todo.completed = e.target.checked;
        saveTodos();
        renderTodos();
    } else if (e.target.classList.contains('todo-delete')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    } else if (e.target.classList.contains('todo-edit')) {
        const input = document.getElementById('todoInput');
        const addBtn = document.getElementById('addTodo');
        const editBtn = document.getElementById('editTodoBtn');

        input.value = todo.text;
        editingTodoId = id;
        addBtn.style.display = 'none';
        editBtn.style.display = 'block';
        input.focus();
    }
});

document.getElementById('editTodoBtn').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text && editingTodoId) {
        const todoIndex = todos.findIndex(t => t.id === editingTodoId);
        if (todoIndex !== -1) {
            todos[todoIndex].text = text;
            saveTodos();
            renderTodos();
            editingTodoId = null;
        }
    }

    document.getElementById('addTodo').style.display = 'block';
    document.getElementById('editTodoBtn').style.display = 'none';
    document.getElementById('todoInput').value = '';
});

// Initialize todos on page load
renderTodos();

// ===== Quick Links Section =====
let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [];

function saveQuickLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
}

function renderQuickLinks() {
    const linksList = document.getElementById('quickLinksList');
    linksList.innerHTML = '';

    quickLinks.forEach(link => {
        const li = document.createElement('li');
        li.className = 'quick-link-item';

        li.innerHTML = `
            <a href="${link.url}" target="_blank" class="quick-link-name">${escapeHtml(link.name)}</a>
            <button class="link-delete" data-url="${link.url}">Delete</button>
        `;

        linksList.appendChild(li);
    });
}

document.getElementById('addLink').addEventListener('click', () => {
    const nameInput = document.getElementById('linkNameInput');
    const urlInput = document.getElementById('linkUrlInput');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (name && url) {
        let finalUrl = url;
        if (!url.match(/^https?:\/\//i)) {
            finalUrl = 'https://' + url;
        }

        quickLinks.push({ name, url: finalUrl });
        saveQuickLinks();
        renderQuickLinks();
        nameInput.value = '';
        urlInput.value = '';
    }
});

document.getElementById('linkNameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('linkUrlInput').focus();
});

document.getElementById('linkUrlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('addLink').click();
});

document.getElementById('quickLinksList').addEventListener('click', (e) => {
    if (e.target.classList.contains('link-delete')) {
        const url = e.target.dataset.url;
        quickLinks = quickLinks.filter(link => link.url !== url);
        saveQuickLinks();
        renderQuickLinks();
    }
});

// Initialize links on page load
renderQuickLinks();
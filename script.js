// User management functions
let isLoginMode = true;

function handleSubmit(event) {
    event.preventDefault();
    handleLogin();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        passwordToggle.textContent = "Show";
    }
}

function validateUsername() {
    const usernameInput = document.getElementById("username");
    const usernameError = document.getElementById("usernameError");
    const username = usernameInput.value.trim();
    
    clearError(usernameError);
    
    if (!username) {
        if (usernameInput.value !== "") {
            showInputError(usernameError, "Username is required");
            return false;
        }
        return true;
    }
    
    if (username.length < 3) {
        showInputError(usernameError, "Username must be at least 3 characters");
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showInputError(usernameError, "Username can only contain letters, numbers, and underscores");
        return false;
    }
    
    if (!isLoginMode) {
        const users = getUsers();
        if (users[username]) {
            showInputError(usernameError, "Username already exists");
            return false;
        }
    }
    
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");
    const password = passwordInput.value;
    
    clearError(passwordError);
    
    if (!password) {
        if (passwordInput.value !== "") {
            showInputError(passwordError, "Password is required");
            updatePasswordStrength(0);
            return false;
        }
        updatePasswordStrength(0);
        return true;
    }
    
    if (isLoginMode) {
        return true;
    }
    
    // Registration password validation
    if (password.length < 4) {
        showInputError(passwordError, "Password must be at least 4 characters");
        updatePasswordStrength(password.length);
        return false;
    }
    
    updatePasswordStrength(password.length);
    return true;
}

function updatePasswordStrength(passwordLength) {
    const strengthIndicator = document.getElementById("passwordStrength");
    const password = document.getElementById("password").value;
    
    if (isLoginMode || !password) {
        strengthIndicator.innerHTML = "";
        strengthIndicator.className = "password-strength";
        return;
    }
    
    let strength = 0;
    let strengthClass = "";
    
    if (password.length >= 4) strength++;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) {
        strengthClass = "weak";
    } else if (strength <= 4) {
        strengthClass = "medium";
    } else {
        strengthClass = "strong";
    }
    
    strengthIndicator.innerHTML = '<div class="password-strength-bar"></div>';
    strengthIndicator.className = `password-strength ${strengthClass}`;
}

function showInputError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
}

function clearError(errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
}

function toggleMode() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const toggleButton = document.getElementById("toggleButton");
    const toggleText = document.getElementById("toggleText");
    const submitButton = document.getElementById("buttonText");
    const rememberMeLabel = document.getElementById("rememberMeLabel");
    const passwordStrength = document.getElementById("passwordStrength");
    
    clearMessages();
    
    // Reset form
    document.getElementById("authForm").reset();
    clearError(document.getElementById("usernameError"));
    clearError(document.getElementById("passwordError"));
    updatePasswordStrength(0);
    
    if (isLoginMode) {
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Sign in to your account";
        submitButton.textContent = "Login";
        toggleText.textContent = "Don't have an account?";
        toggleButton.textContent = "Create Account";
        rememberMeLabel.style.display = "flex";
        passwordStrength.innerHTML = "";
        passwordStrength.className = "password-strength";
    } else {
        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Sign up to get started";
        submitButton.textContent = "Sign Up";
        toggleText.textContent = "Already have an account?";
        toggleButton.textContent = "Back to Login";
        rememberMeLabel.style.display = "none";
    }
}

function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    
    // Clear previous messages
    clearMessages();
    
    // Validate inputs
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    
    if (!isUsernameValid || !isPasswordValid) {
        showError("Please fix the errors above");
        return;
    }
    
    if (!username || !password) {
        showError("Please enter username and password");
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate async operation with timeout for better UX
    setTimeout(() => {
        if (isLoginMode) {
            login(username, password);
        } else {
            createAccount(username, password);
        }
    }, 300);
}

function setLoadingState(loading) {
    const submitButton = document.getElementById("submitButton");
    if (loading) {
        submitButton.classList.add("loading");
        submitButton.disabled = true;
    } else {
        submitButton.classList.remove("loading");
        submitButton.disabled = false;
    }
}

function clearMessages() {
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");
    errorMessage.classList.remove("show");
    successMessage.classList.remove("show");
}

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    setLoadingState(false);
}

function showSuccess(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.classList.add("show");
}

function createAccount(username, password) {
    const users = getUsers();
    
    if (users[username]) {
        showError("Username already exists. Please choose a different username.");
        return;
    }
    
    if (username.length < 3) {
        showError("Username must be at least 3 characters long");
        return;
    }
    
    if (password.length < 4) {
        showError("Password must be at least 4 characters long");
        return;
    }
    
    // Create new user
    users[username] = password;
    saveUsers(users);
    
    // Initialize notes for new user
    initializeUserNotes(username);
    
    // Show success message
    showSuccess("Account created successfully! Redirecting...");
    
    // Login the new user after a short delay
    setTimeout(() => {
        localStorage.setItem("currentUser", username);
        window.location.href = "notes.html";
    }, 1000);
}

function login(username, password) {
    const users = getUsers();
    
    if (!users[username]) {
        showError("Incorrect password");
        return;
    }
    
    if (users[username] !== password) {
        showError("Incorrect password");
        return;
    }
    
    // Check remember me
    const rememberMe = document.getElementById("rememberMe");
    if (rememberMe && rememberMe.checked) {
        localStorage.setItem("rememberedUser", username);
    } else {
        localStorage.removeItem("rememberedUser");
    }
    
    // Show success message
    showSuccess("Login successful! Redirecting...");
    
    // Successful login
    setTimeout(() => {
        localStorage.setItem("currentUser", username);
        window.location.href = "notes.html";
    }, 500);
}

function getUsers() {
    const usersJson = localStorage.getItem("users");
    return usersJson ? JSON.parse(usersJson) : {};
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Notes management functions (user-specific)
function getUserNotesKey() {
    const user = getCurrentUser();
    return user ? `notes_${user}` : null;
}

function initializeUserNotes(username) {
    const notesKey = `notes_${username}`;
    if (!localStorage.getItem(notesKey)) {
        localStorage.setItem(notesKey, JSON.stringify([]));
    }
}

let editingNoteId = null;

function saveNote() {
    const noteText = document.getElementById("noteInput").value.trim();
    const notesKey = getUserNotesKey();

    if (!noteText) {
        showNotesMessage("Please write a note first", "error");
        return;
    }

    if (!notesKey) {
        showNotesMessage("Please login first", "error");
        setTimeout(() => window.location.href = "index.html", 1500);
        return;
    }

    let notes = JSON.parse(localStorage.getItem(notesKey)) || [];
    
    if (editingNoteId !== null) {
        // Update existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].text = noteText;
            notes[noteIndex].updatedAt = new Date().toISOString();
            showNotesMessage("Note updated successfully!", "success");
        }
        cancelEdit();
    } else {
        // Create new note
        const noteObject = {
            id: Date.now() + Math.random(), // Better ID generation
            text: noteText,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.push(noteObject);
        showNotesMessage("Note added successfully!", "success");
    }

    // Sort notes by creation date (newest first)
    notes.sort((a, b) => new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0));
    
    localStorage.setItem(notesKey, JSON.stringify(notes));
    document.getElementById("noteInput").value = "";
    displayNotes();
}

function cancelEdit() {
    editingNoteId = null;
    document.getElementById("noteInput").value = "";
    document.getElementById("saveButton").textContent = "Add Note";
    document.getElementById("cancelButton").style.display = "none";
    document.getElementById("noteInput").focus();
}

function editNote(noteId) {
    const notesKey = getUserNotesKey();
    if (!notesKey) return;

    const notes = JSON.parse(localStorage.getItem(notesKey)) || [];
    // Handle both numeric IDs (old format) and proper IDs
    const note = notes.find(n => {
        if (typeof n === 'string') return false;
        return n.id === noteId || n.id === parseFloat(noteId);
    });
    
    if (note) {
        editingNoteId = note.id || noteId;
        const noteText = typeof note === 'string' ? note : (note.text || note);
        document.getElementById("noteInput").value = noteText;
        document.getElementById("saveButton").textContent = "Update Note";
        document.getElementById("cancelButton").style.display = "inline-block";
        document.getElementById("noteInput").focus();
        
        // Scroll to input
        document.getElementById("noteInput").scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function addNote() {
    // Alias for backward compatibility
    saveNote();
}

function displayNotes() {
    const notesList = document.getElementById("notesList");
    if (!notesList) return;

    const notesKey = getUserNotesKey();
    if (!notesKey) {
        window.location.href = "index.html";
        return;
    }

    let notes = JSON.parse(localStorage.getItem(notesKey)) || [];
    
    // Sort notes by creation date (newest first)
    notes.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.timestamp || 0);
        return dateB - dateA;
    });
    
    notesList.innerHTML = "";

    if (notes.length === 0) {
        const li = document.createElement("li");
        li.className = "empty-state";
        li.innerHTML = `
            <div class="empty-message">
                <p>No notes yet.</p>
                <p class="empty-hint">Add your first note above!</p>
            </div>
        `;
        notesList.appendChild(li);
        return;
    }

    // Convert old format notes (strings) to new format before displaying
    let notesConverted = false;
    notes = notes.map((note, index) => {
        if (typeof note === 'string') {
            notesConverted = true;
            return {
                id: Date.now() + index + Math.random(),
                text: note,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }
        return note;
    });
    
    if (notesConverted) {
        localStorage.setItem(notesKey, JSON.stringify(notes));
    }
    
    notes.forEach((note, index) => {
        const noteId = note.id || Date.now() + index;
        const noteText = note.text || note;
        const createdAt = note.createdAt || note.timestamp || new Date().toISOString();
        const updatedAt = note.updatedAt;
        const isEdited = updatedAt && updatedAt !== createdAt;
        
        const dateDisplay = formatDate(createdAt);
        const timeDisplay = formatTime(createdAt);
        
        const li = document.createElement("li");
        li.className = "note-item";
        li.dataset.noteId = noteId;
        
        li.innerHTML = `
            <div class="note-content">
                <div class="note-text">${escapeHtml(noteText)}</div>
                <div class="note-meta">
                    <span class="note-date">${dateDisplay} at ${timeDisplay}</span>
                    ${isEdited ? '<span class="note-edited">(edited)</span>' : ''}
                </div>
            </div>
            <div class="note-actions">
                <button onclick="editNote(${noteId})" class="btn-edit" title="Edit note">Edit</button>
                <button onclick="confirmDeleteNote(${noteId})" class="btn-delete" title="Delete note">Delete</button>
            </div>
        `;
        notesList.appendChild(li);
    });
}

function formatDate(dateString) {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
}

function formatTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function showNotesMessage(message, type = "info") {
    const messageEl = document.getElementById("notesMessage");
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `notes-message ${type}`;
    messageEl.style.display = "block";
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageEl.style.display = "none";
    }, 3000);
}

function confirmDeleteNote(noteId) {
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
        deleteNote(noteId);
    }
}

function deleteNote(noteId) {
    const notesKey = getUserNotesKey();
    if (!notesKey) return;

    let notes = JSON.parse(localStorage.getItem(notesKey)) || [];
    
    // Handle both old format (array of strings) and new format (array of objects)
    if (typeof noteId === 'number' && notes.length > 0 && typeof notes[0] === 'object' && notes[0].id) {
        const initialLength = notes.length;
        notes = notes.filter(note => note.id !== noteId);
        if (notes.length < initialLength) {
            showNotesMessage("Note deleted successfully!", "success");
        }
    } else {
        if (notes[noteId]) {
            notes.splice(noteId, 1);
            showNotesMessage("Note deleted successfully!", "success");
        }
    }
    
    localStorage.setItem(notesKey, JSON.stringify(notes));
    displayNotes();
}

function searchNotes() {
    const searchText = document.getElementById("search").value.toLowerCase().trim();
    const notes = document.querySelectorAll("#notesList li.note-item");

    if (!searchText) {
        notes.forEach(note => {
            note.style.display = "block";
        });
        return;
    }

    let foundCount = 0;
    notes.forEach(note => {
        const noteText = note.querySelector(".note-text")?.textContent.toLowerCase() || "";
        const noteDate = note.querySelector(".note-date")?.textContent.toLowerCase() || "";
        const matches = noteText.includes(searchText) || noteDate.includes(searchText);
        
        note.style.display = matches ? "block" : "none";
        if (matches) foundCount++;
    });

    // Show search results message
    const messageEl = document.getElementById("notesMessage");
    if (messageEl && searchText) {
        if (foundCount === 0) {
            showNotesMessage(`No notes found matching "${searchText}"`, "info");
        } else {
            showNotesMessage(`Found ${foundCount} note${foundCount > 1 ? 's' : ''}`, "info");
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Check for remembered user on page load
if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
        document.getElementById("username").value = rememberedUser;
    }
}

// Check authentication on notes page
if (window.location.pathname.includes("notes.html")) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "index.html";
    } else {
        const usernameDisplay = document.getElementById("usernameDisplay");
        if (usernameDisplay) {
            usernameDisplay.textContent = currentUser;
        }
        displayNotes();
        
        // Add Enter key support for note input (Ctrl+Enter to save)
        const noteInput = document.getElementById("noteInput");
        if (noteInput) {
            noteInput.addEventListener("keydown", function(event) {
                if (event.key === "Enter" && event.ctrlKey) {
                    event.preventDefault();
                    saveNote();
                }
                if (event.key === "Escape" && editingNoteId !== null) {
                    cancelEdit();
                }
            });
        }
        
        // Clear search on Escape
        const searchInput = document.getElementById("search");
        if (searchInput) {
            searchInput.addEventListener("keydown", function(event) {
                if (event.key === "Escape") {
                    this.value = "";
                    searchNotes();
                }
            });
        }
    }
}

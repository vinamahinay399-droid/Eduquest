// Application State
let appState = {
    currentUser: null,
    currentView: 'home',
    courses: [],
    quizzes: [],
    lessons: [],
    achievements: [],
    leaderboard: [],
    currentQuiz: null,
    quizAnswers: [],
    quizStartTime: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    setupEventListeners();
    checkLocalStorage();
    showView('home');
});

// Load initial demo data
function loadInitialData() {
    // Load from localStorage or create demo data
    const savedData = localStorage.getItem('eduquest_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        appState = { ...appState, ...data };
    } else {
        createDemoData();
    }
    
    updateUI();
}

// Create demo data for first-time users
function createDemoData() {
    appState.courses = [
        {
            id: 1,
            title: 'Web Development Fundamentals',
            code: 'CS101',
            category: 'programming',
            description: 'Learn HTML, CSS, and JavaScript basics',
            instructor: 'Dr. Sarah Johnson',
            level: 'beginner',
            students: 45,
            duration: '8 weeks'
        },
        {
            id: 2,
            title: 'Data Structures & Algorithms',
            code: 'CS201',
            category: 'programming',
            description: 'Master essential algorithms and data structures',
            instructor: 'Prof. Michael Chen',
            level: 'intermediate',
            students: 32,
            duration: '10 weeks'
        },
        {
            id: 3,
            title: 'Calculus I',
            code: 'MATH101',
            category: 'math',
            description: 'Introduction to differential calculus',
            instructor: 'Dr. Robert Wilson',
            level: 'beginner',
            students: 67,
            duration: '12 weeks'
        }
    ];

    appState.quizzes = [
        {
            id: 1,
            courseId: 1,
            title: 'HTML Basics Quiz',
            description: 'Test your HTML knowledge',
            timeLimit: 10, // minutes
            questions: [
                {
                    id: 1,
                    type: 'mcq',
                    question: 'What does HTML stand for?',
                    options: [
                        'Hyper Text Markup Language',
                        'High Tech Modern Language',
                        'Hyper Transfer Markup Language',
                        'Home Tool Markup Language'
                    ],
                    correctAnswer: 0,
                    points: 10
                },
                {
                    id: 2,
                    type: 'truefalse',
                    question: 'HTML is a programming language.',
                    options: ['True', 'False'],
                    correctAnswer: 1,
                    points: 10
                },
                {
                    id: 3,
                    type: 'mcq',
                    question: 'Which tag is used for the largest heading?',
                    options: ['<h6>', '<heading>', '<h1>', '<head>'],
                    correctAnswer: 2,
                    points: 10
                },
                {
                    id: 4,
                    type: 'short',
                    question: 'What tag is used to create a hyperlink?',
                    correctAnswer: '<a>',
                    points: 10
                }
            ],
            passingScore: 70,
            xpReward: 100,
            coinReward: 50
        }
    ];

    appState.lessons = [
        {
            id: 1,
            courseId: 1,
            title: 'Introduction to HTML',
            content: 'HTML is the standard markup language for creating web pages...',
            type: 'text',
            duration: 30,
            order: 1
        },
        {
            id: 2,
            courseId: 1,
            title: 'HTML Elements and Tags',
            content: 'HTML elements are the building blocks of HTML pages...',
            type: 'text',
            duration: 45,
            order: 2
        }
    ];

    appState.achievements = [
        { id: 1, name: 'First Quiz', icon: 'fa-play-circle', description: 'Complete your first quiz', earned: false },
        { id: 2, name: 'Perfect Score', icon: 'fa-trophy', description: 'Score 100% on any quiz', earned: false },
        { id: 3, name: 'Course Master', icon: 'fa-graduation-cap', description: 'Complete a full course', earned: false },
        { id: 4, name: '7-Day Streak', icon: 'fa-fire', description: 'Log in for 7 consecutive days', earned: false }
    ];

    appState.leaderboard = [
        { id: 1, name: 'Alex Johnson', xp: 4500, level: 12, streak: 14 },
        { id: 2, name: 'Maria Garcia', xp: 3800, level: 11, streak: 7 },
        { id: 3, name: 'David Smith', xp: 3200, level: 10, streak: 21 },
        { id: 4, name: 'Sarah Williams', xp: 2900, level: 9, streak: 3 },
        { id: 5, name: 'James Brown', xp: 2500, level: 8, streak: 5 }
    ];

    saveToLocalStorage();
}

// Setup event listeners
function setupEventListeners() {
    // Course filter
    document.getElementById('courseFilter')?.addEventListener('change', filterCourses);
    document.getElementById('courseSearch')?.addEventListener('input', filterCourses);
    
    // Auth button
    document.getElementById('authButton')?.addEventListener('click', function() {
        if (appState.currentUser) {
            logout();
        } else {
            openAuthModal();
        }
    });
}

// Check localStorage for saved user
function checkLocalStorage() {
    const savedUser = localStorage.getItem('eduquest_user');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('eduquest_data', JSON.stringify({
        courses: appState.courses,
        quizzes: appState.quizzes,
        lessons: appState.lessons,
        achievements: appState.achievements,
        leaderboard: appState.leaderboard
    }));
    
    if (appState.currentUser) {
        localStorage.setItem('eduquest_user', JSON.stringify(appState.currentUser));
    }
}

// Update UI based on current state
function updateUI() {
    updateAuthUI();
    updateDashboard();
    renderCourses();
    renderCreateForms();
    renderLeaderboard();
}

// Authentication functions
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

function showAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').style.display = 'block';
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // For demo purposes, accept any login
    const user = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        role: role,
        xp: role === 'professor' ? 5000 : 0,
        coins: role === 'professor' ? 1000 : 100,
        level: role === 'professor' ? 15 : 1,
        streak: 1,
        enrolledCourses: [1],
        completedQuizzes: [],
        achievements: []
    };

    appState.currentUser = user;
    saveToLocalStorage();
    closeModal();
    updateAuthUI();
    showNotification(`Welcome ${user.name}!`, 'success');
    showView('dashboard');
}

function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const role = document.getElementById('registerRole').value;

    if (!name || !email || !password || !confirm) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Create new user
    const user = {
        id: Date.now(),
        email: email,
        name: name,
        role: role,
        xp: 0,
        coins: 100,
        level: 1,
        streak: 1,
        enrolledCourses: [],
        completedQuizzes: [],
        achievements: []
    };

    appState.currentUser = user;
    saveToLocalStorage();
    closeModal();
    updateAuthUI();
    showNotification('Account created successfully!', 'success');
    showView('dashboard');
}

function logout() {
    appState.currentUser = null;
    localStorage.removeItem('eduquest_user');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
    showView('home');
}

function updateAuthUI() {
    const authButton = document.getElementById('authButton');
    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');
    const xpFill = document.getElementById('xpFill');
    const professorLink = document.getElementById('professorLink');
    const dashboardLink = document.getElementById('dashboardLink');

    if (appState.currentUser) {
        authButton.textContent = 'Logout';
        userName.textContent = appState.currentUser.name;
        userLevel.textContent = `Level ${appState.currentUser.level}`;
        
        // Calculate XP percentage for level
        const xpForLevel = appState.currentUser.level * 1000;
        const xpInLevel = appState.currentUser.xp - ((appState.currentUser.level - 1) * 1000);
        const xpPercent = (xpInLevel / 1000) * 100;
        xpFill.style.width = `${xpPercent}%`;
        
        // Show/hide professor features
        if (appState.currentUser.role === 'professor') {
            professorLink.style.display = 'block';
        } else {
            professorLink.style.display = 'none';
        }
        
        dashboardLink.style.display = 'block';
    } else {
        authButton.textContent = 'Login';
        userName.textContent = 'Guest';
        userLevel.textContent = 'Level 1';
        xpFill.style.width = '0%';
        professorLink.style.display = 'none';
        dashboardLink.style.display = 'none';
    }
}

// View navigation
function showView(viewName) {
    if (!appState.currentUser && viewName !== 'home' && viewName !== 'courses') {
        openAuthModal();
        return;
    }

    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });

    // Show selected view
    document.getElementById(viewName + 'View').style.display = 'block';
    appState.currentView = viewName;

    // Update specific view
    switch(viewName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'courses':
            renderCourses();
            break;
        case 'leaderboard':
            renderLeaderboard();
            break;
    }
}

// Update dashboard data
function updateDashboard() {
    if (!appState.currentUser) return;

    // Update stats
    document.getElementById('totalXP').textContent = appState.currentUser.xp;
    document.getElementById('currentStreak').textContent = appState.currentUser.streak;
    document.getElementById('totalCoins').textContent = appState.currentUser.coins;

    // Render active courses
    const activeCoursesContainer = document.getElementById('activeCourses');
    const userCourses = appState.courses.filter(course => 
        appState.currentUser.enrolledCourses.includes(course.id)
    );

    activeCoursesContainer.innerHTML = userCourses.map(course => `
        <div class="course-item">
            <h4>${course.title}</h4>
            <p>${course.description}</p>
            <div class="course-actions">
                <button class="btn-secondary" onclick="viewCourse(${course.id})">View</button>
                <button class="btn-primary" onclick="continueCourse(${course.id})">Continue</button>
            </div>
        </div>
    `).join('');

    // Render recent activity
    const activityContainer = document.getElementById('recentActivity');
    activityContainer.innerHTML = `
        <div class="activity-item">
            <p><strong>Welcome back!</strong></p>
            <small>Just now</small>
        </div>
        <div class="activity-item">
            <p>Completed "HTML Basics Quiz" with 85%</p>
            <small>Yesterday</small>
        </div>
    `;

    // Render achievements
    const achievementsContainer = document.getElementById('achievementsList');
    achievementsContainer.innerHTML = appState.achievements.map(achievement => `
        <div class="achievement-item ${achievement.earned ? 'earned' : ''}">
            <i class="fas ${achievement.icon}"></i>
            <p>${achievement.name}</p>
        </div>
    `).join('');

    // Render available quizzes
    const quizzesContainer = document.getElementById('availableQuizzes');
    const availableQuizzes = appState.quizzes.filter(quiz => 
        !appState.currentUser.completedQuizzes.includes(quiz.id)
    );

    quizzesContainer.innerHTML = availableQuizzes.map(quiz => `
        <div class="quiz-item">
            <h4>${quiz.title}</h4>
            <p>${quiz.description}</p>
            <p><strong>Time:</strong> ${quiz.timeLimit} minutes</p>
            <button class="btn-primary" onclick="startQuiz(${quiz.id})">Start Quiz</button>
        </div>
    `).join('');
}

// Render courses
function renderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = appState.courses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <i class="fas fa-book"></i>
            </div>
            <div class="course-content">
                <div class="course-meta">
                    <span class="category">${course.category}</span>
                    <span class="level">${course.level}</span>
                </div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-user"></i> ${course.instructor}</span>
                    <span><i class="fas fa-users"></i> ${course.students} students</span>
                </div>
                <div class="course-actions">
                    ${appState.currentUser?.enrolledCourses?.includes(course.id) 
                        ? `<button class="btn-primary" onclick="viewCourse(${course.id})">Continue Learning</button>`
                        : `<button class="btn-primary" onclick="enrollInCourse(${course.id})">Enroll Now</button>`
                    }
                    <button class="btn-secondary" onclick="viewCourseDetails(${course.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCourses() {
    const category = document.getElementById('courseFilter').value;
    const search = document.getElementById('courseSearch').value.toLowerCase();

    const filtered = appState.courses.filter(course => {
        const matchesCategory = category === 'all' || course.category === category;
        const matchesSearch = course.title.toLowerCase().includes(search) || 
                            course.description.toLowerCase().includes(search);
        return matchesCategory && matchesSearch;
    });

    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = filtered.map(course => `
        <div class="course-card">
            <div class="course-image">
                <i class="fas fa-book"></i>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-actions">
                    <button class="btn-primary" onclick="enrollInCourse(${course.id})">Enroll Now</button>
                    <button class="btn-secondary" onclick="viewCourseDetails(${course.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function enrollInCourse(courseId) {
    if (!appState.currentUser) {
        openAuthModal();
        return;
    }

    if (!appState.currentUser.enrolledCourses.includes(courseId)) {
        appState.currentUser.enrolledCourses.push(courseId);
        saveToLocalStorage();
        updateUI();
        showNotification('Successfully enrolled in course!', 'success');
    } else {
        showNotification('Already enrolled in this course', 'warning');
    }
}

// Create content functions
function showCreateTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.create-tab').forEach(t => t.style.display = 'none');
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').style.display = 'block';
}

function renderCreateForms() {
    // Populate course dropdowns
    const courseSelects = document.querySelectorAll('select[id$="Course"]');
    courseSelects.forEach(select => {
        select.innerHTML = '<option value="">Select course</option>' +
            appState.courses.map(course => 
                `<option value="${course.id}">${course.title}</option>`
            ).join('');
    });
}

function createLesson() {
    const title = document.getElementById('lessonTitle').value;
    const courseId = parseInt(document.getElementById('lessonCourse').value);
    const type = document.getElementById('lessonType').value;
    const content = document.getElementById('lessonContent').value;
    const duration = parseInt(document.getElementById('lessonDuration').value);

    if (!title || !courseId || !content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const newLesson = {
        id: Date.now(),
        courseId: courseId,
        title: title,
        content: content,
        type: type,
        duration: duration,
        order: appState.lessons.filter(l => l.courseId === courseId).length + 1,
        createdAt: new Date().toISOString()
    };

    appState.lessons.push(newLesson);
    saveToLocalStorage();
    showNotification('Lesson created successfully!', 'success');
    clearCreateForm('lesson');
}

function createQuiz() {
    const title = document.getElementById('quizTitle').value;
    const courseId = parseInt(document.getElementById('quizCourse').value);
    const timeLimit = parseInt(document.getElementById('quizTimeLimit').value);
    const passingScore = parseInt(document.getElementById('quizPassingScore').value);

    if (!title || !courseId) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Collect questions
    const questionElements = document.querySelectorAll('.question-item');
    const questions = Array.from(questionElements).map((item, index) => {
        const questionText = item.querySelector('.question-text').value;
        const type = item.querySelector('.question-type').value;
        const options = Array.from(item.querySelectorAll('.option')).map(opt => opt.value);
        const correctAnswer = item.querySelector('.correct-answer').value;

        return {
            id: index + 1,
            type: type,
            question: questionText,
            options: type === 'short' ? [] : options,
            correctAnswer: type === 'short' ? item.querySelector('.correct-answer').value : correctAnswer,
            points: 10
        };
    });

    const newQuiz = {
        id: Date.now(),
        courseId: courseId,
        title: title,
        description: `Quiz for ${appState.courses.find(c => c.id === courseId)?.title}`,
        timeLimit: timeLimit,
        questions: questions,
        passingScore: passingScore,
        xpReward: questions.length * 25,
        coinReward: questions.length * 10
    };

    appState.quizzes.push(newQuiz);
    saveToLocalStorage();
    showNotification('Quiz created successfully!', 'success');
    clearCreateForm('quiz');
}

function addQuestion() {
    const questionsContainer = document.getElementById('quizQuestions');
    const questionCount = questionsContainer.children.length + 1;

    const questionHTML = `
        <div class="question-item">
            <div class="form-group">
                <label>Question ${questionCount}</label>
                <input type="text" class="question-text" placeholder="Enter question">
            </div>
            <div class="form-group">
                <label>Question Type</label>
                <select class="question-type" onchange="updateQuestionOptions(this)">
                    <option value="mcq">Multiple Choice</option>
                    <option value="truefalse">True/False</option>
                    <option value="short">Short Answer</option>
                </select>
            </div>
            <div class="question-options">
                <div class="form-group">
                    <label>Option A</label>
                    <input type="text" class="option" placeholder="Option A">
                </div>
                <div class="form-group">
                    <label>Option B</label>
                    <input type="text" class="option" placeholder="Option B">
                </div>
                <div class="form-group">
                    <label>Correct Answer</label>
                    <select class="correct-answer">
                        <option value="a">Option A</option>
                        <option value="b">Option B</option>
                    </select>
                </div>
            </div>
            <button class="btn-secondary" onclick="removeQuestion(this)" style="margin-top: 10px;">
                <i class="fas fa-trash"></i> Remove Question
            </button>
        </div>
    `;

    questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
}

function updateQuestionOptions(select) {
    const questionItem = select.closest('.question-item');
    const optionsContainer = questionItem.querySelector('.question-options');
    const type = select.value;

    if (type === 'short') {
        optionsContainer.innerHTML = `
            <div class="form-group">
                <label>Correct Answer</label>
                <input type="text" class="correct-answer" placeholder="Enter correct answer">
            </div>
        `;
    } else if (type === 'truefalse') {
        optionsContainer.innerHTML = `
            <div class="form-group">
                <label>Correct Answer</label>
                <select class="correct-answer">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
        `;
    } else {
        optionsContainer.innerHTML = `
            <div class="form-group">
                <label>Option A</label>
                <input type="text" class="option" placeholder="Option A">
            </div>
            <div class="form-group">
                <label>Option B</label>
                <input type="text" class="option" placeholder="Option B">
            </div>
            <div class="form-group">
                <label>Option C</label>
                <input type="text" class="option" placeholder="Option C">
            </div>
            <div class="form-group">
                <label>Option D</label>
                <input type="text" class="option" placeholder="Option D">
            </div>
            <div class="form-group">
                <label>Correct Answer</label>
                <select class="correct-answer">
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                </select>
            </div>
        `;
    }
}

function removeQuestion(button) {
    button.closest('.question-item').remove();
    // Renumber remaining questions
    const questions = document.querySelectorAll('.question-item');
    questions.forEach((item, index) => {
        item.querySelector('label').textContent = `Question ${index + 1}`;
    });
}

function createCourse() {
    const title = document.getElementById('courseTitle').value;
    const code = document.getElementById('courseCode').value;
    const category = document.getElementById('courseCategory').value;
    const description = document.getElementById('courseDescription').value;
    const difficulty = document.getElementById('courseDifficulty').value;

    if (!title || !code || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const newCourse = {
        id: Date.now(),
        title: title,
        code: code,
        category: category,
        description: description,
        instructor: appState.currentUser.name,
        level: difficulty,
        students: 0,
        duration: '8 weeks',
        createdAt: new Date().toISOString()
    };

    appState.courses.push(newCourse);
    saveToLocalStorage();
    showNotification('Course created successfully!', 'success');
    clearCreateForm('course');
    renderCourses();
}

function clearCreateForm(type) {
    const form = document.getElementById(type + 'Tab');
    form.querySelectorAll('input, textarea, select').forEach(element => {
        if (element.type !== 'button' && element.type !== 'submit') {
            element.value = '';
        }
    });
}

// Quiz functions
function startQuiz(quizId) {
    const quiz = appState.quizzes.find(q => q.id === quizId);
    if (!quiz) {
        showNotification('Quiz not found', 'error');
        return;
    }

    appState.currentQuiz = {
        ...quiz,
        startTime: Date.now(),
        currentQuestion: 0,
        answers: [],
        timeLeft: quiz.timeLimit * 60 // Convert to seconds
    };

    appState.quizAnswers = [];
    showView('quiz');
    renderQuizQuestion();
    startQuizTimer();
}

function renderQuizQuestion() {
    if (!appState.currentQuiz) return;

    const quiz = appState.currentQuiz;
    const question = quiz.questions[quiz.currentQuestion];
    const container = document.getElementById('quizQuestionsContainer');

    let optionsHTML = '';
    if (question.type === 'mcq') {
        optionsHTML = question.options.map((option, index) => `
            <div class="option ${appState.quizAnswers[quiz.currentQuestion] === index ? 'selected' : ''}" 
                 onclick="selectAnswer(${index})">
                ${String.fromCharCode(65 + index)}. ${option}
            </div>
        `).join('');
    } else if (question.type === 'truefalse') {
        optionsHTML = `
            <div class="option ${appState.quizAnswers[quiz.currentQuestion] === 0 ? 'selected' : ''}" 
                 onclick="selectAnswer(0)">True</div>
            <div class="option ${appState.quizAnswers[quiz.currentQuestion] === 1 ? 'selected' : ''}" 
                 onclick="selectAnswer(1)">False</div>
        `;
    } else if (question.type === 'short') {
        const currentAnswer = appState.quizAnswers[quiz.currentQuestion] || '';
        optionsHTML = `
            <div class="form-group">
                <input type="text" class="short-answer" value="${currentAnswer}" 
                       placeholder="Type your answer here..." oninput="updateShortAnswer(this.value)">
            </div>
        `;
    }

    container.innerHTML = `
        <div class="question-card">
            <h3 class="question-text">${question.question}</h3>
            <div class="options-grid">
                ${optionsHTML}
            </div>
        </div>
    `;

    // Update UI elements
    document.getElementById('quizName').textContent = quiz.title;
    document.getElementById('questionCounter').textContent = 
        `Question ${quiz.currentQuestion + 1}/${quiz.questions.length}`;
    
    // Render question navigation
    renderQuestionNavigation();
}

function renderQuestionNavigation() {
    const navContainer = document.getElementById('questionNav');
    const quiz = appState.currentQuiz;
    
    navContainer.innerHTML = quiz.questions.map((_, index) => `
        <button class="question-nav-btn ${index === quiz.currentQuestion ? 'active' : ''} 
                ${appState.quizAnswers[index] !== undefined ? 'answered' : ''}"
                onclick="goToQuestion(${index})">
            ${index + 1}
        </button>
    `).join('');
}

function selectAnswer(answerIndex) {
    if (!appState.currentQuiz) return;
    
    const currentQuestion = appState.currentQuiz.currentQuestion;
    appState.quizAnswers[currentQuestion] = answerIndex;
    
    // Update UI
    document.querySelectorAll('.option').forEach((opt, idx) => {
        opt.classList.toggle('selected', idx === answerIndex);
    });
    
    // Update navigation
    const navBtn = document.querySelector(`.question-nav-btn:nth-child(${currentQuestion + 1})`);
    if (navBtn) navBtn.classList.add('answered');
}

function updateShortAnswer(value) {
    if (!appState.currentQuiz) return;
    
    const currentQuestion = appState.currentQuiz.currentQuestion;
    appState.quizAnswers[currentQuestion] = value;
    
    // Update navigation
    const navBtn = document.querySelector(`.question-nav-btn:nth-child(${currentQuestion + 1})`);
    if (navBtn && value.trim()) navBtn.classList.add('answered');
}

function goToQuestion(index) {
    if (!appState.currentQuiz) return;
    
    appState.currentQuiz.currentQuestion = index;
    renderQuizQuestion();
}

function previousQuestion() {
    if (!appState.currentQuiz || appState.currentQuiz.currentQuestion === 0) return;
    
    appState.currentQuiz.currentQuestion--;
    renderQuizQuestion();
}

function nextQuestion() {
    if (!appState.currentQuiz) return;
    
    const quiz = appState.currentQuiz;
    if (quiz.currentQuestion < quiz.questions.length - 1) {
        quiz.currentQuestion++;
        renderQuizQuestion();
    } else {
        // If on last question, show submit button
        document.getElementById('submitBtn').style.display = 'block';
    }
}

function startQuizTimer() {
    if (!appState.currentQuiz) return;

    const timerElement = document.getElementById('quizTimer');
    let timeLeft = appState.currentQuiz.timeLeft;

    const timerInterval = setInterval(() => {
        if (!appState.currentQuiz) {
            clearInterval(timerInterval);
            return;
        }

        timeLeft--;
        appState.currentQuiz.timeLeft = timeLeft;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);

    appState.currentQuiz.timerInterval = timerInterval;
}

function usePowerup(type) {
    if (!appState.currentUser || !appState.currentQuiz) return;

    const cost = type === 'extraTime' ? 50 : 30;
    
    if (appState.currentUser.coins < cost) {
        showNotification(`Not enough coins! Need ${cost} coins.`, 'error');
        return;
    }

    appState.currentUser.coins -= cost;
    
    if (type === 'extraTime') {
        appState.currentQuiz.timeLeft += 60; // Add 1 minute
        showNotification('+1 minute added!', 'success');
    } else if (type === 'skip') {
        appState.quizAnswers[appState.currentQuiz.currentQuestion] = 'skipped';
        nextQuestion();
        showNotification('Question skipped!', 'success');
    }

    saveToLocalStorage();
    updateAuthUI();
}

function submitQuiz() {
    if (!appState.currentQuiz) return;

    // Clear timer
    if (appState.currentQuiz.timerInterval) {
        clearInterval(appState.currentQuiz.timerInterval);
    }

    // Calculate score
    const quiz = appState.currentQuiz;
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    const answersReview = quiz.questions.map((question, index) => {
        const userAnswer = appState.quizAnswers[index];
        let isCorrect = false;
        let correctAnswer = '';

        if (question.type === 'mcq' || question.type === 'truefalse') {
            isCorrect = userAnswer === question.correctAnswer;
            correctAnswer = question.options[question.correctAnswer];
        } else if (question.type === 'short') {
            isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
            correctAnswer = question.correctAnswer;
        }

        if (isCorrect) correctCount++;

        return {
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        };
    });

    // Calculate score
    const score = Math.round((correctCount / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - quiz.startTime) / 1000);

    // Calculate rewards
    const baseXP = quiz.xpReward || 100;
    const baseCoins = quiz.coinReward || 50;
    
    const scoreBonus = score >= 90 ? 1.5 : score >= 70 ? 1.2 : 1.0;
    const timeBonus = timeTaken < (quiz.timeLimit * 30) ? 1.2 : 1.0; // Finished in half time
    
    const xpEarned = Math.round(baseXP * scoreBonus * timeBonus);
    const coinsEarned = Math.round(baseCoins * scoreBonus * timeBonus);

    // Update user
    if (appState.currentUser) {
        appState.currentUser.xp += xpEarned;
        appState.currentUser.coins += coinsEarned;
        
        // Check level up
        const newLevel = Math.floor(appState.currentUser.xp / 1000) + 1;
        if (newLevel > appState.currentUser.level) {
            appState.currentUser.level = newLevel;
            showNotification(`🎉 Level Up! You're now level ${newLevel}!`, 'success');
        }

        // Add to completed quizzes
        if (!appState.currentUser.completedQuizzes.includes(quiz.id)) {
            appState.currentUser.completedQuizzes.push(quiz.id);
        }

        // Check achievements
        if (score === 100) {
            const perfectAchievement = appState.achievements.find(a => a.name === 'Perfect Score');
            if (perfectAchievement && !perfectAchievement.earned) {
                perfectAchievement.earned = true;
                showNotification('🏆 Achievement Unlocked: Perfect Score!', 'success');
            }
        }

        saveToLocalStorage();
        updateAuthUI();
    }

    // Show results
    appState.quizResults = {
        score: score,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        timeTaken: timeTaken,
        xpEarned: xpEarned,
        coinsEarned: coinsEarned,
        answersReview: answersReview,
        passed: score >= (quiz.passingScore || 70)
    };

    showQuizResults();
}

function showQuizResults() {
    const results = appState.quizResults;
    if (!results) return;

    // Update result elements
    document.getElementById('finalScore').textContent = `${results.score}%`;
    document.getElementById('correctCount').textContent = results.correctCount;
    document.getElementById('totalQuestions').textContent = results.totalQuestions;
    document.getElementById('timeTaken').textContent = formatTime(results.timeTaken);
    document.getElementById('xpEarned').textContent = results.xpEarned;
    document.getElementById('coinsEarned').textContent = results.coinsEarned;

    // Render answer review
    const answersContainer = document.getElementById('answersReview');
    answersContainer.innerHTML = results.answersReview.map((item, index) => `
        <div class="answer-review ${item.isCorrect ? 'correct' : 'incorrect'}">
            <h4>Question ${index + 1}</h4>
            <p><strong>Question:</strong> ${item.question}</p>
            <p><strong>Your Answer:</strong> ${formatAnswer(item.userAnswer)}</p>
            ${!item.isCorrect ? `<p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>` : ''}
            <p><strong>Status:</strong> ${item.isCorrect ? '✅ Correct' : '❌ Incorrect'}</p>
        </div>
    `).join('');

    showView('results');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatAnswer(answer) {
    if (answer === undefined || answer === null) return 'Not answered';
    if (answer === 'skipped') return 'Skipped';
    return answer;
}

function retakeQuiz() {
    if (appState.currentQuiz) {
        startQuiz(appState.currentQuiz.id);
    }
}

// Leaderboard functions
function renderLeaderboard() {
    const container = document.getElementById('leaderboardContent');
    if (!container) return;

    container.innerHTML = appState.leaderboard.map((user, index) => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">#${index + 1}</div>
            <div class="leaderboard-user">
                <div style="width: 40px; height: 40px; background: #4f46e5; border-radius: 50%; 
                     display: flex; align-items: center; justify-content: center; color: white;">
                    ${user.name.charAt(0)}
                </div>
                <div>
                    <h4>${user.name}</h4>
                    <p>Level ${user.level} • ${user.streak} day streak</p>
                </div>
            </div>
            <div class="leaderboard-score">${user.xp} XP</div>
        </div>
    `).join('');
}

function showLeaderboard(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // In a real app, you would filter leaderboard by type
    // For demo, we'll just show the same data
}

// Helper functions
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function demoTour() {
    showNotification('Welcome to EduQuest! Try creating a lesson or taking a quiz.', 'info');
    
    // Auto-login as professor for demo
    if (!appState.currentUser) {
        setTimeout(() => {
            const user = {
                id: Date.now(),
                email: 'professor@demo.com',
                name: 'Demo Professor',
                role: 'professor',
                xp: 5000,
                coins: 1000,
                level: 15,
                streak: 1,
                enrolledCourses: [1, 2],
                completedQuizzes: [],
                achievements: []
            };
            appState.currentUser = user;
            saveToLocalStorage();
            updateAuthUI();
            showNotification('Demo professor account activated! Try creating content.', 'success');
            showView('create');
        }, 1000);
    }
}

// Course view functions
function viewCourse(courseId) {
    const course = appState.courses.find(c => c.id === courseId);
    if (course) {
        showNotification(`Opening ${course.title}...`, 'info');
        // In a full implementation, this would show course lessons
    }
}

function continueCourse(courseId) {
    const course = appState.courses.find(c => c.id === courseId);
    if (course) {
        // Find first quiz for this course
        const quiz = appState.quizzes.find(q => q.courseId === courseId);
        if (quiz) {
            startQuiz(quiz.id);
        } else {
            showNotification('No quizzes available for this course yet.', 'warning');
        }
    }
}

function viewCourseDetails(courseId) {
    const course = appState.courses.find(c => c.id === courseId);
    if (course) {
        alert(`Course Details:\n\n${course.title}\n${course.description}\n\nInstructor: ${course.instructor}\nLevel: ${course.level}\nStudents: ${course.students}\nDuration: ${course.duration}`);
    }
}

// Initialize demo data on first load
if (!localStorage.getItem('eduquest_data')) {
    createDemoData();
}

const CONSTANT_DELAY = 6000; // 6 seconds fixed delay

// Application State
const state = {
    isLoggedIn: false,
    searchCriteria: {
        from: '',
        to: '',
        date: ''
    },
    selectedTrain: null,
    selectedSeatType: 'SL',
    passengerCount: 1, // Logic's baseline count
    buggyPassengerCount: 2, // UI shows count+1
    currentView: 'login'
};

// DOM Elements
const appContainer = document.getElementById('app-container');
const loaderOverlay = document.getElementById('loader-overlay');
const navLinks = document.getElementById('nav-links');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

// --- Utils ---

function showLoader(text = 'Synchronizing rail data...') {
    loaderOverlay.querySelector('.loading-text').textContent = text;
    loaderOverlay.style.display = 'flex';
}

function hideLoader() {
    loaderOverlay.style.display = 'none';
}

async function navigate(view, delay = CONSTANT_DELAY) {
    showLoader('Navigating to ' + view.replace('-', ' ') + '...');
    
    return new Promise(resolve => {
        setTimeout(() => {
            renderView(view);
            hideLoader();
            resolve();
        }, delay);
    });
}

function renderView(view) {
    state.currentView = view;
    const template = document.getElementById(`${view}-template`);
    if (!template) return;

    appContainer.innerHTML = '';
    const content = template.content.cloneNode(true);
    appContainer.appendChild(content);

    // Context-specific initialization
    if (view === 'login') initLogin();
    if (view === 'search') initSearch();
    if (view === 'results') initResults();
    if (view === 'passenger') initPassengers();
    if (view === 'preview') initPreview();

    // Update Nav
    updateNav();
}

function updateNav() {
    if (state.isLoggedIn) {
        userDisplay.style.display = 'inline';
        logoutBtn.style.display = 'inline';
    } else {
        userDisplay.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

// --- View Initializers ---

function initLogin() {
    const btn = document.getElementById('login-submit');
    
    btn.onclick = async () => {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Still require some input to feel "real", but any input works
        if (!user || !pass) {
            alert('Please enter both username and password.');
            return;
        }

        showLoader('Verifying credentials...');
        
        // Keep the performance delay as per requirements
        await new Promise(r => setTimeout(r, CONSTANT_DELAY));

        // Always succeed now
        state.isLoggedIn = true;
        hideLoader();
        navigate('search', 0);
    };
}

function initSearch() {
    const btn = document.getElementById('search-btn');
    const dateInput = document.getElementById('journey-date');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    btn.onclick = async () => {
        state.searchCriteria = {
            from: document.getElementById('source').value,
            to: document.getElementById('destination').value,
            date: dateInput.value
        };

        navigate('results');
    };
}

function initResults() {
    const container = document.getElementById('train-list-container');
    const noTrains = document.getElementById('no-trains-msg');
    const today = new Date().toISOString().split('T')[0];

    if (state.searchCriteria.date === today) {
        noTrains.style.display = 'block';
        container.innerHTML = '';
    } else {
        noTrains.style.display = 'none';
        const trains = [
            { 
                id: 1, 
                name: 'Rajdhani Express (12301)', 
                time: '16:30 - 08:20', 
                rates: { 'SL': 520, '3AC': 1450, '2AC': 2250 }
            },
            { 
                id: 2, 
                name: 'Shatabdi Special (12004)', 
                time: '06:15 - 12:45', 
                rates: { 'SL': 310, '3AC': 980, '2AC': 1650 }
            },
            { 
                id: 3, 
                name: 'Duronto Fast (12260)', 
                time: '20:00 - 10:30', 
                rates: { 'SL': 480, '3AC': 1290, '2AC': 1950 }
            }
        ];

        trains.forEach(t => {
            const el = document.createElement('div');
            el.className = 'train-card fade-in';
            el.style.flexDirection = 'column';
            el.style.alignItems = 'flex-start';
            
            el.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div class="train-info">
                        <h3>${t.name}</h3>
                        <div class="train-time">${t.time} | Daily</div>
                    </div>
                </div>
                <div class="seat-options" style="width: 100%;">
                    <div class="seat-chip active" data-type="SL">SL (₹${t.rates['SL']})</div>
                    <div class="seat-chip" data-type="3AC">3AC (₹${t.rates['3AC']})</div>
                    <div class="seat-chip" data-type="2AC">2AC (₹${t.rates['2AC']})</div>
                </div>
                <button class="btn btn-primary" style="margin-top: 15px; width: 100px; height: 35px; font-size: 0.8rem;">Select</button>
            `;

            let internalSeatType = 'SL';
            const chips = el.querySelectorAll('.seat-chip');
            chips.forEach(chip => {
                chip.onclick = (e) => {
                    e.stopPropagation();
                    chips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    internalSeatType = chip.getAttribute('data-type');
                };
            });

            const selectBtn = el.querySelector('.btn-primary');
            selectBtn.onclick = () => {
                state.selectedTrain = t;
                state.selectedSeatType = internalSeatType;
                navigate('passenger');
            };

            container.appendChild(el);
        });
    }

    document.getElementById('back-to-search').onclick = () => navigate('search');
}

function initPassengers() {
    document.getElementById('p-train-name').textContent = state.selectedTrain.name;
    document.getElementById('p-train-route').textContent = `${state.searchCriteria.from} → ${state.searchCriteria.to}`;
    document.getElementById('p-seat-type').textContent = state.selectedSeatType;

    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');
    const display = document.getElementById('counter-display');
    const inputs = document.getElementById('passenger-inputs');

    const updateDisplay = () => {
        // BUG: TRUE RANDOMNESS (Directly overriding deterministic rules)
        // Whenever the user interacts, jump to a completely random passenger count between 1-10
        state.buggyPassengerCount = Math.floor(Math.random() * 10) + 1;
        display.textContent = state.buggyPassengerCount;

        inputs.innerHTML = '';
        for (let i = 0; i < state.buggyPassengerCount; i++) {
            const div = document.createElement('div');
            div.className = 'form-group fade-in';
            div.innerHTML = `
                <label>Passenger ${i + 1} Name</label>
                <input type="text" class="form-control" placeholder="Enter full name">
            `;
            inputs.appendChild(div);
        }
    };

    minusBtn.onclick = () => {
        if (state.passengerCount > 1) {
            state.passengerCount--;
            updateDisplay();
        }
    };

    plusBtn.onclick = () => {
        if (state.passengerCount < 6) {
            state.passengerCount++;
            updateDisplay();
        }
    };

    updateDisplay();

    document.getElementById('preview-ticket-btn').onclick = () => navigate('preview');
    document.getElementById('cancel-passengers').onclick = () => navigate('results');
}

function initPreview() {
    document.getElementById('prev-train').textContent = state.selectedTrain.name;
    document.getElementById('prev-date').textContent = state.searchCriteria.date;
    document.getElementById('prev-count').textContent = state.buggyPassengerCount;

    // BUG: Calculation is always wrong
    const baseRate = state.selectedTrain.rates[state.selectedSeatType];
    const actualTotal = baseRate * state.buggyPassengerCount;
    // The "Error" is a deterministic surcharge of 12.37% + 50 INR safety fee
    const buggyTotal = (actualTotal * 1.1237) + 50;
    
    document.getElementById('prev-fare').textContent = `₹ ${buggyTotal.toFixed(2)}`;

    document.getElementById('back-to-passengers').onclick = () => navigate('passenger');
    document.getElementById('book-final-btn').onclick = () => {
        alert('Booking System Maintenance: Transaction failed due to checksum mismatch.');
    };
}

logoutBtn.onclick = () => {
    state.isLoggedIn = false;
    renderView('login');
};

// Initial Start
renderView('login');

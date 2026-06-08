import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyATSAzypkcI2RbDBJu-lMw_Mpz9L-brHyY",
    authDomain: "world-cup-predictor-ebfa6.firebaseapp.com",
    databaseURL: "https://world-cup-predictor-ebfa6-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "world-cup-predictor-ebfa6",
    storageBucket: "world-cup-predictor-ebfa6.firebasestorage.app",
    messagingSenderId: "714566845239",
    appId: "1:714566845239:web:621517d66049a250d4d0b2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const officialGroupMatches = [
    {a: "Mexico", b: "South Africa"}, {a: "South Korea", b: "Czechia"}, {a: "Canada", b: "Bosnia"}, {a: "USA", b: "Paraguay"},
    {a: "Qatar", b: "Switzerland"}, {a: "Brazil", b: "Morocco"}, {a: "Haiti", b: "Scotland"}, {a: "Australia", b: "Turkey"},
    {a: "Germany", b: "Curaçao"}, {a: "Netherlands", b: "Japan"}, {a: "Ivory Coast", b: "Ecuador"}, {a: "Sweden", b: "Tunisia"},
    {a: "Spain", b: "Colombia"}, {a: "Belgium", b: "Egypt"}, {a: "Saudi Arabia", b: "Uruguay"}, {a: "Iran", b: "New Zealand"},
    {a: "France", b: "Senegal"}, {a: "Iraq", b: "Norway"}, {a: "Argentina", b: "Algeria"}, {a: "Chile", b: "Sudan"},
    {a: "Portugal", b: "DR Congo"}, {a: "England", b: "Croatia"},
    {a: "Ghana", b: "Panama"}, {a: "Uzbekistan", b: "Colombia"}, {a: "Czechia", b: "South Africa"}, {a: "Switzerland", b: "Bosnia"},
    {a: "Canada", b: "Qatar"}, {a: "Mexico", b: "South Korea"}, {a: "USA", b: "Australia"}, {a: "Scotland", b: "Morocco"},
    {a: "Brazil", b: "Haiti"}, {a: "Turkey", b: "Paraguay"}, {a: "Curaçao", b: "Japan"}, {a: "Netherlands", b: "Germany"},
    {a: "Ecuador", b: "Tunisia"}, {a: "Spain", b: "Ivory Coast"}, {a: "Egypt", b: "Uruguay"}, {a: "Saudi Arabia", b: "Belgium"},
    {a: "New Zealand", b: "Norway"}, {a: "France", b: "Iran"}, {a: "Algeria", b: "Sudan"}, {a: "Argentina", b: "Chile"},
    {a: "DR Congo", b: "Croatia"}, {a: "Jordan", b: "Algeria"},
    {a: "Portugal", b: "Uzbekistan"}, {a: "England", b: "Ghana"}, {a: "Panama", b: "Croatia"}, {a: "Colombia", b: "DR Congo"},
    {a: "Switzerland", b: "Canada"}, {a: "Bosnia", b: "Qatar"}, {a: "Scotland", b: "Brazil"}, {a: "Morocco", b: "Haiti"},
    {a: "Czechia", b: "Mexico"}, {a: "South Africa", b: "South Korea"}, {a: "Turkey", b: "USA"}, {a: "Paraguay", b: "Australia"},
    {a: "Japan", b: "Sweden"}, {a: "Germany", b: "Ecuador"}, {a: "Tunisia", b: "Netherlands"}, {a: "Ivory Coast", b: "Spain"},
    {a: "Norway", b: "France"}, {a: "Iran", b: "Iraq"}, {a: "Sudan", b: "Argentina"}, {a: "Chile", b: "Egypt"},
    {a: "Croatia", b: "Saudi Arabia"}, {a: "Belgium", b: "New Zealand"},
    {a: "Panama", b: "England"}, {a: "Croatia", b: "Ghana"}, {a: "Colombia", b: "Portugal"}, {a: "DR Congo", b: "Uzbekistan"},
    {a: "Algeria", b: "Austria"}, {a: "Jordan", b: "Argentina"}
];

const officialKnockoutMatches = [
    {id: 73, a: "1B", b: "3 EFGID"}, {id: 74, a: "2D", b: "2G"}, {id: 75, a: "1J", b: "2H"}, {id: 76, a: "1K", b: "3 DEJL"},
    {id: 77, a: "W73", b: "W75"}, {id: 78, a: "W74", b: "W77"}, {id: 79, a: "2A", b: "2B"}, {id: 80, a: "1C", b: "2F"},
    {id: 81, a: "1E", b: "3 ABCDF"}, {id: 82, a: "1F", b: "2C"}, {id: 83, a: "2E", b: "2I"}, {id: 84, a: "1I", b: "3 CDFGH"},
    {id: 85, a: "1A", b: "3 CEFHI"}, {id: 86, a: "1L", b: "3 EHIJK"}, {id: 87, a: "1G", b: "3 AEHIJ"}, {id: 88, a: "1D", b: "3 BEFIJ"},
    {id: 89, a: "1H", b: "2J"}, {id: 90, a: "2K", b: "2L"},
    {id: 91, a: "W76", b: "W78"}, {id: 92, a: "W79", b: "W80"}, {id: 93, a: "W83", b: "W84"}, {id: 94, a: "W81", b: "W82"},
    {id: 95, a: "W86", b: "W88"}, {id: 96, a: "W85", b: "W87"}, {id: 97, a: "W89", b: "W90"}, {id: 98, a: "W93", b: "W94"},
    {id: 99, a: "W91", b: "W92"}, {id: 100, a: "W95", b: "W96"},
    {id: 101, a: "W97", b: "W98"}, {id: 102, a: "W99", b: "W100"},
    {id: 103, a: "RU101", b: "RU102", stage: "BRONZE FINAL"},
    {id: 104, a: "Finalist 1", b: "Finalist 2", stage: "GRAND FINAL 🏆"}
];

let simulatedAnswers = {};
for (let i = 1; i <= 104; i++) {
    simulatedAnswers[i] = { a: Math.floor(Math.random() * 3), b: Math.floor(Math.random() * 3) };
}

window.onload = function() {
    renderGroupStage();
    renderKnockouts();
    checkLoginState();
    listenToLeaderboard();
};

function renderGroupStage() {
    const container = document.getElementById('group-matches-container');
    if(container) {
        container.innerHTML = "";
        officialGroupMatches.forEach((match, index) => {
            container.appendChild(createCardHTML(index + 1, "Group Stage", match.a, match.b));
        });
    }
}

function renderKnockouts() {
    const container = document.getElementById('knockout-matches-container');
    if(container) {
        container.innerHTML = "";
        officialKnockoutMatches.forEach(match => {
            let stage = match.stage || `Knockout M${match.id}`;
            if(match.id >= 91 && match.id <= 97) stage = "Quarterfinals";
            if(match.id >= 98 && match.id <= 100) stage = "Semifinals";
            container.appendChild(createCardHTML(match.id, stage, match.a, match.b));
        });
    }
}

function createCardHTML(id, stage, teamA, teamB) {
    const div = document.createElement('div');
    div.className = 'match-card';
    div.innerHTML = `
        <div class="match-info"><span>M${id} - ${stage}</span></div>
        <div class="match-teams">
            <div class="team">${teamA}</div>
            <div class="versus">VS</div>
            <div class="team">${teamB}</div>
        </div>
        <div class="score-inputs">
            <input type="number" min="0" class="score-input" id="m-${id}-a" placeholder="0">
            <span>:</span>
            <input type="number" min="0" class="score-input" id="m-${id}-b" placeholder="0">
        </div>
    `;
    return div;
}

window.registerUser = function() {
    const name = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    const userId = email.replace(/[^a-zA-Z0-9]/g, "");
    const dbRef = ref(getDatabase());
    
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if(userData.password === password) {
                localStorage.setItem('activeUser', JSON.stringify({id: userId, name: userData.name, email: email, points: userData.points}));
                location.reload();
            } else {
                alert("Wrong password!");
            }
        } else {
            set(ref(db, 'users/' + userId), {
                name: name,
                password: password,
                points: 0
            }).then(() => {
                localStorage.setItem('activeUser', JSON.stringify({id: userId, name: name, email: email, points: 0}));
                location.reload();
            });
        }
    });
};

window.submitPredictions = function() {
    let points = 0;
    const user = JSON.parse(localStorage.getItem('activeUser'));
    if(!user) return alert("Please login first!");

    for (let i = 1; i <= 104; i++) {
        const inpA = document.getElementById(`m-${i}-a`).value;
        const inpB = document.getElementById(`m-${i}-b`).value;

        if(inpA !== "" && inpB !== "") {
            const pA = parseInt(inpA); const pB = parseInt(inpB);
            const rA = simulatedAnswers[i].a; const rB = simulatedAnswers[i].b;

            const userWinContext = pA > pB ? 'A' : (pA < pB ? 'B' : 'Draw');
            const realWinContext = rA > rB ? 'A' : (rA < rB ? 'B' : 'Draw');

            if(userWinContext === realWinContext) {
                points += (userWinContext === 'Draw') ? 1 : 3;
            }
        }
    }

    set(ref(db, `users/${user.id}/points`), points).then(() => {
        user.points = points;
        localStorage.setItem('activeUser', JSON.stringify(user));
        document.getElementById('prof-points').innerText = `${points} Points`;
        alert(`Predictions Updated! You scored ${points} points.`);
    });
};

function listenToLeaderboard() {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        let usersArray = [];
        Object.keys(data).forEach(key => {
            usersArray.push({ name: data[key].name, points: data[key].points });
        });
        usersArray.sort((a, b) => b.points - a.points);

        const tbody = document.getElementById('leaderboard-body');
        if(tbody) {
            tbody.innerHTML = "";
            usersArray.forEach((player, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${player.name}</td>
                    <td class="gold-text fw-bold">${player.points} Pts</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    });
}

function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('activeUser'));
    if(user) {
        const authForm = document.getElementById('auth-form');
        const userProfile = document.getElementById('user-profile');
        if(authForm) authForm.style.display = 'none';
        if(userProfile) {
            userProfile.style.display = 'block';
            document.getElementById('prof-name').innerText = user.name;
            document.getElementById('prof-email').innerText = user.email;
            document.getElementById('prof-points').innerText = `${user.points || 0} Points`;
        }
        document.querySelectorAll('.id-locked').forEach(el => el.classList.remove('id-locked'));
    }
}

window.logout = function() { localStorage.removeItem('activeUser'); location.reload(); };
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active-content');
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
};

const css = require('./scss/style.scss');
// Chart.js
import Chart from 'chart.js';
import {get} from 'https';
const ctx = document.getElementById('myChart').getContext("2d");
let data;
let options;

// Feature test
// Feature detect + local reference
let storage;
let fail;
let uid;
try {
	uid = new Date;
	(storage = window.localStorage).setItem(uid, uid);
	fail = storage.getItem(uid) != uid;
	storage.removeItem(uid);
	fail && (storage = false);
} catch (exception) {}

// Get infromation from HTML file
const local = window.localStorage;
const income = document.getElementById('income');
const food = document.getElementById('food');
const transport = document.getElementById('transport');
const utilities = document.getElementById('utilities');
const personal = document.getElementById('personal');
const form = document.getElementById('form');
const icon = document.getElementById('icon');
const category = document.getElementById('category');
const spentCat = document.getElementById('sum');
let arr = JSON.parse(local.getItem('stats')) || [];
let personalVal = JSON.parse(local.getItem('personal')) || "";
let foodVal = JSON.parse(local.getItem('food')) || "";
let transportVal = JSON.parse(local.getItem('transport')) || "";
let utilitiesVal = JSON.parse(local.getItem('utilities')) || "";
let wage = local.getItem('wage') || "";
let balance = local.getItem('balance') || '';
let savings;
let expenses;
let totalSpent;
let updatedStats = [];
// Months object
let months = {
    jan: [],
    feb: [],
    mar: [],
    apr: [],
    may: [],
    jun: [],
    jul: [],
    aug: [],
    sep: [],
    oct: [],
    nov: [],
    dec: []
};

// Check if localStorage is empty
function checkStorage() {
    if (localStorage.getItem('months') === null) {
        console.log('Please add data to get statistics');
    } else {
        const hiddenElements = document.querySelectorAll('#chart-container, #edit, #details');
        document.getElementById('create-stats').style.display = 'none';
        hiddenElements.forEach(function(element) {
            element.style.visibility = 'visible';
            element.style.opacity = 1;
        });
    }
}

// Add months to localStorage
// STUCK HERE
function addStats(month) {
    const monthList = local.setItem('months', JSON.stringify(months));
    const parsed = JSON.parse(local.getItem('months'));
    console.log(parsed);
}

// Toggle modal
function open() {
    document.getElementById('modal').classList.toggle('open');
}
function close() {
    document.getElementById('modal').classList.remove('open');
}
document.getElementById('new').addEventListener('click', open);
document.getElementById('edit').addEventListener('click', open);
document.getElementById('close').addEventListener('click', close);

// Calculate balance and total spent
function getBalance(arr) {
    totalSpent = arr.reduce((a,b) => (a + Number(b)), 0);
    balance = wage - totalSpent;
    local.setItem('balance', JSON.stringify(balance));
}

// Create gradients
let gradientViolet = ctx.createLinearGradient(200, 0, 0, 0);
gradientViolet.addColorStop(0, "#FF2366");
gradientViolet.addColorStop(1, "#8D4DE8");

let gradientBlue = ctx.createLinearGradient(0, 200, 0, 0);
gradientBlue.addColorStop(0, "#6956EC");
gradientBlue.addColorStop(1, "#56B2BA");

let gradientYellow = ctx.createLinearGradient(0, 0, 200, 0);
gradientYellow.addColorStop(0, "#FD3F2F");
gradientYellow.addColorStop(1, "#FACE15");

// Chart data
data = {
    labels: ['Personal', 'House and utilities', 'Transport', 'Food and restaurants'],
    datasets: [{
        data: [personalVal, foodVal, transportVal, utilitiesVal],
        backgroundColor: ['#0e0f1a', gradientViolet, gradientBlue, gradientYellow],
        borderColor: ['#0e0f1a', gradientViolet, gradientBlue, gradientYellow],
    }]
};

// Chart options
options = {
    events: [],
    cutoutPercentage: 70,
    legend: {
        display: false
    },
    elements: {
        arc: {
            borderWidth: 0
        },
        center: {
            text: 'Desktop',
            color: '#FFF',
            fontStyle: 'Consolas',
            sidePadding: 15
        }
    },
    animation: {
        animateScale: true
    },
    rotation: (-0.5 * Math.PI) - (120/180 * Math.PI)
};

// Display spent amount and category
function updateInfo() {
    icon.src = './src/images/icons/utensils.png';
    category.innerHTML = myChart.data.labels[0];
    spentCat.innerHTML = `$${personalVal}`;
}

// Push data to localStorage stats property
function pushStats() {
    if (storage) {
        local.setItem('personal', JSON.stringify(personal.value));
        local.setItem('food', JSON.stringify(food.value));
        local.setItem('transport', JSON.stringify(transport.value));
        local.setItem('utilisties', JSON.stringify(utilities.value));

        personalVal = JSON.parse(local.getItem('personal'));
        foodVal = JSON.parse(local.getItem('food'));
        transportVal = JSON.parse(local.getItem('transport'));
        utilitiesVal = JSON.parse(local.getItem('utilisties'));
        updatedStats = [personalVal, foodVal, transportVal, utilitiesVal];
        myChart.data.datasets[0].data = updatedStats;
        // Change icon and label
        displayInfo(myChart.data.labels[0], personalVal); 
    }
    window.myChart.update();
}

// Run create chart function
window.onload = () => {
    ctx;
    window.myChart = getNewChart(ctx, data);
    displayInfo(myChart.data.labels[0], personalVal);
    checkStorage();
};

// Create chart function
function getNewChart(ctx, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// Switch between months
const monthTab = document.getElementsByClassName('month');
// Add/remove .current class from month list
for (let i = 0; i < monthTab.length; i++) {
    monthTab[0].classList.add('current');
    monthTab[i].addEventListener('click', function(event) {
        document.querySelector('.current').classList.remove('current');
        monthTab[i].classList.add('current');

        // Function to change stats according to clicked month element
        // TO DO
    })
};

// Push values to local
function storeLocally(e) {
    e.preventDefault();
    // Monthly salary
    wage = income.value;
    local.setItem('wage', wage);
    // Add stats
    pushStats();
    // Balance left
    getBalance(updatedStats);
    // Add stats
    addStats();
    // Update balance
    displayValues();
    // Close modal on success
    close();
    // Draw chart
    window.myChart.update();
    // Check storage
    checkStorage()

    this.reset();
};

// Display values inside HTML elements
function displayValues() {
    const balanceLeft = document.getElementById('balance-left');
    const centsLeft = document.getElementById('cents-left');
    const balanceVal = local.getItem('balance') || "";
    // Get portion of value before and after floating point
    // Save them in 2 different HTML elements
    if (parseInt(balanceVal) == balanceVal) {
        balanceLeft.innerHTML = `$${balanceVal.split(".")[0]}`;
        centsLeft.innerHTML = '';
    } else {
        balanceLeft.innerHTML = `$${balanceVal.split(".")[0]}`;
        centsLeft.innerHTML = Math.round(balanceVal.split(".")[1]);
    }
    // If balance is less than zero stop counting
    if (balanceVal <= 0) {
        balanceLeft.innerHTML = '$0';
        centsLeft.innerHTML = '00';
    }
};
displayValues();

// Click events for chart
document.getElementById("myChart").addEventListener('click', e => {
    const activePoints = myChart.getElementsAtEvent(e);
    const firstPoint = activePoints[0];
    const label = myChart.data.labels[firstPoint._index];
    const value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];

    displayInfo(label, value)
})

// Display label info  
function displayInfo(label, value) {
    switch (label) {
        case 'Personal': 
        icon.src = './src/images/icons/person.png';
            break;
        case 'House and utilities':
        icon.src = './src/images/icons/home.png';
            break;
        case 'Transport': 
        icon.src = './src/images/icons/car.png';
            break;
        case 'Food and restaurants':
        icon.src = './src/images/icons/utensils.png';
            break;  
        default: icon.src = './src/images/icons/person.png';
            break;
    }
    category.innerHTML = label;
    spentCat.innerHTML = `$${value}`;
}

// Submit form
form.addEventListener('submit', storeLocally);
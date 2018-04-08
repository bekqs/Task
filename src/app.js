const css = require('./scss/style.scss');
// Chart.js
import Chart from 'chart.js';
import {get} from 'https';
const ctx = document.getElementById('myChart').getContext("2d");
let data;
let options;

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
const monthTab = document.querySelectorAll('.month');
const income = document.getElementById('income');
const food = document.getElementById('food');
const transport = document.getElementById('transport');
const utilities = document.getElementById('utilities');
const personal = document.getElementById('personal');
const form = document.getElementById('form');
const icon = document.getElementById('icon');
const category = document.getElementById('category');
const spentCat = document.getElementById('sum');
const hide = document.querySelectorAll('#chart-container, #edit, #details');
let arr = JSON.parse(local.getItem('stats')) || [];
let personalVal = JSON.parse(local.getItem('personal')) || '';
let foodVal = JSON.parse(local.getItem('food')) || '';
let transportVal = JSON.parse(local.getItem('transport')) || '';
let utilitiesVal = JSON.parse(local.getItem('utilities')) || '';
let wage = local.getItem('wage') || '';
let balance = local.getItem('balance') || '';
let savings;
let expenses;
let totalSpent;
let updatedStats = [];
// Months object
const selectMonth = document.getElementById('select-month');
let months = JSON.parse(local.getItem('months')) || {
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
        document.getElementById('create-stats').style.display = 'none';
        hide.forEach(element => {
            element.style.visibility = 'visible';
            element.style.opacity = 1;
        });
    }
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
        option(selectMonth);
        local.setItem('months', JSON.stringify(months));

        // reset icon and label
        displayInfo(myChart.data.labels[0], personalVal); 
    }
    window.myChart.update();
}

// Pushes updatedStats array into months object
function option(sel) {
    const selected = sel.options[sel.selectedIndex].value;
    const monthsData = JSON.parse(local.getItem('months'));

    updatedStats = updatedStats.map(Number);
    months[selected] = updatedStats;
    document.querySelector('.current').classList.remove('current');
    document.getElementById(selected).classList.add('current');
}

// Switch between months
function currentMonth() {
    monthTab.forEach(element => {
        element.addEventListener('click', target => {
            document.querySelector('.current').classList.remove('current');
            element.classList.add('current');
            
            updatedStats = months[event.target.id];
            myChart.data.datasets[0].data = updatedStats;
            spentCat.innerHTML = `$${updatedStats[0]}`;          
            // Calculate balance and total amount spent
            displayValues(updatedStats);
            window.myChart.update();
            // If the current month has no data hide chart elements
            if (months[event.target.id].length === 0) {
                document.getElementById('create-stats').style.display = 'block';
                hide.forEach(element => {
                    element.style.visibility = 'hidden';
                    element.style.opacity = 0;
                });
            } else {
                hide.forEach(element => {
                    document.getElementById('create-stats').style.display = 'none';
                    element.style.visibility = 'visible';
                    element.style.opacity = 1;
                });
            }
        })
    });
}

// Get balance
function getBalance(arr) {
    totalSpent = arr.reduce((a,b) => (a + Number(b)), 0);
    balance = wage - totalSpent;
    balance = local.setItem('balance', JSON.stringify(balance));
}

// Push values to local
function storeLocally(e) {
    e.preventDefault();
    // Monthly salary
    wage = income.value;
    local.setItem('wage', wage);
    // Add stats
    pushStats();
    // Close modal after adding data
    close();
    // Current month
    currentMonth();
    //
    displayValues(updatedStats);
    // Check storage
    checkStorage()

    this.reset();
};

// Display values inside HTML elements
function displayValues(arr) {
    getBalance(arr);
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
        centsLeft.innerHTML = parseFloat(balanceVal.split(".")[1]).toFixed(0);
    }
};

// Click events for chart
document.getElementById("myChart").addEventListener('click', e => {
    const activePoints = myChart.getElementsAtEvent(e);
    const firstPoint = activePoints[0];
    const label = myChart.data.labels[firstPoint._index];
    const value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    displayInfo(label, value);
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

// Create chart function
function getNewChart(ctx, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// Run create chart function
window.onload = () => {
    ctx;
    window.myChart = getNewChart(ctx, data);
    monthTab[0].classList.add('current');
    displayInfo(myChart.data.labels[0], personalVal);
    checkStorage();
    currentMonth();
    displayValues(updatedStats);
};
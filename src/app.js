const css = require('./scss/style.scss')

////////////
window.randomScalingFactor = function() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}

// Get infromation from HTML file
const local = window.localStorage;
const income = document.getElementById('income');
const food = document.getElementById('food');
const transport = document.getElementById('transport');
const utilities = document.getElementById('utilities');
const personal = document.getElementById('personal');
const form = document.getElementById('form');

let arr = JSON.parse(local.getItem('stats')) || [];
let wage = local.getItem('wage') || randomScalingFactor();
let balance = local.getItem('balance') || '';
let savings;
let expenses;
let totalSpent;
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

// Add months to localStorage
function addStats(month) {
    const monthList = local.setItem('months', JSON.stringify(months));
    const parsed = JSON.parse(local.getItem('months'));
    console.log(parsed);

    
}

// Switch between months
const monthTab = document.getElementsByClassName('month');
// Add/remove .current class from month list
for (let i = 0; i < monthTab.length; i++) {
    monthTab[i].addEventListener('click', function(event) {
        document.querySelector('.current').classList.remove('current');
        monthTab[i].classList.add('current');

        addStats(event.target.id);
        console.log(event.target.id);
    })
};

// Toggle modal
function toggle() {
    document.getElementById('modal').classList.toggle('open');
    document.getElementById('edit').classList.toggle('close');
}
document.getElementById('edit').addEventListener('click', toggle);

// Calculations
function getBalance(arr) {
    totalSpent = arr.reduce((a,b) => (a + Number(b)), 0);
    balance = wage - totalSpent;
    local.setItem('balance', JSON.stringify(balance));
    console.log(totalSpent)
}

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

// Push values to local
function storeLocally(e) {
    e.preventDefault();
    arr = Array.prototype.slice.call(arr);
    arr.splice(0, 4, food.value, transport.value, utilities.value, personal.value);
    local.setItem('stats', JSON.stringify(arr));
    // Monthly salary
    wage = income.value;
    local.setItem('wage', wage);
    console.log(local.getItem('wage'));
    // Balance left
    getBalance(arr);
    // Add stats
    addStats();
    // Update balance
    displayValues();
    // Close modal on success
    toggle();
    this.reset();
};

// Submit form
form.addEventListener('submit', storeLocally);

// Chart.js
import Chart from 'chart.js';
import {get} from 'https';
const ctx = document.getElementById('myChart').getContext("2d");

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

arr = JSON.parse(local.getItem("balance"));

// Chart data
let data = {
    labels: ['Empty', 'House and utilities', 'Transport', 'Food and restaurants'],
    datasets: [{
        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
        backgroundColor: ['#0e0f1a', gradientViolet, gradientBlue, gradientYellow],
        borderColor: ['#0e0f1a', gradientViolet, gradientBlue, gradientYellow],
    }]
};

// Chart options
let options = {
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

// Click events for chart
document.getElementById("myChart").addEventListener('click', e => {
    const activePoints = myChart.getElementsAtEvent(e);
    const firstPoint = activePoints[0];
    const label = myChart.data.labels[firstPoint._index];
    const value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    console.log(label + ": " + value);
})

// Randomize data and create chart
// document.getElementById('random').addEventListener('click', e => {
//     myChart.data.datasets.forEach(function(dataset) {
//         dataset.data = dataset.data.map(function() {
//             return randomScalingFactor();
//         });
//     });
//     window.myChart.update();
// });

// Run create chart function
window.onload = function() {
    ctx;
    window.myChart = getNewChart(ctx, data);
};

// Create chart function
function getNewChart(ctx, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}
      
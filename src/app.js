const css = require('./scss/style.scss');
// localStorage detection
const storage = !!function(v,l){try{return (l=localStorage).setItem(v,v)|!l.removeItem(v)}catch(e){}}('_');
// Chart.js
import Chart from 'chart.js';
import {get} from 'https';
const ctx = document.getElementById('myChart').getContext("2d");
let data;
let options;

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
const selectMonth = document.getElementById('select-month');
const hide = document.querySelectorAll('#chart-container, #edit, #details');
const toggleModal = document.querySelectorAll('#new, #edit, #close, #submit');
const createBtn = document.getElementById('create-stats');
let arr = [];
let salary;
let spentArr = [];
let balance;
// Months object
let myData = JSON.parse(local.getItem('months'));
let months = myData || {
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
    dec: [],    
};
// Show/hide chart elements
function showHide() {
    if (createBtn.style.display === 'block') {
        hide.forEach(element => {
            element.style.visibility = 'hidden';
            element.style.opacity = 0;
        });
    } else {
        hide.forEach(element => {
            element.style.visibility = 'visible';
            element.style.opacity = 1;
        });
    }
}
// Adds data to selected month
function option(sel) {
    const selected = sel.options[sel.selectedIndex].value;
    salary = income.value;
    arr = [personal.value, food.value, transport.value, utilities.value];
    spentArr = arr.map(Number);
    balance = salary - spentArr.reduce((a, b) => a + b);
    months[selected] = {
        salary: salary,
        spent: spentArr,
        balance: balance
    };
    myChart.data.datasets[0].data = spentArr;
    // Add .current class to the selected month
    document.querySelector('.current').classList.remove('current');
    document.getElementById(selected).classList.add('current');
    displayInfo(myChart.data.labels[0], spentArr[0]);
    updateBalance(selected);
    createBtn.style.display = 'none';
    showHide();
    window.myChart.update();
} 
// Push data to localStorage
function pushStats(e) {
    e.preventDefault();
    if (storage) {
        option(selectMonth);
        local.setItem('months', JSON.stringify(months));
        this.reset();
    }
}
// Display values inside HTML elements
function updateBalance(month) {
    const balanceLeft = document.getElementById('balance-left');
    const centsLeft = document.getElementById('cents-left');
    const storedData = JSON.parse(local.getItem('months'));    
    const balanceValue = months[month].balance.toString();
    // Get portion of value before and after floating point
    // Save them in 2 separate HTML elements
    if (parseInt(balanceValue) == balanceValue) {
        balanceLeft.innerHTML = `$${balanceValue.split(".")[0]}`;
        centsLeft.innerHTML = '00';
    } else {
        balanceLeft.innerHTML = `$${balanceValue.split(".")[0]}`;
        centsLeft.innerHTML = (balanceValue % 1).toFixed(2).substring(2);
    }
}
// Switch between months
function currentMonth() {
    monthTab.forEach(element => {
        element.addEventListener('click', function(event) {
            document.querySelector('.current').classList.remove('current');
            element.classList.add('current');
            // If the current month has no data hide chart elements
            if (months[this.id].length <= 0) {
                document.getElementById('create-stats').style.display = 'block';
                showHide();
            } else {
                document.getElementById('create-stats').style.display = 'none';
                showHide();
                // Update data when clicking on another month
                spentArr = months[event.target.id].spent;
                myChart.data.datasets[0].data = spentArr;
                spentCat.innerHTML = `$${months[this.id].spent[0]}`; 
                updateBalance(this.id);
                displayInfo(myChart.data.labels[0], spentArr[0]); 
                window.myChart.update();
            }
        })
    });
}
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
        data: [],
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
    rotation: (-0.5 * Math.PI) - (120/180 * Math.PI)
};
// Click events for chart
document.getElementById("myChart").addEventListener('click', e => {
    const activePoints = myChart.getElementsAtEvent(e);
    const firstPoint = activePoints[0];
    const label = myChart.data.labels[firstPoint._index];
    const value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    displayInfo(label, value);
});
// Create chart function
function getNewChart(ctx, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}
// Create chart function on window load
window.onload = () => {
    ctx;
    window.myChart = getNewChart(ctx, data);
    monthTab[0].classList.add('current');
    currentMonth();
    local.setItem('months', JSON.stringify(months));
    if (myData.jan.length <= 0) {
        document.getElementById('create-stats').style.display = 'block';
        showHide();
    } else {
        document.getElementById('create-stats').style.display = 'none';
        showHide();
        myChart.data.datasets[0].data = myData.jan.spent;
        displayInfo(myChart.data.labels[0], myData.jan.spent[0]);
        updateBalance('jan');
        window.myChart.update();
    }
};
// Open/close modal
toggleModal.forEach(el => {
    el.addEventListener('click', () => {
        document.getElementById('modal').classList.toggle('open');
    });
});
// Save data to local storage on form submit
form.addEventListener('submit', pushStats);
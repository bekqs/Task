const css = require('./scss/style.scss');
// localStorage detection
const storage = !!function(v,l){try{return (l=localStorage).setItem(v,v)|!l.removeItem(v)}catch(e){}}('_');
// Chart.js
import Chart from 'chart.js';
import {get} from 'https';
import {data, options} from './modules/chartSettings';
const ctx = document.getElementById('myChart').getContext('2d');
// Import AppData
import AppData from './modules/AppData';
import updateBalance from './modules/updateBalance';
import updateLabel from './modules/updateLabel';

const local = window.localStorage;
const monthTab = document.querySelectorAll('.month');
const income = document.getElementById('income');
const food = document.getElementById('food');
const transport = document.getElementById('transport');
const utilities = document.getElementById('utilities');
const personal = document.getElementById('personal');
const form = document.getElementById('form');
const icon = document.getElementById('icon');
const selectMonth = document.getElementById('select-month');
const hide = document.querySelectorAll('#chart-container, #edit, #details');
const toggleModal = document.querySelectorAll('#new, #edit, #close, #submit');
const createBtn = document.getElementById('create-stats');
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

// Push data to localStorage
function pushStats(e) {
    e.preventDefault();
    if (storage) {
        const spentArray = [personal.value, utilities.value, transport.value, food.value];
        const stats = new AppData(income.value, spentArray);
        stats.option(months, selectMonth);
        local.setItem('months', JSON.stringify(months));

        // Update chart data
        myChart.data.datasets[0].data = stats.spent;
        updateLabel(myChart.data.labels[0], stats.spent[0]);
        createBtn.style.display = 'none';
        showHide();
        window.myChart.update();
        // Clear form inputs
        this.reset();
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
                createBtn.style.display = 'block';
                showHide();
            } else {
                createBtn.style.display = 'none';
                showHide();
                // Update data when clicked on another month
                const currentArray = months[event.target.id].spent;
                myChart.data.datasets[0].data = currentArray;
                updateBalance(months, this.id);
                updateLabel(myChart.data.labels[0], currentArray[0]); 
                window.myChart.update();
            }
        })
    });
}

// Click events for chart
document.getElementById('myChart').addEventListener('click', e => {
    const activePoints = myChart.getElementsAtEvent(e);
    const firstPoint = activePoints[0];
    const label = myChart.data.labels[firstPoint._index];
    const value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    updateLabel(label, value);
});

// Create chart function
function getNewChart(ctx, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// Create chart on window load
window.onload = () => {
    ctx;
    window.myChart = getNewChart(ctx, data);
    local.setItem('months', JSON.stringify(months));

    monthTab[0].classList.add('current');
    currentMonth();
    
    if (months.jan.length <= 0) {
        createBtn.style.display = 'block';
        showHide();
    } else {
        createBtn.style.display = 'none';
        showHide();
        myChart.data.datasets[0].data = months.jan.spent;
        updateLabel(myChart.data.labels[0], months.jan.spent[0]);
        updateBalance(months, 'jan');
        window.myChart.update();
    }
};

// Toggle modal
toggleModal.forEach(el => {
    el.addEventListener('click', () => {
        document.getElementById('modal').classList.toggle('open');
    });
});

// Save data to local storage on form submit
form.addEventListener('submit', pushStats);
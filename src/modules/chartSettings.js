const ctx = document.getElementById('myChart').getContext("2d");

// Create gradients
let gradientViolet = ctx.createLinearGradient(200, 0, 0, 0);
gradientViolet.addColorStop(0, '#FF2366');
gradientViolet.addColorStop(1, '#8D4DE8');

let gradientBlue = ctx.createLinearGradient(0, 200, 0, 0);
gradientBlue.addColorStop(0, '#6956EC');
gradientBlue.addColorStop(1, '#56B2BA');

let gradientYellow = ctx.createLinearGradient(0, 0, 200, 0);
gradientYellow.addColorStop(0, '#FD3F2F');
gradientYellow.addColorStop(1, '#FACE15');

// Chart data
export let data = {
    labels: ['Personal', 'House and utilities', 'Transport', 'Food and restaurants'],
    datasets: [{
        data: [],
        backgroundColor: ['#0e0f1a', gradientViolet, gradientBlue, gradientYellow],
        borderColor: ['#0e0f1a', gradientViolet, gradientBlue, gradientYellow],
    }]
};

// Chart options
export let options = {
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
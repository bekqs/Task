// Display values inside HTML elements
export default function updateBalance(obj, month) {
    const balanceLeft = document.getElementById('balance-left');
    const centsLeft = document.getElementById('cents-left');
    const balanceValue = obj[month].balance.toString();
    // Get portion of value before and after floating point
    // Save them in 2 separate HTML elements
    if (parseInt(balanceValue) == balanceValue) {
        balanceLeft.innerHTML = `$${balanceValue.split('.')[0]}`;
        centsLeft.innerHTML = '00';
    } else {
        balanceLeft.innerHTML = `$${balanceValue.split('.')[0]}`;
        centsLeft.innerHTML = (balanceValue % 1).toFixed(2).substring(2);
    }
}
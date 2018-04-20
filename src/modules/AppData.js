import updateBalance from './updateBalance';

export default class AppData {
    constructor(salary, spent) {
        this._salary = salary;
        this._spent = spent;
    }
    
    // Get parameters
    get salary() {
        return this._salary;
    }
    get spent() {
        return this._spent;
    }

    // Set parameters
    set salary(value) {
        this._salary = value;
    }
    set spent(array) {
        this._spent = array;
    }

    // Calculate balance
    balance() {
        return this.salary - this.spent.map(Number).reduce((a, b) => a + b);
    }

    // Add data to selected month
    option(obj, sel) {
        const selected = sel.options[sel.selectedIndex].value;
        const selectedMonth = document.getElementById(selected);
    
        obj[selected] = {
            salary: this._salary,
            spent: this._spent,
            balance: this.balance()
        };

        // Add .current class to the selected month
        document.querySelector('.current').classList.remove('current');
        selectedMonth.classList.add('current');

        // Scroll months container horizontally, so the current month can be seen
        document.getElementById('month-list').scrollLeft = selectedMonth.offsetLeft - 8;

        // Update balance in innerHTML
        updateBalance(obj, selected);
    }
    
}
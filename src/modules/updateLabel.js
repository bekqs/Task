const category = document.getElementById('category');
const spentCat = document.getElementById('sum');

// Update label info
export default function updateLabel(label, value) {
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
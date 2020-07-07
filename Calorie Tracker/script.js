const genderRadio = document.getElementById('gender');
const heightInp = document.getElementById('height')
const inchInp = document.getElementById('inches')
const weightInp =document.getElementById('weight')
const ageInp = document.getElementById('age')
const activitySelect = document.getElementById('selectActivity')
const calculateBtn = document.getElementById('submit-btn');
const heightSelect = document.getElementById('selectHeight');
const inchEl = document.querySelector('.inch')
const weightSelect = document.getElementById('selectWeight');
const resultEl = document.getElementById('result');
const foodInp = document.getElementById('foodInp');
const calorieInp = document.getElementById('calInp');
const addBtn = document.getElementById('add-btn');
const listItemsEl = document.getElementById('list-items');
const takenCalEl = document.getElementById('takenCal');
const remainCalEl = document.getElementById('remainCal');
const extraCalEl = document.getElementById('extra');
const canvas = document.querySelector('canvas')

// chart
let ctx = document.getElementById('chart').getContext('2d');

let gender;
let calorieNeed;
let BMR;
let activityVal = 1;
let totalCalIntake;
let remainCal;
let listItems = [];


function generateId(){
    return Math.floor(Math.random() * 100000)
}

listItems.forEach(addToDOM);

function calculateCalorie(){

    if(weightInp.value==''||ageInp.value =='' || heightUpdate(+heightInp.value) == ''){
        alert('Fill the input');
    }else{
        if(gender === 'male'){
            // for man
            BMR = 88.362 + (13.397 * weightUpdate(+weightInp.value)) + (4.799 * heightUpdate(+heightInp.value)) - (5.677 * +ageInp.value)
    
        }else{
            // for woman
            BMR = 447.593 + (9.247 * weightUpdate(+weightInp.value)) + (3.098 * heightUpdate(+heightInp.value)) - (4.330 * +ageInp.value)
        }

        //calorie intake per day
        calorieNeed = Math.floor(BMR * activityVal);
        // show at DOM
        resultEl.innerHTML = `<h2>You must take <strong class='text-success'>${calorieNeed}</strong> kcal/day</h2>`

        console.log(calorieNeed, heightUpdate(+heightInp.value));
    }
}

// Update height
function heightUpdate(height){
    if(heightSelect.value === 'cm'){
        
        if(heightInp.value == ''){
            height =''
        }else{
            height = height;
        }
        
    }else{
        if(heightInp.value !==''){
            if(inchInp.value ===''){
                height = +heightInp.value * 12;
            }else{
                height = (+heightInp.value * 12) + parseFloat(inchInp.value)
            }
        }else{
            height = +inchInp.value;
        }
        height = height*2.54
    }
    
    return height;
}

// Update weight
function weightUpdate(weight){
    if(weightSelect.value === 'kg'){
        weight = weight;
    }else{
        weight = weight * 0.453592;
    }

    return weight;
}


// Units show inches
function measures(e){
    
    if(e.target.value === 'feet'){
        inchEl.style.display ='block';
    }else{
        inchEl.style.display ='none';
    }
}


//  add item to listitems
function trackIntake(){
    const item ={
        id: generateId(),
        food: foodInp.value,
        calories: calorieInp.value
    }

    listItems.push(item);
    addToDOM(item)
    
    totalIntake();
    remainToTake();

    canvas.style.visibility = 'visible'
    updateChart();

    foodInp.value ='';
    calorieInp.value ='';
}

function addToDOM(e){

    const tr = document.createElement('tr');

    tr.innerHTML= `
        <td>${e.food}</td>
        <td>${e.calories}</td>
        <td class='btn-delete' data-id='${e.id}'><i class="fas fa-minus-circle"></i></td>
    `;

    listItemsEl.appendChild(tr);
    
}

function deleteItem(e){
    if(e.target.parentElement.classList.contains('btn-delete')){
        const ID = +e.target.parentElement.dataset.id;
        
        listItems.forEach( (item, index)=>{
            if(item.id === ID){
                listItems.splice(index,1)
            }
        })

        e.target.parentElement.parentElement.remove();
        totalIntake();
        remainToTake();
        updateChart();
    }
}

function totalIntake(){
    totalCalIntake = listItems.reduce((acc, cur)=> acc + +cur.calories,0)
    
    takenCalEl.textContent = totalCalIntake;
}
totalIntake();

function remainToTake(){
    
    if(totalCalIntake !== undefined && calorieNeed !== undefined){
        remainCal = calorieNeed - totalCalIntake;

        if(remainCal <= 0){
            extraCalEl.style.display='block';
            extraCalEl.innerText=`Extra Taken: ${Math.abs(remainCal)}kcal`
            remainCal = 0
        }else{
            extraCalEl.style.display='none';
            remainCal = calorieNeed - totalCalIntake;
        }
        remainCalEl.textContent = remainCal;
        
    }
    console.log(remainCal, totalCalIntake, calorieNeed);
}

// chart 

let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
    labels: ['Intake', 'Remaining'],
    datasets: [{
    label: 'My First dataset',
    // backgroundColor: 'rgb(255, 99, 132)',
    backgroundColor:['rgb(238, 136, 52)', 'lightgray'],
    data: [0, 0],
    borderWidth:1,
    borderColor:'darkgray',
    hoverBorderWidth: 3,
    }]
},

    // Configuration options go here
    options: {}
});



function updateChart(){
    let intakePer = +((totalCalIntake/calorieNeed*100).toFixed(2));
    let remainingPer = 100-intakePer;

    if(remainingPer <=0){
        remainingPer = 0;
    }else{
        remainingPer = 100-intakePer;
    }

    console.log(calorieNeed)


    chart.data.datasets[0].data[0] = intakePer;
    chart.data.datasets[0].data[1] = remainingPer;

    chart.update()
}


// Event Listeners

genderRadio.addEventListener('change', e=>{
    gender = e.target.value;
    // console.log(gender);
});

activitySelect.addEventListener('change', e=>{
    activityVal = +e.target.value;
    // console.log(activityVal);
});

heightSelect.addEventListener('change', measures);

calculateBtn.addEventListener('click', e=>{
    calculateCalorie();
    remainToTake();
    updateChart()
    e.preventDefault()
});
addBtn.addEventListener('click', e=>{
    e.preventDefault();
    trackIntake();

})

listItemsEl.addEventListener('click', deleteItem);
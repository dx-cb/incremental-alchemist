let gold = 0;//the amount of default currency the player has
let goldPerSecond = 0; // the gold generated per second
let generators = [ //the array of generator objects, will be referenced when creating generators and buying them
    {
        id: 1, //this is gen 1 and i can add gen2,3,4.. later!
        baseCost: 10,
        cost: 10,
        production: 1,
        quantity: 0,
        costMultiplier: 1.15

    }
];


function createGenerators() {
    const container = document.getElementById('generatorsContainer'); //get the containerfrom the html
    container.innerHTML = ''; //clear existing generators so no duplicates are created 

    for (let i = 0; i < generators.length; i++) { 
        const gen = generators[i]; //get the current generator object

        const div = document.createElement('div'); //create a div so the generator info can be displayed
        div.className = 'generator'; //set the class to use css on the gens created

        const title = document.createElement('h3'); //create a title element to display the generator name
        title.textContent = `Generator ${gen.id}`; //set the title text from the 
    }














function switchTab(tabname) {    
    //hide all tabs
    const tabs = document.querySelectorAll('.tabSection') //store the tab sections in an array
    for (let step = 0; step < tabs.length; step++) { //loop through each tab
        tabs[step].style.display = 'none' //hide each tab section
}
    //show the selected tab
    document.getElementById(tabname + 'Section').style.display = 'block'; //show the selected tab section
}

















function updateUI() {
    
}
function createGenerators() {

}
function buyGenerator() {

}
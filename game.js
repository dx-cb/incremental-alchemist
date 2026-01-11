let gold = 0;//the amount of default currency the player has
let goldPerSecond = 1; // the gold generated per second
let generators = [ //the array of generator objects, will be referenced when creating generators and buying them
    {
        id: 1, //this is gen "1" and i can add gen2,3,4.. later!
        baseCost: 10,
        cost: 10,
        production: 1,
        quantity: 0,
        costMultiplier: 1.15

    }
];

//game loop

setInterval(gameLoop, 1000); //runs the game loop every second that passes




//functions

function gameLoop() {
    gold += goldPerSecond
    updateUI(); //update the ui so new gold and gps can be seen
}

function createGenerators() { //function to create the generator elements on the page
    const container = document.getElementById('generatorsContainer'); //get the container from the html (where the gens will be displayed on the page))
    container.innerHTML = ''; //clear existing generators so no dupes are created 

    for (let i = 0; i < generators.length; i++) { 
        const gen = generators[i]; //get the current generator object

        const div = document.createElement('div'); //create a div so the generator info can be displayed
        div.className = 'generator'; //set the class to use css on the gens created

        const title = document.createElement('h3'); //create a title element to display the generator name
        title.textContent = `Generator ${gen.id}`; // use ${} to insert the genid for the name displayed so use ` instead of '

        const cost = document.createElement('p'); //need to show the cost
        cost.textContent = `Cost: ${gen.cost} gold`;

        const owned = document.createElement('p'); //need to show how many owned
        owned.textContent = `Owned: ${gen.quantity}`;

        const production = document.createElement('p'); //need to show gold gained per sec
        production.textContent = `Production: ${gen.production} gold/sec`;

        const button = document.createElement('button'); //create a button to buy the generator 
        button.textContent = 'Buy 1';
        button.onclick = () => buyGenerator(i); //add a button to buy, when clicked, buyGenerator will run
    }
        div.appendChild(title); //add the title to the div
        div.appendChild(cost);  //add the cost to the div
        div.appendChild(owned); //add the owned to the div      
        div.appendChild(production); //add the production to the div
        div.appendChild(button); //add the button to the div

        container.appendChild(div); //add the div to the container in the html
} 

function buyGenerator(index) { //function to buy a generator (index is the position in the generators array)
    const gen = generators[index]; //get the specific generator object at the inputted index

    if (gold > gen.cost) { //check if the player has enough gold to buy the generator
        gold -= gen.cost; //subract the cost
        gen.quantity += 1; //add one to the num of that gen owned
        gen.cost = newCost(gen); //update the cost for the next purchase - talk more in nea - create a function called newCost(gen) later
        
        //changes done so need to update screen
        updateUI(); //update the user interface
        recalculateGoldPerSecond(); //in the name

    }
} 

function updateUI() { //function to update the user interface
    document.getElementById('goldDisplay').textContent = `Gold: ${gold}`;
    document.getElementById('gpsDisplay').textContent = `Gold per second: ${goldPerSecond}`; //both of these change the gold and gps display directly
    createGenerators(); //recreate the generators to update their info
}

function switchTab(tabname) { //function to switch between tabs
    //hide all tabs
    const tabs = document.querySelectorAll('.tabSection') //store the tab sections in an array
    for (let step = 0; step < tabs.length; step++) { //loop through each tab
        tabs[step].style.display = 'none' //hide each tab section
}
    //show the selected tab
    document.getElementById(tabname + 'Section').style.display = 'block'; //show the selected tab section
}

function recalculateGoldPerSecond() { //function to recalculate the total gold per second based on owned generators
    goldPerSecond = 0; //reset gps to 0 before recalculating
    for (let i = 0; i < generators.length; i++) { //loop through each generator
        const gen = generators[i];
        goldPerSecond += gen.production * gen.quantity; //add the production of every owned generator to the total gps
    }
}
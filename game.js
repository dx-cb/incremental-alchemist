let gold = 10;//the amount of default currency the player has
let goldPerSecond = 0; // the gold generated per second
let generators = [ //the array of generator objects, will be referenced when creating generators and buying them
    {
        id: 1, //generator 1
        baseCost: 10,
        cost: 10,
        production: 1,
        quantity: 0,
        costMultiplier: 1.15,
        unlocked: true

    },
    {
        id: 2, //generator 2
        baseCost: 100,
        cost: 100,
        production: 10,
        quantity: 0,
        costMultiplier: 1.17,
        unlocked: true
    },
    {
        id: 3, //generator 3
        baseCost: 1000,
        cost: 1000,
        production: 50,
        quantity: 0,
        costMultiplier: 1.20,
        unlocked: false
    },
    {
        id: 4, //generator 4
        baseCost: 10000,
        cost: 10000,
        production: 500,
        quantity: 0,
        costMultiplier: 1.25,
        unlocked: false
    },
    {
        id: 5, //generator 5    
        baseCost: 100000,
        cost: 100000,
        production: 3000,
        quantity: 0,
        costMultiplier: 1.30,
        unlocked: false
    },
    {
        id: 6, //generator 6
        baseCost: 1000000,
        cost: 1000000,
        production: 20000,
        quantity: 0,
        costMultiplier: 1.35,
        unlocked: false
    }
];

//game loop

setInterval(gameLoop, 1000); //runs the game loop every second that passes
setInterval(saveGame, 30000); //auto saves the game every 30 seconds as a backup    




//functions

function saveGame() { //function to save the game state to local storage
    const gameData = { //object literal to store game data that needs to be saved
        gold: gold,
        goldPerSecond: goldPerSecond,
        generators: generators
    };
    localStorage.setItem('incrementalAlchemistSave', JSON.stringify(gameData)); //save the game data as a string in local storage
}

function loadGame() { //function to load the game state from local storage
    const savedData = localStorage.getItem('incrementalAlchemistSave'); //get the saved game data from local storage
    if (savedData) { //if there is saved data, load it
        const gameData = JSON.parse(savedData); //parse the saved data back into an object
        gold = gameData.gold; //load the gold amount
        goldPerSecond = gameData.goldPerSecond; //load the gps amount
        generators = gameData.generators; //load the generators array
    }
}

function unlockGenerators() { //function to check if new generators should be unlocked based on current gold
    for (let i = 0; i < generators.length; i++) { //loop through each generator
        const gen = generators[i];
        if (gold >= gen.baseCost && gen.unlocked === false) { //if the player has enough gold to buy the generator and it is not already unlocked
            gen.unlocked = true; //unlock the generator
        }
    }
}
function startUp() { //function to run when the page loads - can add more funcions inside this later if needed
    loadGame()
    recalculateGoldPerSecond() 
    switchTab('generators')
    updateUI()
}

function gameLoop() {
    recalculateGoldPerSecond(); //update gps before adding gold
    gold += goldPerSecond
    updateUI(); //update the ui so new gold and gps can be seen
    unlockGenerators(); //check if new generators should be unlocked based on current gold since the gold amount will change each game loop
}

function createGenerators() { //function to create the generator elements on the page
    const container = document.getElementById('generatorsContainer'); //get the container from the html (where the gens will be displayed on the page))
    container.innerHTML = ''; //clear existing generators so no dupes are created 

    for (let i = 0; i < generators.length; i++) { 
        
        const gen = generators[i]; //get the current generator object
            if (gen.unlocked === true) { //only create the generator if it is unlocked, so gens will be created in order as they are unlocked
                const div = document.createElement('div'); //create a div so the generator info can be displayed
                div.className = 'generator'; //set the class to use css on the gens created

                const title = document.createElement('h3'); //create a title element to display the generator name
                title.textContent = `Generator ${gen.id}`; // use ${} to insert the genid for the name displayed so use ` instead of '

                const cost = document.createElement('p'); //need to show the cost
                cost.textContent = `Cost: ${gen.cost} gold`;

                const owned = document.createElement('p'); //need to show how many owned
                owned.textContent = `Owned: ${gen.quantity}`;

                const production = document.createElement('p'); //need to show gold gained per sec
                production.textContent = `Production: +${gen.production * gen.quantity} gold/sec`; //multiply by quantity to show total production from that gen not just from one gen

                const button = document.createElement('button'); //create a button to buy the generator 
                button.textContent = 'Buy 1';
                button.onclick = () => buyGenerator(i); //add a button to buy, when clicked, buyGenerator will run
            
                div.appendChild(title); //add the title to the div
                div.appendChild(cost);  //add the cost to the div
                div.appendChild(owned); //add the owned to the div      
                div.appendChild(production); //add the production to the div
                div.appendChild(button); //add the button to the div

                container.appendChild(div); //add the div to the container in the html
            }
    }
} 

function buyGenerator(index) { //function to buy a generator (index is the position in the generators array)
    const gen = generators[index]; //get the specific generator object at the inputted index

    if (gold >= gen.cost) { //check if the player has enough gold to buy the generator
        gold -= gen.cost; //subract the cost
        gen.quantity += 1; //add one to the num of that gen owned
        gen.cost = newCost(gen); //update the cost for the next purchase - talk more in nea - create a function called newCost(gen) later
        
        //changes done so need to update screen
        
        unlockGenerators(); //check if new generators should be unlocked based on current gold since the gold amount will change after a purchase
        recalculateGoldPerSecond(); //in the name
        saveGame(); //save the game after each purchase so progress is not lost
        updateUI(); //update the user interface

    }
} 

function newCost(gen) { //function to calculate the new cost of a generator after purchase
    const growth = gen.costMultiplier;
    const cost = gen.baseCost * Math.pow(growth, gen.quantity); //cost = base * growth^n -> exponential formula
    return Math.floor(cost); //floor so the cost is an integer
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
    goldPerSecond = 0; //reset gps to 0 before summing up the production of all owned generators
    for (let i = 0; i < generators.length; i++) { //loop through each generator
        const gen = generators[i];
        goldPerSecond += gen.production * gen.quantity; //add the production of every owned generator to the total gps
    }
}

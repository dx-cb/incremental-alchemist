let gold = 10;//the amount of default currency the player has
let goldPerSecond = 0; // the gold generated per second
let numberFormat = 'none'; // default number format but can also be "scientific" or "engineering" or "mixed"
let generators = [ //the array of generator objects, will be referenced when creating generators and buying them
    {
        id: 1, //generator 1
        baseCost: 10,
        cost: 10,
        baseProduction: 1,
        production: 1,
        quantity: 0,
        costMultiplier: 1.15,
        unlocked: true

    },
    {
        id: 2, //generator 2
        baseCost: 100,
        cost: 100,
        baseProduction: 10,
        production: 10,
        quantity: 0,
        costMultiplier: 1.17,
        unlocked: true
    },
    {
        id: 3, //generator 3
        baseCost: 1000,
        cost: 1000,
        baseProduction: 50,
        production: 50,
        quantity: 0,
        costMultiplier: 1.20,
        unlocked: false
    },
    {
        id: 4, //generator 4
        baseCost: 10000,
        cost: 10000,
        baseProduction: 500,
        production: 500,
        quantity: 0,
        costMultiplier: 1.25,
        unlocked: false
    },
    {
        id: 5, //generator 5    
        baseCost: 100000,
        cost: 100000,
        baseProduction: 3000,
        production: 3000,
        quantity: 0,
        costMultiplier: 1.30,
        unlocked: false
    },
    {
        id: 6, //generator 6
        baseCost: 1000000,
        cost: 1000000,
        baseProduction: 20000,
        production: 20000,
        quantity: 0,
        costMultiplier: 1.35,
        unlocked: false
    }
];

let upgrades = [ //the array of upgrade objects, will be referenced when creating upgrades and buying them
    {   
        id: 1,
        name: "",
        description: "Double Generator 1 production",
        cost: 25,
        purchased: false
    },
    {
        id: 2,
        name: "",
        description: "Double Generator 2 production",
        cost: 250,
        purchased: false
    },
    {
        id: 3,
        name: "",
        description: "Increase all generator production by 50%",
        cost: 2500,
        purchased: false
    },
];

//game loop

setInterval(gameLoop, 1000); //runs the game loop every second that passes
setInterval(saveGame, 30000); //auto saves the game every 30 seconds as a backup    




//functions

function saveGame() { //function to save the game state to local storage
    const gameData = { //object literal to store game data that needs to be saved
        gold: gold,
        goldPerSecond: goldPerSecond,
        generators: generators,
        upgrades: upgrades
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
        upgrades = gameData.upgrades; //load the upgrades array
    }
}

function resetGame() { //function to reset the game state and clear local storage
    
    if (confirm("Are you sure you want to erase your save data and reset your game? This cant be undone!")) { //another check to make sure the player doesnt accidentally reset their game
        //reset values to default
        gold = 10; 
        goldPerSecond = 0;
        for (let i = 0; i < generators.length; i++) { //loop through each generator to reset their values to default
            generators[i].cost = generators[i].baseCost; //reset the cost to the base cost
            generators[i].production = generators[i].baseProduction; //reset the production to the base production
            generators[i].quantity = 0; //reset quantity for all generators to 0

            if (generators[i].id > 2) { //gen 1 and 2 can stay unlocked but the rest need to be locked again
                generators[i].unlocked = false; //lock the gen 3-6
            }
        }
        for (let i =0; i < upgrades.length; i++) { //loop through each upgrade to reset their values to default
            upgrades[i].purchased = false; //all upgrades should now be unbought
        }
        saveGame(); //replace the saved game data in local storage with the reset game data
        updateUI(); //update the user interface to reflect the reset game state
        alert("Game has been reset!"); //alert the player that the game has been reset
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

function gameLoop() { //function to run every second to update the game state
    recalculateGoldPerSecond(); //update gps before adding gold
    gold += goldPerSecond
    updateUI(); //update the ui so new gold and gps can be seen
    unlockGenerators(); //check if new generators should be unlocked based on current gold since the gold amount will change each game loop
}

function createUpgrades() { //function to create the upgrade elements on the page
    const container = document.getElementById('upgradesContainer'); //get the div 
    container.innerHTML = ''; //clear before creating so it doesnt duplicate upgrades
    for (let i = 0; i < upgrades.length; i++) { //loop through each upgrade
        const upgrade = upgrades[i]; //get the current upgrade object
        const div = document.createElement("div"); //create a div to display the upgrade info to then place in the upgrades container
        div.className = "upgrade"; //class name for css

        const title = document.createElement("h3");//title element
        title.textContent = `Upgrade ${upgrade.id}`;

        const description = document.createElement("p");//description element
        description.textContent = upgrade.description;

        const cost = document.createElement("p");//cost element
        cost.textContent = `Cost: ${upgrade.cost} gold`;

        const button = document.createElement("button");//button to buy the upgrade
        button.textContent = "Buy Upgrade";
        button.disabled = gold < upgrade.cost || upgrade.purchased === true; //disable the button if the player does not have enough gold to buy the upgrade OR if it is already purchased
        button.onclick = () => buyUpgrade(i); //calls the buyUpgrade function

        div.appendChild(title); 
        div.appendChild(description);
        div.appendChild(cost);
        div.appendChild(button); 

        container.appendChild(div); //add everything to the div to then add to the container
    }
}

function buyUpgrade(index) { //called when button to buy an upgrade is clicked, index is the position of the upgrade in the upgrade array
    const upgrade = upgrades[index]; //get the specific upgrade object at the inputted index

    if (gold >= upgrade.cost && upgrade.purchased === false) { //check if the player has enough gold to buy the upgrade and if it is not already purchased
        gold -= upgrade.cost; //subtract the cost from the gold
        upgrade.purchased = true; //mark the upgrade as purchased, so that it cant be bought again
        applyUpgrade(upgrade); //apply the effects of the upgrade

        recalculateGoldPerSecond(); //recalculate the total gps since it may have changed
        saveGame(); //save game incase of data loss
        updateUI(); //update the user interface to show the changes from the upgrade    
}
}

function applyUpgrade(upgrade) { //function to apply the effects of an upgrade after purchase AND overall this function will use selection to go through each upgrade id to see what effects to apply
    if (upgrade.purchased) {
        if (upgrade.id === 1) {                                 
                generators[0].production *= 2; //double the production of generator 1
            }
            if (upgrade.id === 2) {
                generators[1].production *= 2; //double the production of generator 2
            }
            if (upgrade.id === 3) {
                for (let i = 0; i < generators.length; i++) { //loop through each generator in the generators array
                    generators[i].production *= 1.5; //increase the production of all generators by 50%
                }
            }
}
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

                const production = document.createElement('p'); //need to show the production of the generator
                production.textContent = `This generator is producing ${gen.production * gen.quantity} gold/sec `;

                const button = document.createElement('button'); //create a button to buy the generator 
                button.textContent = 'Buy 1';
                button.disabled = gold < gen.cost; //disable the button if the player does not have enough gold to buy the generator
                button.title = `+${gen.production} gold/sec`;
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
    document.getElementById('goldDisplayGenerators').textContent = `Gold: ${gold}`;
    document.getElementById('gpsDisplayGenerators').textContent = `Gold per second: ${goldPerSecond}`; //both of these change the gold and gps display directly in the generator tab
    document.getElementById('goldDisplayUpgrades').textContent = `Gold: ${gold}`;
    document.getElementById('gpsDisplayUpgrades').textContent = `Gold per second: ${goldPerSecond}`; //gold and gps for upgrades tab
    document.getElementById('goldDisplayPrestige').textContent = `Gold: ${gold}`;
    document.getElementById('gpsDisplayPrestige').textContent = `Gold per second: ${goldPerSecond}`; //gold and gps for prestige tab
    createGenerators(); //recreate the generators to update their info
    createUpgrades(); //recreate the upgrades to update their info
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

function setFormat(format) { // updates the number format setting
    numberFormat = format;
    saveGame(); // save the chosen format
    updateUI(); // refresh display
}

function formatNumber(n) {
    if (numberFormat === 'scientific') { //scientific notation
        return n.toExponential(2); // scientific notation with 2 decimal places
    }
    if (numberFormat === 'engineering') { //engineering notation
        if (n>999999) { // only change if if number is > 1 million 
            const suffixes = ["M", "B", "T", "Qa","Qi","Sx","Sp","Oc","No"]; // array to hold suffixes for engineering notation
            const tier = Math.floor(Math.log10(n) / 3); // determine the tier of the number
            const coefficient = n / Math.pow(1000, tier); // make the number look "smaller"
            return coefficient.toFixed(2) + suffixes[tier - 2]; //combine the coefficient with the appropriate suffix
        }
        if (n>999 && n<1000000) { //if the number is between 1 thousand and 1 million then use K for engineering notation
            const coefficient = n / 1000;
            return coefficient.toFixed(2) + 'K';
        }
        if (n<1000) { //if the number is less than 1 thousand just return the number
            return n;
        }
    }
    if (numberFormat === 'mixed') { //mixed notation, both engineering and scientific depending on size of n
        if (1000 <= n && n <= 999999) { //if the number is less than 1 million, use engineering notation
            const suffixes = ['K', 'M']; //smaller array since enginering notation is used only early on
            const tier = Math.floor(Math.log10(n) / 3);
            const coefficient = n / Math.pow(1000, tier); //same calculation as engineering notation
            return coefficient.toFixed(2) + suffixes[tier - 1]; //combine the coefficient with the appropriate suffix again but tier -1 since K starts at 10^3
        }
        if (n<1000) { //if the number is less than one thousand, just return the number
            return n;
        }        
        if (n >= 1000000) { //if the number is greater than or equal to 1 million, use scientific notation
            return n.toExponential(2); // scientific notation with 2 decimal places
        }
    }
    if (numberFormat === 'none') { //if no format is selected, just return the number
        return n;
    }
}
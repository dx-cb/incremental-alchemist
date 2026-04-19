let gold = 10;//the amount of default currency the player has
let goldPerSecond = 0; // the gold generated per second
let alchemyPoints = 0; //the currency used for prestige
let alchemyPointsPerSecond = 0; //the alchemy points generated per second, will be used in the prestige tab 
let numberFormat = 'none'; // default number format but can also be "scientific" or "engineering" or "mixed"
let lifetimeGold = 0; // total gold ever earned, never resets
let totalPlaytime = 0; // seconds the game has been open
let lifetimeClicks = 0; // total button clicks
let currentTheme = 'dark'; // stores which theme the player currently has selected
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
let prestigeUpgrades = [ //array of prestige upgrade objects, will be referenced when creating prestige upgrades and buying them
    {
        id: 1,
        name: "",
        description: "Increase alchemy point gain by 50%",
        cost: 1,
        purchased: false
    },
    {
        id: 2,
        name: "",
        description: "Increase gold gain by 20%",
        cost: 1,
        purchased: false
    },
    {
        id: 3,
        name: "",
        description: "x2 all generator production",
        cost: 1,
        purchased: false
    },
    {
        id: 4,
        name: "",
        description: "x5 all generator production",
        cost: 2,
        purchased: false
    },
    {
        id: 5,
        name: "",
        description: "Unlock a secret generator...",
        cost: 100,
        purchased: false
    }
];
let achievements = [ //array of achievement objects, will be referenced to create achievements and check if they are unlocked
    { id: 1, name: "First Steps", description: "Earn 1,000 gold", unlocked: false, bonus: false },
    { id: 2, name: "Gold Rush", description: "Earn 1,000,000 gold", unlocked: false, bonus: false },
    { id: 3, name: "Alchemist", description: "Earn 1,000,000,000 gold", unlocked: false, bonus: false },
    { id: 4, name: "Beginner", description: "Buy your first generator", unlocked: false, bonus: false },
    { id: 5, name: "Collector", description: "Own 10 generators in total", unlocked: false, bonus: false },
    { id: 6, name: "Master", description: "Unlock all 6 generators, all of them gain a 1.5x boost in production", unlocked: false, bonus: true },
    { id: 7, name: "Alchemist Reborn", description: "Prestige for the first time", unlocked: false, bonus: false },
    { id: 8, name: "Point Hoarder", description: "Earn 10 alchemy points total", unlocked: false, bonus: false },
    { id: 9, name: "Taking a Break", description: "Play for 5 minutes", unlocked: false, bonus: false },
    { id: 10, name: "Dedicated", description: "Play for 1 hour", unlocked: false, bonus: false },
    { id: 11, name: "Clicker", description: "Click 100 times", unlocked: false, bonus: false },
    { id: 12, name: "Obsessed", description: "Click 1000 times, boost generator production by 1.2x", unlocked: false, bonus: true }
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
        upgrades: upgrades,
        alchemyPoints: alchemyPoints,
        prestigeUpgrades: prestigeUpgrades,
        lifetimeGold: lifetimeGold,       
        totalPlaytime: totalPlaytime,     
        lifetimeClicks: lifetimeClicks,
        currentTheme: currentTheme,
        achievements: achievements
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
        alchemyPoints = gameData.alchemyPoints; //load the alchemy points amount
        prestigeUpgrades = gameData.prestigeUpgrades; //load the prestige upgrades array
        lifetimeGold = gameData.lifetimeGold; //load the lifetime gold
        totalPlaytime = gameData.totalPlaytime; //load the total playtime
        lifetimeClicks = gameData.lifetimeClicks; //load the lifetime clicks
        currentTheme = gameData.currentTheme; //load the current theme
        achievements = gameData.achievements; //load the achievements array
        setTheme(currentTheme); //apply the loaded theme
    }
}

function resetGame() { //function to reset the game state and clear local storage
    
    if (confirm("Are you sure you want to erase your save data and reset your game? This cant be undone!")) { //another check to make sure the player doesnt accidentally reset their game
        //reset values to default
        gold = 10; 
        goldPerSecond = 0;
        alchemyPoints = 0;
        let lifetimeGold = 0; 
        let totalPlaytime = 0; 
        let lifetimeClicks = 0; 

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
        for (let i = 0; i < achievements.length; i++) {//loop through the achievement array
        achievements[i].unlocked = false; //lock all achievements again
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
    for (let i = 0; i < prestigeUpgrades.length; i++) { // reapply prestige upgrades on load
        applyPrestigeUpgrade(prestigeUpgrades[i]);
    }
    document.addEventListener('click', function() 
    {
        lifetimeClicks += 1; // increment every time anywhere on the page is clicked
    });
    recalculateGoldPerSecond() 
    switchTab('generators')
    updateUI()
}

function gameLoop() { //function to run every second to update the game state
    recalculateGoldPerSecond(); //update gps before adding gold
    gold += goldPerSecond
    lifetimeGold += goldPerSecond
    totalPlaytime += 1 //gameloop is called every 1 sec so total playtime increases by 1 second
    checkAchievements(); //check if any achievements should be unlocked
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
        cost.textContent = `Cost: ${formatNumber(upgrade.cost)} gold`;

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

function applyPrestigeUpgrade(upgrade) { //function to apply the effects of a prestige upgrade after purchase, will use selection to determine which upgrade effects to apply based on the id of the upgrade
    if (upgrade.purchased) { //check if the upgrade is purchased before applying its effects
        if (upgrade.id === 2) {
            for (let i = 0; i < generators.length; i++) { //loop through each generator in the generators array
                generators[i].production *= 1.2; //increase gold gain by 20% by multiplying the production of all generators by 1.2
            }
        }
        if (upgrade.id === 3) {
            for (let i = 0; i < generators.length; i++) { //loop through each generator in the generators array
                generators[i].production *= 2; //double all generator production by multiplying by 2
            }
        }
        if (upgrade.id === 4) {
            for (let i = 0; i < generators.length; i++) { //loop through each generator in the generators array
                generators[i].production *= 5; //x5 all generator production by multiplying by 5
            }
        }
        if (upgrade.id === 5) {
                //sort later    unlock a secret generator
        }
        }
    }

function calculateAlchemyPoints() { //function to calculate the amount of alchemy points the player should gain upon prestiging, will be based on the total gold the player has
    if (gold < 1e6) return 0; // no points until 1e6
    let points = Math.floor((Math.log10(gold) - 6) / 4) + 1; // 1 at 1e6, 2 at 1e10, 3 at 1e14 and so on
    if (prestigeUpgrades[0].purchased) {
        points = Math.floor(points * 1.5); // upgrade 1 bonus
    }
    return points;    
}

function prestige() { //function to reset the game state but keep alchemy points, called when the prestige button is clicked
    const pointsGained = calculateAlchemyPoints(); //pointsGained = the amount of alchemy points the player will gain from prestiging, calculated by the calculateAlchemyPoints function
    if (pointsGained < 1) { //no points gained
        alert("You need more gold to prestige!");
        return; // exits the function only if cant prestige, otherwise continues
    }
    alchemyPoints += pointsGained;
    // reset but keep alchemy points
    gold = 10;
    goldPerSecond = 0;
    for (let i = 0; i < generators.length; i++) {
        generators[i].cost = generators[i].baseCost;
        generators[i].production = generators[i].baseProduction;
        generators[i].quantity = 0;
        if (generators[i].id > 2) generators[i].unlocked = false;
    }
    for (let i = 0; i < upgrades.length; i++) {
        upgrades[i].purchased = false;
    } // finished resetting game state except alchemy points
    for (let i = 0; i < prestigeUpgrades.length; i++) { // reapply any prestige upgrades already bought
        applyPrestigeUpgrade(prestigeUpgrades[i]);
    }
    alert(`Prestiged! You gained ${pointsGained} Alchemy Point(s).`); //notify the user
    saveGame();
    switchTab('generators');
    updateUI();
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
                cost.textContent = `Cost: ${formatNumber(gen.cost)} gold`;

                const owned = document.createElement('p'); //need to show how many owned
                owned.textContent = `Owned: ${formatNumber(gen.quantity)}`;

                const production = document.createElement('p'); //need to show the production of the generator
                production.textContent = `This generator is producing ${formatNumber(gen.production * gen.quantity)} gold/sec `;

                const button = document.createElement('button'); //create a button to buy the generator 
                button.textContent = 'Buy 1';
                button.disabled = gold < gen.cost; //disable the button if the player does not have enough gold to buy the generator
                button.title = `+${formatNumber(gen.production)} gold/sec`;
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
    document.getElementById('goldDisplayGenerators').textContent = `Gold: ${formatNumber(gold)}`;
    document.getElementById('gpsDisplayGenerators').textContent = `Gold per second: ${formatNumber(goldPerSecond)}`; //both of these change the gold and gps display directly in the generator tab
    document.getElementById('goldDisplayUpgrades').textContent = `Gold: ${formatNumber(gold)}`;
    document.getElementById('gpsDisplayUpgrades').textContent = `Gold per second: ${formatNumber(goldPerSecond)}`; //gold and gps for upgrades tab
    document.getElementById('goldDisplayPrestige').textContent = `Gold: ${formatNumber(gold)}`;
    document.getElementById('gpsDisplayPrestige').textContent = `Gold per second: ${formatNumber(goldPerSecond)}`; //gold and gps for prestige tab
    document.getElementById('alchemyPointsDisplay').textContent = `Alchemy Points: ${alchemyPoints}`; //shows total owned alchemy points
    document.getElementById('pointsPreview').textContent = `Alchemy Points available this run: ${calculateAlchemyPoints()}`; //shows how many alchemy points the player can gain at the current moment
    document.getElementById('lifetimeGoldDisplay').textContent = `Lifetime Gold: ${formatNumber(lifetimeGold)}`; // updates lifetimeGold in stats
    document.getElementById('totalPlaytimeDisplay').textContent = `Total Playtime: ${totalPlaytime} seconds`; //updates lifetimeGold in stats
    document.getElementById('lifetimeClicksDisplay').textContent = `Lifetime Clicks: ${lifetimeClicks}`;// updates lifetimeGold in stats
    createGenerators(); //recreate the generators to update their info
    createUpgrades(); //recreate the upgrades to update their info
    createPrestigeUpgrades(); //recreate the prestige upgrades to update their info
    createAchievements(); //recreate the achievements to update their info
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

function formatNumber(n) { // function to format numbers based on the selected number format
    if (numberFormat === 'scientific') { //scientific notation
        if (n < 10) {
            return n // if n is less than 10 dont format
        }
        else {
            return n.toExponential(2); // scientific notation with 2 decimal places
        } 
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

function createPrestigeUpgrades() { //function to create the prestige upgrade elements on the page
    const container = document.getElementById('prestigeUpgradesContainer'); //get the container
    container.innerHTML = ''; //clear before creating so it doesnt duplicate
    for (let i = 0; i < prestigeUpgrades.length; i++) { //loop through each prestige upgrade
        const upgrade = prestigeUpgrades[i];
        const div = document.createElement('div');
        div.className = 'upgrade';

        const title = document.createElement('h3');
        title.textContent = `Prestige Upgrade ${upgrade.id}`;

        const description = document.createElement('p');
        description.textContent = upgrade.description;

        const cost = document.createElement('p');
        cost.textContent = `Cost: ${upgrade.cost} Alchemy Points`;

        const button = document.createElement('button');
        button.textContent = 'Buy';
        button.disabled = alchemyPoints < upgrade.cost || upgrade.purchased; //disable if not enough points or already bought
        button.onclick = () => buyPrestigeUpgrade(i);

        div.appendChild(title);
        div.appendChild(description);
        div.appendChild(cost);
        div.appendChild(button);
        container.appendChild(div);
    }
}

function buyPrestigeUpgrade(index) { //called when a prestige upgrade button is clicked
    const upgrade = prestigeUpgrades[index];
    if (alchemyPoints >= upgrade.cost && !upgrade.purchased) { //check if player can afford it and hasnt bought it
        alchemyPoints -= upgrade.cost; //subtract the cost from alchemy points
        upgrade.purchased = true;
        applyPrestigeUpgrade(upgrade); //apply the effect of the upgrade
        recalculateGoldPerSecond();
        saveGame();
        updateUI();
    }
}

function setTheme(theme) { // function to change the theme based on user input, will change the css variables for background colour and text colour
}

function checkAchievements() { //function to check if achievements should be unlocked
    // gold milestones
    if (lifetimeGold >= 1000) unlockAchievement(1);
    if (lifetimeGold >= 1000000) unlockAchievement(2);
    if (lifetimeGold >= 1000000000) unlockAchievement(3);

    // generator milestones
    let totalOwned = 0; // count total generators owned
    for (let i = 0; i < generators.length; i++) {
    totalOwned += generators[i].quantity;
    }
    if (totalOwned >= 1) unlockAchievement(4);
    if (totalOwned >= 10) unlockAchievement(5);
    
    let allUnlocked = true; // check if all generators are unlocked
    for (let i = 0; i < generators.length; i++) {
        if (generators[i].unlocked === false) {
            allUnlocked = false;
        }
    }
    if (allUnlocked) unlockAchievement(6);

    // prestige milestones
    if (alchemyPoints >= 1) unlockAchievement(7);
    if (alchemyPoints >= 10) unlockAchievement(8);

    // playtime milestones
    if (totalPlaytime >= 300) unlockAchievement(9);
    if (totalPlaytime >= 3600) unlockAchievement(10); 

    // clicks milestones
    if (lifetimeClicks >= 100) unlockAchievement(11);
    if (lifetimeClicks >= 1000) unlockAchievement(12);
}

function unlockAchievement(id) { // function to unlock an achievement based on its id
    const achievement = achievements[id - 1]; // get achievement by id
    if (!achievement.unlocked) { // only unlock if not already unlocked
        achievement.unlocked = true;
        alert(`Achievement unlocked: ${achievement.name}!`); // notify the player
        if (achievement.bonus) {
            applyAchievementBonus(id); // apply bonus if it has one
        }
        saveGame();
    }
}

function applyAchievementBonus(id) { // function to apply the bonus of an achievement based on its id
    if (id === 6) { // unlock all generators bonus
        for (let i = 0; i < generators.length; i++) {
            generators[i].production *= 1.5; // x1.5 all production
        }
    }
    if (id === 12) { // click 1000 times bonus
        for (let i = 0; i < generators.length; i++) {
            generators[i].production *= 1.2; // x1.2 all production
        }
    }
}

function createAchievements() { // function to create the achievement elements on the page
    const container = document.getElementById('achievementsContainer'); //get the container
    container.innerHTML = ''; //clear before creating so it doesnt duplicate
    for (let i = 0; i < achievements.length; i++) { //loop through the achievements array to create each achievement element
        const achievement = achievements[i];
        const div = document.createElement('div'); //create a div to hold the achievement info and display it on the page
        if (achievement.unlocked) {
            div.className = 'achievement unlocked';
        } 
        else {
            div.className = 'achievement locked';
        }

        const name = document.createElement('h3'); //create an element to display the achievement name but if the achievement is locked, show ??? instead of the name
        if (achievement.unlocked) {
            name.textContent = achievement.name;
        } else {
            name.textContent = '???';
        }

        const description = document.createElement('p'); //create an element to display the achievement description but if the achievement is locked, show "Keep playing to unlock" instead of the description
        if (achievement.unlocked) {
            description.textContent = achievement.description;
        } else {
            description.textContent = 'Keep playing to unlock';
        }
            div.appendChild(name); //add the name to the div
            div.appendChild(description); //add the description to the div
            container.appendChild(div); //add the div to the container in the html
    }
}
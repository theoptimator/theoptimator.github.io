
  
  let player;
  let exit;
  let walls;
  let paths;
  let cursors;
  let fog;
  let maze;
  let tileSize;
  let wallsArray = [];
  let change;
  let startTime;
  let npcsEncountered_g = 0;
  let npcsEncountered_e = 0;
  let overlappedNPCs = new Set(); // Track NPCs that have been counted 
  let npc_g = new Set();
  let npc_e = new Set();
  let lives = 3;
  let enemy;
  let scoreText;
  let lives_text;
  let exit_score = 0;
  let exit_collide = 0;
  const numNPCs = 3; // Number of NPCs to create
  let nextMazeChangeTime;
  const wallTextures = ['wall1', 'wall2', 'wall3', 'wall4']; // List of wall textures
  let hand_doom;
  let gameOver = false;
  let backgroundMusic;
  let contact;
  let npcs_e;
  let npcs_g;

function preload() {
    // Load assets (you can replace these with your own images)
    this.load.image('player', './assets/player.png'); // Simple square for player
    this.load.image('wall1', 'assets/wall1.jpg'); // First wall image
    this.load.image('wall2', 'assets/wall5.png'); // Second wall image
    this.load.image('wall3', 'assets/wall3.png'); // Third wall image
    this.load.image('wall4', 'assets/wall4.jpg'); // Fourth wall image
    this.load.image('exit', 'assets/ex.png');   // Simple square for exit
    this.load.image('fog', 'assets/fog.jpg');    // Black square for fog (replace with a black tile)
    this.load.image('logo', 'assets/logo.png')
    this.load.image('path', 'assets/path.png')
    this.load.image('background', 'assets/background.png')
    this.load.image('wiz', 'assets/wiz.png')
    this.load.image('hand', 'assets/hand2.png')
    this.load.image('enemy', 'assets/enemy.png')
    this.load.audio('npce', 'sounds/scream.wav')
    this.load.audio('npcg', 'sounds/scream2.wav')
    this.load.audio('exit', 'sounds/exit.wav')
    this.load.audio('hand', 'sounds/hand.wav')
    this.load.audio('music', 'sounds/music.mp3');
    this.load.audio('enemy', 'sounds/enemy.wav')
  }
function create() {
    gameOver = false;
    npcsEncountered_g = 0;
    npcsEncountered_e = 0;
    exit_score = 0;
    exit_collide = 0;
    overlappedNPCs.clear();
    npc_g.clear();
    npc_e.clear();
    const logo = this.add.image(
      config.width - 720, // Center horizontally on the right side
      config.height -470, // Center vertically
      'logo' // Image key
    ).setOrigin(0.5, 0.5).setScale(0.3);
  
    // Scale the background to cover the entire game screen
    
    const boxWidth = 400;
    const boxHeight = 200;
    const boxX = (config.width - boxWidth) / 2;
    const boxY = (config.height - boxHeight) / 2;

  

    // Add instructions text
    const instructionsText = this.add.text(config.width / 2, boxY + 200, 'Thou art about to commence thy journey, O Pilgrim. Thou shalt encounter other wanderers upon thy path, yet beware, for they may be naught but malevolent spirits. Take heed of the Hand of Doom, that dread abomination which shall cast thee through the void of space. Gather the outer knowledge, and thou shalt be rewarded, should the Other deem thee worthy.', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#FFFFFF',
      wordWrap:{width:1000},
    }).setOrigin(0.5, 0.5);

    // Add start button
    const startButton = this.add.text(config.width / 2 - 20, boxY + 300, 'Start', {
      fontFamily: 'Damascus',
      fontSize: '32px',
      color: '#FFFFFF',
      backgroundColor: '#555555', // Button background color
      padding: { x: 20, y: 10 }, // Add padding to the button
    }).setOrigin(0.5, 0.5).setInteractive();

    
    // Add the logo
    
    // Add button hover effect
    startButton.on('pointerover', () => {
      startButton.setBackgroundColor('#777777'); // Change background color on hover
    });

    startButton.on('pointerout', () => {
      startButton.setBackgroundColor('#555555'); // Reset background color
    });

    // Handle button click
    startButton.on('pointerdown', () => {
      // Play a silent sound to unlock audio
      const silentSound = this.sound.add('music', { volume: 0});
      silentSound.play();

      // Remove the start screen
      logo.destroy();
      instructionsText.destroy();
      startButton.destroy();

      // Start the game
      initializeGame.call(this); // Call your game initialization function
    });
    };
function initializeGame() {
    if (walls) walls.clear(true, true);
    if (paths) paths.clear(true, true);
    if (npc_g) npc_g.clear(true, true);
    if (npc_e) npc_e.clear(true, true);
    if (fog) fog.clear(true, true);
    if (exit) exit.destroy();
    if (hand_doom) hand_doom.destroy();
    if (player) player.destroy();
    if (backgroundMusic) backgroundMusic.destroy();
    npcsEncountered_e = 0;
    npcsEncountered_g = 0;
    exit_score = 0;
    gameOver = false;
    // Reset variables
    exit_collide = 0;
    overlappedNPCs.clear();
    // Banner background
    change = Math.floor(Math.random());
    //const bannerWidth = config.width;

    const background = this.add.image(
      config.width - 330, // Center horizontally
      config.height / 2, // Center vertically
      'background' // Image key
    ).setOrigin(0.5, 0.5);
  
    // Scale the background to cover the entire game screen
    background.displayWidth = 700;
    background.displayHeight = config.height;

    // Add the logo
    const logo = this.add.image(
      config.width - 200, // Center horizontally on the right side
      config.height -520, // Center vertically
      'logo' // Image key
    ).setOrigin(0.5, 0.5);
  
    // Scale the logo to fit within the banner
    const maxLogoWidth = config.width * 0.2; // 80% of the banner width
    const maxLogoHeight = config.height * 0.2; // 80% of the banner height
    logo.displayWidth = Math.min(logo.width, maxLogoWidth);
    logo.displayHeight = Math.min(logo.height, maxLogoHeight);
    const titleText = this.add.text(
      config.width - 200, // Center horizontally on the right side
      config.height -400, // Center vertically
      'Abandon all hope,', // Your game title
      {
        fontFamily: 'Damascus', // Font style
        fontSize: '24px', // Font size
        color: '#FFFFFF', // White color
        fontStyle: 'italic', // Bold text
        stroke: '#000000', // Black outline
        strokeThickness: 4, // Outline thickness
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          stroke: true,
          fill: true,
        },
      }
    ).setOrigin(0.5, 0.5); // Center the text
    const titleText2 = this.add.text(
      config.width - 200, // Center horizontally on the right side
      config.height -370, // Center vertically
      'ye who enter here.', // Your game title
      {
        fontFamily: 'Damascus', // Font style
        fontSize: '24px', // Font size
        color: '#FFFFFF', // White color
        fontStyle: 'italic', // Bold text
        stroke: '#000000', // Black outline
        strokeThickness: 4, // Outline thickness
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          stroke: true,
          fill: true,
        },
      }
    ).setOrigin(0.5, 0.5); // Center the text
    const titleText3 = this.add.text(
      config.width - 200, // Center horizontally on the right side
      config.height -200, // Center vertically
      'If stuck, press R', // Your game title
      {
        fontFamily: 'Damascus', // Font style
        fontSize: '24px', // Font size
        color: '#FFFFFF', // White color
        fontStyle: 'italic', // Bold text
        stroke: '#000000', // Black outline
        strokeThickness: 4, // Outline thickness
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          stroke: true,
          fill: true,
        },
      }
    ).setOrigin(0.5, 0.5);
    // Create maze layout (10x10 grid)
    tileSize = 40;
    maze = generateMaze(25, 15);
    
    // get images sizes
    
    // Tile size
    // Find a valid exit position (far from the player)
    let startPosition = findValidStartPosition(maze);
    if (!startPosition) {
      console.error('No valid starting position found!');
    return;
    }
    let exitPosition = findValidExitPosition(maze, startPosition);
    if (!exitPosition) {
      console.error('No valid exit position found!');
    return;
    }
    // Place the exit
    maze[exitPosition.y][exitPosition.x] = 2; // Mark exit in the maze
    // Create walls and exit
    walls = this.physics.add.staticGroup();
    paths = this.physics.add.staticGroup();
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 1) {
          const wall = walls.create(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'wall1').refreshBody();
          wallsArray.push(wall); // Add the wall to the array

          } else if (maze[y][x] === 0) {
            const path = paths.create(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'path').refreshBody();
          } else if (maze[y][x] === 2) {
          exit = this.physics.add.sprite(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'exit');
        }
      }
    }

    
    // Create hand of doom
    hand_doom = this.physics.add.sprite(
    Phaser.Math.Between(0, maze[0].length - 1) * tileSize + tileSize / 2, // Random X position
    Phaser.Math.Between(0, maze.length - 1) * tileSize + tileSize / 2, // Random Y position
    'hand' // Image key
  ).setScale(2); // Adjust scale if necessary    
    // create enemy
    enemy = this.physics.add.sprite(Phaser.Math.Between(0, maze[0].length - 1) * tileSize + tileSize / 2, // Random X position
    Phaser.Math.Between(0, maze.length - 1) * tileSize + tileSize / 2, // Random Y position
    'enemy').setScale(2);
    

    // Create player
    player = this.physics.add.sprite(
      startPosition.x * tileSize + tileSize / 2,
      startPosition.y * tileSize + tileSize / 2,
      'player'
    );
    player.setCollideWorldBounds(true);
  
    // Enable collisions
    this.physics.add.collider(player, walls);
    this.physics.add.collider(exit, paths);
    this.physics.add.collider(exit, walls);
    // Check for reaching the exit
    this.physics.add.collider(player, exit, () => {
      //alert('You win!');
      //this.scene.restart();
      if (exit_collide === 0) {
        this.sound.play('exit')
        exit_collide = 1;
        exit_score++;
      }

    });
    this.physics.add.collider(player, hand_doom , (player, hand_doom) => {
      //animation
      // move player to random position
      startPosition = findValidNPCPosition(maze);
      this.sound.play('hand')
      player.setPosition(startPosition.x* tileSize + tileSize / 2, startPosition.y* tileSize + tileSize / 2)
      npcsEncountered_e++;
      hand_doom.setTint(0xff0000)
      this.time.delayedCall(500, () => {
        hand_doom.clearTint(); // Reset tint to normal
      });
    });

    this.physics.add.collider(player, enemy , (player, enemy) => {
      //animation
      // move player to random position
      startPosition = findValidNPCPosition(maze);
      this.sound.play('enemy')
      player.setPosition(startPosition.x* tileSize + tileSize / 2, startPosition.y* tileSize + tileSize / 2)
      lives--;
      enemy.setTint(0xff0000)
      this.time.delayedCall(500, () => {
        hand_doom.clearTint(); // Reset tint to normal
      });
    });
    // Set initial velocity
    hand_doom.setVelocity(0);
    enemy.setVelocity(0);
    // Keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    fog = this.add.group();
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const fogTile = this.add.rectangle(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize,
          tileSize,
          0x000000, // Black color
          0.94 // 80% opacity
        ).setOrigin(0.5, 0.5);
        fog.add(fogTile);
      }
    }
    fog.setDepth(2)     
    // Reveal starting area
    // Reveal starting area
    revealArea.call(this, startPosition.x, startPosition.y);
    // Set a timer for maze changes (e.g., every 10 seconds)
  //console.log(Phaser.Math.Between(1, 15))
  nextMazeChangeTime = this.time.now + 15000 + Phaser.Math.Between(-10000, 10000); // 30 seconds ± 10 seconds
    
    // Create NPCs
  npcs_g = this.physics.add.group();
  npcs_e = this.physics.add.group();
  let npc;
  for (let i = 0; i < numNPCs; i++) {

    const position = findValidNPCPosition(maze);
    if ((Phaser.Math.Between(1, 10) % 2) === 0) {
        npc = npcs_g.create(
        position.x * tileSize + tileSize / 2, // X position
        position.y * tileSize + tileSize / 2, // Y position
        'wiz' // Image key
      ); // Adjust scale if necessary
      npc_g.add(npc)
    }
    else {
        npc = npcs_e.create(
        position.x * tileSize + tileSize / 2, // X position
        position.y * tileSize + tileSize / 2, // Y position
        'wiz' // Image key
      ); // Adjust scale if necessary
      npc_e.add(npc)
    }
    
    // Ensure NPCs don't walk through walls
    this.physics.add.collider(npc, paths);
    this.physics.add.collider(npc, walls);
    
  }
  this.physics.add.collider(player, npcs_e, (player, npc) => {
      this.sound.play('npce')

      if (!overlappedNPCs.has(npc) & (npc_e.has(npc))) {
      // Increment NPCs encountered
      npcsEncountered_e++;
      overlappedNPCs.add(npc); // Mark the NPC as counted
      npc.setTint(0xff0000);
      // Optional: Add visual feedback (e.g., change NPC color)
      
      }});

  
  this.physics.add.collider(player, npcs_g, (player, npc) => {
        if (!overlappedNPCs.has(npc) & (npc_g.has(npc))) {
        // Increment NPCs encountered
        npcsEncountered_g++;
        this.sound.play('npcg')
        overlappedNPCs.add(npc); // Mark the NPC as counted
        npc.setTint(0x0000ff)
        // Optional: Add visual feedback (e.g., change NPC color)
        
        }});
    

  contact = this.add.text(1020, 600, 'Contact: github_optimator.k6u5p@passmail.net',
    {fontFamily: 'Arial',
      fontSize: '15px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,

    }
  );
  
  
  // Start timer
  //startTime = this.time.now;
  // Create score text
  scoreText = this.add.text(1110, 300, 'Score: 0', {
    fontFamily: 'Arial',
    fontSize: '32px',
    color: '#FFFFFF',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 4,
  }).setOrigin(0, 0);
  lives_text = this.add.text(1110, 500, 'Lives: 3', {
    fontFamily: 'Arial',
    fontSize: '32px',
    color: '#FFFFFF',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 4,
  }).setOrigin(0, 0);
    // Play background music
    backgroundMusic = this.sound.add('music', {
      volume: 1, // Adjust volume (0 to 1)
      loop: true, // Loop the music
    });
    backgroundMusic.play();
}
  
function updateWallAppearance() {
    const rn = Math.random()
    walls.getChildren().forEach((wall, index) => {
      // Change wall tint dynamically
      const tint = Phaser.Display.Color.GetColor(
        Math.floor(rn * 255), // Red
        Math.floor(rn * 255), // Green
        Math.floor(1 * 255)  // Blue
      );
      wall.setTint(tint);
  
      // Alternatively, change the wall image dynamically
      // wall.setTexture('new_wall_image'); // Replace 'new_wall_image' with your image key
    });
}
function changeMaze() {
  walls.clear(true, true);
  paths.clear(true, true);
  npc_g.clear(true, true);
  npc_e.clear(true, true);
  fog.clear(true, true);
  enemy.destroy();
  if (exit) exit.destroy();
  if (hand_doom) hand_doom.destroy();

  // Reset variables
  exit_collide = 0;
  overlappedNPCs.clear();
  // Store player's current position
  const playerTileX = Math.floor(player.x / tileSize);
  const playerTileY = Math.floor(player.y / tileSize);
  //wallsArray = [];
  const randomTexture = Phaser.Utils.Array.GetRandom(wallTextures);

  
  maze = generateMaze(25, 15);
  
  
    // Ensure player's position is valid in the new maze
  if (maze[playerTileY][playerTileX] === 1) {
      // Player is on a wall, move them to the nearest valid path
      const nearestPath = findNearestPath(maze, playerTileX, playerTileY);
      player.setPosition(nearestPath.x * tileSize + tileSize / 2, nearestPath.y * tileSize + tileSize / 2);
    }   
  let exitPosition = findValidExitPosition(maze, {x:Math.floor(player.x / tileSize), y:Math.floor(player.y / tileSize)});
  console.log([Math.floor(player.x / tileSize), Math.floor(player.y / tileSize)])

  // Place the exit
  maze[exitPosition.y][exitPosition.x] = 2; // Mark exit in the maze
  // Create walls and exit
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        const wall = walls.create(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, randomTexture).refreshBody();
      } else if (maze[y][x] === 0){
        const path = paths.create(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'path').refreshBody();
      } else if (maze[y][x] === 2) {
        exit = this.physics.add.sprite(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 'exit');
      }
    }
  }
    // Re-enable collisions between the player and walls
  updateWallAppearance()
  this.physics.add.collider(player, walls);
  player.setDepth(2)
  this.physics.add.collider(exit, paths);
    this.physics.add.collider(exit, walls);
    // Check for reaching the exit
    this.physics.add.collider(player, exit, () => {
      //alert('You win!');
      //this.scene.restart();
      if (exit_collide === 0) {
        this.sound.play('exit')
        exit_collide = 1;
        exit_score++;
      }

    });
  // Reset fog
  fog.clear(true, true);

  // Create new fog tiles to match the new maze layout
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const fogTile = this.add.rectangle(
        x * tileSize + tileSize / 2,
        y * tileSize + tileSize / 2,
        tileSize,
        tileSize,
        0x000000, // Black color
        0.92 // 80% opacity
      ).setOrigin(0.5, 0.5);
      fog.add(fogTile);
    }
  }
  fog.setDepth(2)
  // Reveal starting area around the player
  const tileX = Math.floor(player.x / tileSize);
  const tileY = Math.floor(player.y / tileSize);
  revealArea.call(this, tileX, tileY);
  
  npcs_e.clear(true, true)
  npcs_g.clear(true, true)
  npcs_g = this.physics.add.group();
  npcs_e = this.physics.add.group();
  let npc;
  for (let i = 0; i < numNPCs; i++) {

    const position = findValidNPCPosition(maze);
    if ((Phaser.Math.Between(1, 10) % 2) === 0) {
        npc = npcs_g.create(
        position.x * tileSize + tileSize / 2, // X position
        position.y * tileSize + tileSize / 2, // Y position
        'wiz' // Image key
      ); // Adjust scale if necessary
      npc_g.add(npc)
    }
    else {
        npc = npcs_e.create(
        position.x * tileSize + tileSize / 2, // X position
        position.y * tileSize + tileSize / 2, // Y position
        'wiz' // Image key
      ); // Adjust scale if necessary
      npc_e.add(npc)
    }
    
    // Ensure NPCs don't walk through walls
    this.physics.add.collider(npc, paths);
    this.physics.add.collider(npc, walls);
    
  }
  this.physics.add.collider(player, npcs_e, (player, npc) => {
      if (!overlappedNPCs.has(npc) & (npc_e.has(npc))) {
      // Increment NPCs encountered
      npcsEncountered_e++;
      overlappedNPCs.add(npc); // Mark the NPC as counted
      npc.setTint(0xff0000);
      this.sound.play('npce')

      
      // Optional: Add visual feedback (e.g., change NPC color)
      
      }});

  // Create hand of doom
  hand_doom = this.physics.add.sprite(
    Phaser.Math.Between(0, maze[0].length - 1) * tileSize + tileSize / 2, // Random X position
    Phaser.Math.Between(0, maze.length - 1) * tileSize + tileSize / 2, // Random Y position
    'hand' // Image key
  ).setScale(2); // Adjust scale if necessary    
  //this.physics.add.collider(hand_doom, walls);
  this.physics.add.collider(player, hand_doom , (player, hand_doom) => {
    //animation
    // move player to random position
    let startPosition = findValidNPCPosition(maze);
    this.sound.play('hand')
    player.setPosition(startPosition.x* tileSize + tileSize / 2, startPosition.y* tileSize + tileSize / 2)
    npcsEncountered_e++;
    hand_doom.setTint(0xff0000);
    this.time.delayedCall(500, () => {
      hand_doom.clearTint(); // Reset tint to normal
    });
  });
  // Set initial velocity
  hand_doom.setVelocity(0);


    // Create enemy
    enemy = this.physics.add.sprite(
      Phaser.Math.Between(0, maze[0].length - 1) * tileSize + tileSize / 2, // Random X position
      Phaser.Math.Between(0, maze.length - 1) * tileSize + tileSize / 2, // Random Y position
      'enemy' // Image key
    ).setScale(2); // Adjust scale if necessary    
    //this.physics.add.collider(hand_doom, walls);
    this.physics.add.collider(player, enemy , (player, enemy) => {
      //animation
      // move player to random position
      let startPosition = findValidNPCPosition(maze);
      this.sound.play('enemy')
      player.setPosition(startPosition.x* tileSize + tileSize / 2, startPosition.y* tileSize + tileSize / 2)
      lives--;
      enemy.setTint(0xff0000);
      this.time.delayedCall(500, () => {
        enemy.clearTint(); // Reset tint to normal
      });
    });
    // Set initial velocity
    enemy.setVelocity(0);

  this.physics.add.collider(player, npcs_g, (player, npc) => {
        if (!overlappedNPCs.has(npc) & (npc_g.has(npc))) {
        // Increment NPCs encountered
        npcsEncountered_g++;
        this.sound.play('npcg')
        overlappedNPCs.add(npc); // Mark the NPC as counted
        npc.setTint(0x0000ff)
        // Optional: Add visual feedback (e.g., change NPC color)
        
        }});
  scoreText.destroy()
  scoreText = this.add.text(1110, 300, 'Score: ${score}', {
  fontFamily: 'Arial',
  fontSize: '24px',
  color: '#FFFFFF',
  fontStyle: 'bold',
  stroke: '#000000',
  strokeThickness: 4,
  }).setOrigin(0, 0);
  contact.destroy();
  contact = this.add.text(1020, 600, 'Contact: github_optimator.k6u5p@passmail.net',
    {fontFamily: 'Arial',
      fontSize: '15px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,

    }
  );
  lives_text.destroy();
  lives_text = this.add.text(1110, 500, 'Lives: ${lives}', {
    fontFamily: 'Arial',
    fontSize: '32px',
    color: '#FFFFFF',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 4,
  }).setOrigin(0, 0);
  

}

function revealArea(x, y) {
    const revealDistance = 4; // Number of tiles to reveal in each direction
  
    for (let dy = -revealDistance; dy <= revealDistance; dy++) {
      for (let dx = -revealDistance; dx <= revealDistance; dx++) {
        const tileX = x + dx;
        const tileY = y + dy;
  
        // Check if the tile is within the map bounds
        if (tileX >= 0 && tileX < maze[0].length && tileY >= 0 && tileY < maze.length) {
          // Find the fog tile at this position
          fog.getChildren().forEach(tile => {
            if (Math.floor(tile.x / tileSize) === tileX && Math.floor(tile.y / tileSize) === tileY) {
              // Fade out the fog tile
              this.tweens.add({
                targets: tile,
                alpha: 0, // Fade to fully transparent
                duration: 500, // Duration of the fade in milliseconds
                ease: 'Linear',
                onComplete: () => {
                  tile.setVisible(false); // Hide the tile after the fade
                }
              });
            }
          });
        }
      }
    }
  }
  
function update() {
    if (scoreText) {
      //const timePlayed = Math.floor((this.time.now - startTime) / 1000);
    // Calculate score
    
    let score = npcsEncountered_g * 10 - npcsEncountered_e*10 + 50*exit_score; // Example: 1 point per second + 10 points per NPCl
    if ((lives <= 0 && !gameOver) || (score < 0 && !gameOver)) {
      gameOver = true; // Prevent multiple dialogue boxes
      showGameOverDialogue.call(this);
    }
    // Update the score display
    scoreText.setText(`Score: ${score}`);
    lives_text.setText(`Lives: ${lives}`);
    // Player movement
    player.setVelocity(0);
    const v = 200
    if (cursors.left.isDown) {
      player.setVelocityX(-v);
    } else if (cursors.right.isDown) {
      player.setVelocityX(v);
    }
  
    if (cursors.up.isDown) {
      player.setVelocityY(-v);
    } else if (cursors.down.isDown) {
      player.setVelocityY(v);
    }
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).isDown){
      changeMaze.call(this);
    };
    // Reveal area around player
    const tileX = Math.floor(player.x / tileSize);
    const tileY = Math.floor(player.y / tileSize);
    revealArea.call(this, tileX, tileY);
    // Reveal tiles around a given position with smooth fade
  if (this.time.now >= nextMazeChangeTime){
    changeMaze.call(this)
    //console.log('change')
  }
  nextMazeChangeTime = this.time.now + 10000 + Phaser.Math.Between(-10000, 10000); // 30 seconds ± 10 seconds
  
  // Calculate distance between enemy and player
  const distanceToPlayer = Phaser.Math.Distance.Between(
      hand_doom.x, hand_doom.y,
      player.x, player.y
    );
  
  // Define the chase range (e.g., 200 pixels)
  const chaseRange = 150;
  
  if (distanceToPlayer <= chaseRange) {
    // Move enemy toward player
    const angle = Phaser.Math.Angle.Between(
      hand_doom.x, hand_doom.y,
      player.x, player.y
    );
  
    const speed = 45; // Speed of the enemy
    hand_doom.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
  } else {
    // Stop the enemy if the player is out of range
    hand_doom.setVelocity(0);
  }
  // Calculate distance between enemy and player
  const enemyToPlayer = Phaser.Math.Distance.Between(
      enemy.x, enemy.y,
      player.x, player.y
    );
  
  // Define the chase range (e.g., 200 pixels)
  const chaseRange2 = 150;
  
  if (enemyToPlayer <= chaseRange2) {
    // Move enemy toward player
    const angle2 = Phaser.Math.Angle.Between(
      enemy.x, enemy.y,
      player.x, player.y
    );
  
    const speed2 = 45; // Speed of the enemy
    enemy.setVelocity(
      Math.cos(angle2) * speed2,
      Math.sin(angle2) * speed2
    );
  } else {
    // Stop the enemy if the player is out of range
    enemy.setVelocity(0);
  }
    }
  
    
    
  }
  
  
  
  // Simple maze generation (1 = wall, 0 = path, 2 = exit)
function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () => Array(width).fill(1));
  
    // Carve a path using Recursive Backtracking
    let x = 1, y = 1;
    maze[y][x] = 0;
  
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];
  
    const stack = [[x, y]];
  
    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      shuffleArray(directions);
  
      for (const [dx, dy] of directions) {
        const nx = cx + dx * 2;
        const ny = cy + dy * 2;
  
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
          maze[ny][nx] = 0;
          maze[cy + dy][cx + dx] = 0;
          stack.push([nx, ny]);
        }
      }
    }
  
    // Add fake paths (dead ends or loops)
    for (let i = 0; i < 50; i++) {
      let fx = Math.floor(Math.random() * (width - 2)) + 1;
      let fy = Math.floor(Math.random() * (height - 2)) + 1;
  
      if (maze[fy][fx] === 1) {
        maze[fy][fx] = 0;
        const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
        const nx = fx + dx, ny = fy + dy;
  
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
          maze[ny][nx] = 0;
        }
      }
    }
  
    // Ensure all paths are connected
    ensureAllPathsConnected(maze);
  
    return maze;
  }
  // Find a valid starting position (not on a wall)
function findValidStartPosition(maze) {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 0) { // 0 represents a path
        return { x, y }; // Return the first valid position found
      }
    }
  }
  return null; // No valid position found
}
// Find a valid exit position (far from the player)
function findValidExitPosition(maze, startPosition) {
  const validPositions = [];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 0) { // 0 represents a path
        validPositions.push({ x, y });
      }
    }
  }

  // Shuffle valid positions to randomize exit placement
  shuffleArray(validPositions);
  // Sort positions by distance from the player (furthest first)
  //validPositions.sort((a, b) => {
  //  const distA = Math.abs(a.x - startPosition.x) + Math.abs(a.y - startPosition.y);
  //  const distB = Math.abs(b.x - startPosition.x) + Math.abs(b.y - startPosition.y);
  //  return distB - distA; // Sort in descending order
  //});

  // Check each position for reachability
  for (const position of validPositions) {
    if (isReachable(maze, startPosition, position)) {
      return position; // Return the first reachable position
    }
  }

  return null; // No reachable position found
}
// Check if a position is reachable from the start position
function isReachable(maze, start, end) {
  const visited = new Set();
  const queue = [start];
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (x === end.x && y === end.y) {
      return true; // Exit is reachable
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 && nx < maze[0].length &&
        ny >= 0 && ny < maze.length &&
        maze[ny][nx] === 0 && // Path
        !visited.has(`${nx},${ny}`) // Not visited
      ) {
        visited.add(`${nx},${ny}`);
        queue.push({ x: nx, y: ny });
      }
    }
  }

  return false; // Exit is not reachable
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function findNearestPath(maze, startX, startY) {
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  const queue = [{ x: startX, y: startY }];
  const visited = new Set();
  visited.add(`${startX},${startY}`);

  while (queue.length > 0) {
    const { x, y } = queue.shift();

    // Check if the current tile is a valid path
    if (maze[y][x] === 0) {
      return { x, y };
    }

    // Explore neighboring tiles
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < maze[0].length &&
        ny >= 0 && ny < maze.length &&
        !visited.has(`${nx},${ny}`)
      ) {
        visited.add(`${nx},${ny}`);
        queue.push({ x: nx, y: ny });
      }
    }
  }

  // If no valid path is found, return the starting position (fallback)
  startPosition = findValidStartPosition(maze);
  return startPosition;
}
function ensureAllPathsConnected(maze) {
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  // Create a copy of the maze for connectivity checks
  const connectedMaze = maze.map(row => [...row]);

  // Find all path tiles
  const pathTiles = [];
  for (let y = 0; y < connectedMaze.length; y++) {
    for (let x = 0; x < connectedMaze[y].length; x++) {
      if (connectedMaze[y][x] === 0) {
        pathTiles.push({ x, y });
      }
    }
  }

  // Check connectivity using flood fill
  const visited = new Set();
  const queue = [pathTiles[0]]; // Start from the first path tile

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    visited.add(`${x},${y}`);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < connectedMaze[0].length &&
        ny >= 0 && ny < connectedMaze.length &&
        connectedMaze[ny][nx] === 0 &&
        !visited.has(`${nx},${ny}`)
      ) {
        queue.push({ x: nx, y: ny });
      }
    }
  }

  // If not all path tiles are visited, connect them
  if (visited.size < pathTiles.length) {
    for (const { x, y } of pathTiles) {
      if (!visited.has(`${x},${y}`)) {
        // Find the nearest connected path tile
        const nearestConnected = findNearestConnectedTile(connectedMaze, x, y, visited);

        if (nearestConnected) {
          // Carve a path between the disconnected tile and the nearest connected tile
          carvePath(maze, x, y, nearestConnected.x, nearestConnected.y);
        }
      }
    }
  }
}

function findNearestConnectedTile(maze, startX, startY, visited) {
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  const queue = [[startX, startY, []]]; // [x, y, path]
  const localVisited = new Set();
  localVisited.add(`${startX},${startY}`);

  while (queue.length > 0) {
    const [x, y, path] = queue.shift();

    // Check if this tile is connected
    if (visited.has(`${x},${y}`)) {
      return { x, y, path };
    }

    // Explore neighboring tiles
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < maze[0].length &&
        ny >= 0 && ny < maze.length &&
        maze[ny][nx] === 0 &&
        !localVisited.has(`${nx},${ny}`)
      ) {
        localVisited.add(`${nx},${ny}`);
        queue.push([nx, ny, [...path, [dx, dy]]]);
      }
    }
  }

  return null; // No connected tile found
}

function carvePath(maze, startX, startY, endX, endY) {
  let x = startX;
  let y = startY;

  while (x !== endX || y !== endY) {
    const dx = Math.sign(endX - x);
    const dy = Math.sign(endY - y);

    if (dx !== 0 && maze[y][x + dx] === 1) {
      maze[y][x + dx] = 0; // Carve a path horizontally
      x += dx;
    } else if (dy !== 0 && maze[y + dy][x] === 1) {
      maze[y + dy][x] = 0; // Carve a path vertically
      y += dy;
    } else {
      break; // Stop if no further carving is possible
    }
  }
}

function findValidNPCPosition(maze) {
  const validPositions = [];

  // Find all valid path tiles
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 0) { // Path tile
        validPositions.push({ x, y });
      }
    }
  }

  // Return a random valid position
  return Phaser.Utils.Array.GetRandom(validPositions);
}
function showGameOverDialogue() {
  // Create a background box
  const boxWidth = 400;
  const boxHeight = 200;
  const boxX = (config.width - boxWidth) / 2;
  const boxY = (config.height - boxHeight) / 2;

  const backgroundBox = this.add.graphics();
  backgroundBox.fillStyle(0x333333, 0.8); // Dark gray with 80% opacity
  backgroundBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 16); // Rounded corners

  // Add game over text
  const gameOverText = this.add.text(config.width / 2, boxY + 50, 'Thy Journey Hath Ended', {
    fontFamily: 'Arial',
    fontSize: '32px',
    color: '#FFFFFF',
    fontStyle: 'bold',
  }).setOrigin(0.5, 0.5);

  // Add instructions text
  const instructionsText = this.add.text(config.width / 2, boxY + 100, 'Thy score hath fallen below zero. Wouldst thou try again?', {
    fontFamily: 'Arial',
    fontSize: '18px',
    color: '#FFFFFF',
    align: 'center',
    wordWrap: { width: boxWidth - 40 }, // Wrap text within the box
  }).setOrigin(0.5, 0.5);

  // Add restart button
  const restartButton = this.add.text(config.width / 2, boxY + 150, 'Restart Game', {
    fontFamily: 'Arial',
    fontSize: '24px',
    color: '#FFFFFF',
    backgroundColor: '#555555', // Button background color
    padding: { x: 20, y: 10 }, // Add padding to the button
  }).setOrigin(0.5, 0.5).setInteractive();
  backgroundBox.setDepth(3);
  restartButton.setDepth(3);
  instructionsText.setDepth(3);
  gameOverText.setDepth(3);
  // Add button hover effect
  restartButton.on('pointerover', () => {
    restartButton.setBackgroundColor('#777777'); // Change background color on hover
  });

  restartButton.on('pointerout', () => {
    restartButton.setBackgroundColor('#555555'); // Reset background color
  });
  // Handle button click
  restartButton.on('pointerdown', () => {
    // Restart the game
    npcsEncountered_e = 0;
    npcsEncountered_g = 0;
    exit_score = 0;
    lives = 3;
    backgroundBox.destroy();
    gameOverText.destroy();
    instructionsText.destroy();
    restartButton.destroy();
    initializeGame.call(this);
  });
  
}

const config = {
  type: Phaser.AUTO,
  width: 1300+80,
  height: 638,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
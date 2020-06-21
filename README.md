# Asteroid_JS
## Play It
To play the Game Simply clone the repository and place the Asteroids folder in the Webroot of your local server, then open your browser and on the search bar write "localhost/Asteroids". The game should start/
## Intro
My Version of the Classic Asteroid Game using Phaser 3

![image](Asteroids/Screens/Screen1.png)

The Game runs on the Brower and adapts to the different screen sizes but aspect ratio of the Game Screen remains 1:1.

Controls:-<br/>
![image](Asteroids/Screens/Screen4.png)<br/>
The Game is played using Arrow Keys:<br/>
Up Arrow - thrust in facing direction<br/>
Left Arrow - rotate left<br/>
Right Arrow - rotate right<br/>
Back Arrow - Shoot<br/>

The control scheme was decided as such to allow players to play with just one hand as well as hinder shooting while moving, thereby making the game somewhat more difficuult.

## Gameplay
The Game consists of a Menu, a Gameplay scene and an ending scene.

On first Play the player is required to enter their pseudonym to start playing and getting their score recorded.

![image](Asteroids/Screens/Screen2.png)

There are three types of enemies:
1) Small Asteroids - Normal enemy
2) Large Asteroids - Break into two small asteroids on getting destroyed
3) Enemy Spaceship - Hits the player to reduce speed and score.<br/>

![image](Asteroids/Screens/Screen3.png)
![image](Asteroids/assets/spaceship1.png)

## Powerups
There are 3 types of Powerups Available:<br/>
1) Star : Increases Player Speed<br/>
2) Bomb : Increases Bullet Burst Speed<br/>
3) Rage : Enters RageMode<br/>

![image](Asteroids/assets/star.png)
![image](Asteroids/assets/bomb.png)
![image](Asteroids/assets/RageSphere.png)


## Core Gameplay

![image](Asteroids/Screens/Screen5.png)

Although the project is complete, some gameplay parameters like playerspeed and enemy ship speed have not yet been tweaked to provide an optimum experience.
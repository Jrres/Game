const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = screen.width
canvas.height = screen.height

let level = 1;

let animId

let isEnemy = false; 
function Partition(data){
const Map = [] 

  for(let i =0 ; i< data.length;i+=64){
    Map.push(data.slice(i,i+64))
  }
  return Map;
}
const collisionsDataMap = Partition(collisionsData)
const charactersMap = Partition(charactersMapData)
const chestsMap = Partition(chestsData)
const doorsMap = Partition(doorData)
const enemyDataMap  = Partition(enemiesData)

const collisionsDataMap1 = Partition(collisionsData1)
const chestsMap1 = Partition(chestsData1)
const doorsMap1 = Partition(doorData1)

const offset1 = {
  x: -900,
  y: -3300
}
//level 2
const offset2 = {
  x: -1200,
  y: -1500
}

function CreateEnemies(Map, offset, image){
  const enemies  = [] 
  let tag = 0;
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 504)
        enemies.push(
          new Enemy({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            },
            velocity:5,
            image:image,
            frames: {
              max:4,
              hold:60
            },
            animate:false,
            name:"monster"+tag++,
            health:50
          })
        )
    })
  })
  return enemies 
}

const mob1 = new Image()
mob1.src = "img/monster.png"

let enemies;
let enemy;

//takes the collisions map
function CreateBoundaries(Map,offset){
  const boundaries = []
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 34 || symbol === 386)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
    })
  })
  return boundaries;
}
let boundaries;


//takes the chracters map , image array  
function CreateCharacters(Map,images,offset){
  const characters = []
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      // 1026 === villager
      if (symbol === 1321) {
        characters.push(
          new Character({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y-150
            },
            image: images[0],
            frames: {
              max: 5,
              hold: 60
            },
            scale: .5,
            animate: true,
            dialogue: ['...', 'Hey wake up!', 'Are you lost?','  This isnt a good place to lose your bearing explorer.',' If you keep moving up the dungeon, you will find a way out. ',' Go unlock that chest uphead and get in gear. There are some dangerous enemies crawling around this place. Good luck '],
            hasInteracted : false
          })
        )
      }
      // 1031 === oldMan
      else if (symbol === 1031) {
        characters.push(
          new Character({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            },
            image: images[1],
            frames: {
              max: 4,
              hold: 60
            },
            scale: 3,
            dialogue: ['My bones hurt.'],

          })
        )
      }
    })
  })
  return characters
}
const wizard = new Image()
wizard.src="img/wizard.png"

const oldmanImg = new Image()
oldmanImg.src= "img/oldMan/Idle.png"

const charImgs = [wizard,oldmanImg]

let characters;


//takes the chest Map , chest Image , loot image array
function CreateChests ( Map , chest, items,offset) {
  const chestObj = []
  Map.forEach((row,i)=>{
    row.forEach((symbol,j)=>{
      if(symbol === 596 || symbol === 660){
        chestObj.push(
          new Chest({
            position:{
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            },frames:{
              max:3,
              hold: 60, 
            },
            image:chest,
            animate:false,
            loot:new Loot({
              position:{
              x: j * Loot.width + offset.x,
              y: i * Loot.height + offset.y
            },
            image:items
            })
          })
        )
      }
    })
  })
  return chestObj
}

//fill with items
let items = []

let numitems = Math.floor(Math.random()*9)+1;

while(numitems>0){
  let val = Math.floor(Math.random()*12)+1;

  let ImageItem = new Image();
  ImageItem.src = AllItems[val].src;
  items.push(ImageItem);
  numitems--;
}



//{i,j}= id
const chest = new Image()
chest.src =  " img/chest.png"

let chestObj;


function CreateDoors(Map , offset){
const doors = []
let count =1;
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1443 || symbol == 418)
        doors.push(
          new Door({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            },
            number: count++
          })
        )
    })
  })
  return doors;
}
let doors;

const image = new Image()
image.src = './img/level1.jpg'
const image2 = new Image()
image2.src = './img/level2.jpg'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'


let inv= new Array(8)


let player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  },
  inventory:inv,
  name: "player",
  enterDoor : {
    
    onComplete : ()=>{
      gsap.to(overlay,{
        opacity:0,
        onComplete: ()=>{
          level++;
          Levels[level].init() 
          gsap.to(overlay,{
            opacity:1
          })
        }
      })
    }
  }
})

let background; 



const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  e:{
    pressed: false 
  },
  i:{
    pressed: false
  },
  space:{
    pressed: false
  }
}

//onEnemy is called after a collision detectiong from event listener
const isClick = {
  onEnemy:()=>{ 
    enemy.TakeDamage();
    
    console.log(enemy.name)
  },
  ShowHealth:()=>{
    enemy.ShowHealth()
    enemy.AnimateLoss();
  },
  on : false
}

var movables = []
var renderables = [] 
let Levels = {
  1: {
    init: ()=>{
      background =new Sprite({
        position: {
          x: offset1.x,
          y: offset1.y
        },
        image: image
      })
      doors =CreateDoors(doorsMap,offset1)
      chestObj = CreateChests(chestsMap,chest,items,offset1)
      boundaries =CreateBoundaries(collisionsDataMap, offset1)
      characters = CreateCharacters(charactersMap,charImgs,offset1 )

      movables = [
        background,
        ...chestObj,
        ...boundaries,
        ...characters,
        ...doors
      ]
      renderables = [
        background,
        ...chestObj,
        ...boundaries,
        ...characters,
        ...doors,
        player,
      ]
    }
  },
  2:{
    init: ()=>{
      background =new Sprite({
        position: {
          x: offset2.x,
          y: offset2.y
        },
        image: image2
      })
      enemies = CreateEnemies(enemyDataMap,offset2,mob1)
      doors =CreateDoors(doorsMap1,offset2)
      chestObj = CreateChests(chestsMap1,chest,items,offset2)
      boundaries =CreateBoundaries(collisionsDataMap1, offset2)
      characters = CreateCharacters(charactersMap,charImgs,offset2 )

      isEnemy=true;
      
       movables = [
        background,
        ...chestObj,
        ...boundaries,
        ...characters,
        ...doors,
        ...enemies,
      ]
      renderables = [
        background,
        ...chestObj,
        ...boundaries,
        ...characters,
        ...doors,
        player,
        ...enemies
      ]
      
    }
  }
}
Levels[level].init()

const battle = {
  initiated: false
}

let overlay = {
  opacity : 1
}


const Timer = (event, interval = 0) => {
  let last = 0;
  let total = 0;
  return {
      set interval(newInterval)
      {
          interval = newInterval;
      },
      update(time = 0) {
          total += time - last;
          if (total >= interval) {
              event(this);
              total = 0;
          }
          last = time;
      }
  };
};

const fooLogger = Timer((timer) => {

  timer.interval = 1000 + Math.floor(Math.random() * 1000);

}, 1500);

function animate(time) {
fooLogger.update(time)
animId = window.requestAnimationFrame(animate)


renderables.forEach((renderable) => {
    renderable.draw()
  })

  let moving = true
  player.animate = false

  canvas.style.opacity = overlay.opacity
  // activate a battle

  if( isEnemy){

    for(let i =0 ; i<enemies.length;i++){
      const enemy = enemies[i]
      if(inRange({
        player:player,
        enemy:enemy
      })){
        enemy.follow(player)
        enemy.animate = true; 
      }
      if(rectangularCollision(
      {rectangle1:player,
      rectangle2:enemy})){
        
      //attack after every second
      //enemy.attack(player)
      }
    }
  }
  
  if(keys.i.pressed){
    player.showInventory();
   let c
    for(const item in player.showItem){
      let it = player.inventory.values();
      if(item){

        c =new Sprite({
          position:player.position,
          velocity:player.velocity,
          image:it,
          frames:{
            max:1,
            hold:0
          },
          scale:3
        })
        break;
      }
      it.next();
    }
    c.draw();
  }
  if(keys.e.pressed && checkForChestCollision({
    r1:chestObj,r2:player
  }) ){
    
    const ch = getChest()
    if(ch != null ){
       ch.animate = true;
      ch.showContent()
      ch.loot.key()
      for(let x in ch.loot.KeyNum){
        
        if(ch.loot.KeyNum[x]){
          //2 interactables either put on character or put in inventory
          let obj = ch.key(player)
          LootAction(renderables,player,obj)
          
        }
      }
    }
  }

  if(keys.e.pressed){
    for (let i = 0; i < doors.length; i++) {
      const door = doors[i]
      if(rectangularCollision({
        rectangle1:player,
        rectangle2:{...door
      }
      })){
        player.enter.onComplete();
        
        //change level
      }
    }
  }
  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: 3 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 7
      })
  } else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = player.sprites.left

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 7
      })
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: -3 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 7
      })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 }
    })

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 7
      })
  }

  if(player.interactionAsset && !player.interactionAsset.hasInteracted){
    let movingText = document.createElement("span")
    movingText.setAttribute("id","movableText")
    movingText.innerHTML = "press space to continue"
    window.cancelAnimationFrame( animId)
    document.querySelector("#CharacterDialogueBox").style.display = "flex"
    document.querySelector("#CharacterDialogueBox").append(movingText)
    dialogue()
  }
  if(isClick.on){
    
    isClick.ShowHealth()
  } 



}
// animate()

let lastKey = ''

window.addEventListener('keydown', (e) => {

  switch (e.key) {
    case ' ':
      if(player.interactionAsset.dialogueIndex>player.interactionAsset.dialogue.length-1 ){
        reset()
      }
      if(document.querySelector("#CharacterDialogueBox").hasChildNodes())
      document.querySelector("#CharacterDialogueBox").removeChild(document.querySelector("#CharacterDialogueBox").lastChild);
      let movingText = document.createElement("span")
      movingText.setAttribute("id","movableText")
      movingText.innerHTML = player.interactionAsset.dialogue[player.interactionAsset.dialogueIndex++];
      document.querySelector("#CharacterDialogueBox").append(movingText)
      break
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
    case 'e':
      keys.e.pressed = true;
      lastKey='e'
      break;
    case 'i':
      keys.i.pressed = true;
      lastKey='i'
      break;
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'e':
      keys.e.pressed = false;
      break;
    case 'i':
      keys.i.pressed = false;
      break;
    case ' ':
      keys.space.pressed = false;
      lastKey = ' '
      break;
  }
})
window.addEventListener('click',(e)=>{
  //add enemy hit collision
  let hit= {
    position:{
      x:e.x,
      y:e.y
    },
    width:player.width,
    height:player.height
  }
  for(let i =0 ; i< enemies.length;i++){
    //enemy is global to set the current enemy
    enemy =enemies[i];
    //need to return after interacting with enemy to set the proper enemy
    if(rectangularCollision({
      rectangle1:hit,
      rectangle2:enemy
    })){
      isClick.onEnemy();
      isClick.on = true;
      return 
    }
  }
})
let clicked = false
// addEventListener('click', () => {
//   if (!clicked) {
//     audio.Map.play()
//     clicked = true
//   }
// })

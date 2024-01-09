
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = screen.width
canvas.height = screen.height


let level = 1;
let currLoot;
let animId
let running = false;
let hasEnter = false
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

const collisionsDataMap2 = Partition(collisions3)
const enemyDataMap2 = Partition(enemiesData2)
const doorsMap2 = Partition(doorsData3)
const gatesMap = Partition(gates)
const chestsMap2 = Partition(chestData2)

const offset1 = {
  x: -900,
  y: -3300
}
//level 2
const offset2 = {
  x: -1200,
  y: -1500
}

const offset3 = {
  x: -1330,
  y:-1200
}
function createGates(Map,image,offset,width,height){
  const gate = []
  Map.forEach((row,i)=>{
    row.forEach((symbol,j)=>{
      if(symbol===178){
        gate.push(new Sprite({
          position:{
            x: j * width + offset.x,
              y: i * height + offset.y
          },
          image:image,
          frames: {
            max:3,
            hold:20
          },
          animate:true,

        }))
      }
    })
  })
  return gate
}
function CreateEnemies(Map, offset, image,width,height){
  const enemies  = [] 
  let tag = 0;
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 504 || symbol === 386)
        enemies.push(
          new Enemy({
            position: {
              x: j * width + offset.x,
              y: i * height + offset.y
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
function CreateBoundaries(Map,offset,width,height){
  const boundaries = []
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 34 || symbol === 386 || symbol === 231)
        boundaries.push(
          new Boundary({
            position: {
              x: j * width + offset.x,
              y: i * height + offset.y
            }
          })
        )
    })
  })
  return boundaries;
}
let boundaries;


//takes the chracters map , image array  
function CreateCharacters(Map,images,offset,width,height){
  const characters = []
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      // 1026 === villager
      if (symbol === 1321) {
        characters.push(
          new Character({
            position: {
              x: j * width + offset.x,
              y: i * height + offset.y-150
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
              x: j * width + offset.x,
              y: i * height + offset.y
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
function CreateChests ( Map , chest, items,offset,width,height) {
  const chestObj = []
  Map.forEach((row,i)=>{
    row.forEach((symbol,j)=>{
      if(symbol === 596 || symbol === 660 || symbol === 1255){
        chestObj.push(
          new Chest({
            position:{
              x: j * width + offset.x,
              y: i * height + offset.y
            },frames:{
              max:3,
              hold: 60, 
            },
            image:chest,
            animate:false,
            loot:new Loot({
              position:{
              x: j * width + offset.x,
              y: i * height + offset.y
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
  ImageItem.id= AllItems[val].type;
  items.push(ImageItem);
  numitems--;
}



//{i,j}= id
const chest = new Image()
chest.src =  " img/chest.png"

let chestObj;


function CreateDoors(Map , offset,width,height){
const doors = []
let count =1;
  Map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1443 || symbol == 418 || symbol ===451)
        doors.push(
          new Door({
            position: {
              x: j * width + offset.x,
              y: i * height + offset.y
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
const image3 = new Image()
image3.src = "./img/level3.jpg"

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
          
          Levels[level+1].init() 
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
  },
  ShowHealth:()=>{
    enemy.ShowHealth()
    
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
      doors =CreateDoors(doorsMap,offset1,Boundary.width,Boundary.height)
      chestObj = CreateChests(chestsMap,chest,items,offset1,Loot.width,Loot.height)
      boundaries =CreateBoundaries(collisionsDataMap, offset1,Boundary.width,Boundary.height)
      characters = CreateCharacters(charactersMap,charImgs,offset1,Boundary.width,Boundary.height )
      isEnemy=false
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
      hasEnter=false;
    }
  },
  2:{
    init: ()=>{
      level++
      background =new Sprite({
        position: {
          x: offset2.x,
          y: offset2.y
        },
        image: image2
      })
      enemies = CreateEnemies(enemyDataMap,offset2,mob1,Boundary.width,Boundary.height)
      doors =CreateDoors(doorsMap1,offset2,Boundary.width,Boundary.height)
      chestObj = CreateChests(chestsMap1,chest,items,offset2,Loot.width,Loot.height)
      boundaries =CreateBoundaries(collisionsDataMap1, offset2,Boundary.width,Boundary.height)
      characters = CreateCharacters(charactersMap,charImgs,offset2,Boundary.width,Boundary.height )

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
        ...enemies,
      ]
      if(currLoot){
        renderables.push(currLoot)
      }

      hasEnter=false;
    }
  },
  3:{
    init: ()=>{
      level++
      background =new Sprite({
        position: {
          x: offset3.x,
          y: offset3.y
        },
        image: image3,
        scale:.5
      })
      const gateimg = new Image()
      gateimg.src = "./img/gate.png"
      enemies = CreateEnemies(enemyDataMap2,offset3,mob1,Boundary.width,Boundary.height)
      doors =CreateDoors(doorsMap2,offset3,Boundary.width,Boundary.height)
      chestObj =[ new Sprite({position:{
        x:-1428,
        y:-1732
      },
      image:chest,
      inventory:items,
      frames:{
        max:3,
        hold:60
      }
    })]
      boundaries =CreateBoundaries(collisionsDataMap2, offset3,Boundary.width,Boundary.height)
      let gate = createGates(gatesMap,gateimg,offset3,Boundary.width,Boundary.height)
      isEnemy=true;
      
      console.log(gate)
       movables = [
        background,
        ...chestObj,
        ...boundaries,
        ...doors,
        ...enemies,
    
      ]
      renderables = [
        background,
        ...chestObj,
        ...boundaries,
        ...doors,
        player,
        ...enemies,
        ...gate
      ]
      if(currLoot){
        renderables.push(currLoot)
      }
      hasEnter=false;
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
var slash;
var isSlash=false;
var lastTime;
var requiredElapsed = 1000 / 5; // desired interval is 10fps
var counts=0
var inCombat = false

var timeToAttack=0
let heartimage = new Image()
    heartimage.src="./img/heart2.png"

    let heart = new Sprite({
      position:{
        x:player.position.x,
        y:player.position.y
      },
      image:heartimage,
      frames:{
        max:5,
        hold:10
      },
      name:"heart"
    })
function isFollow(enemies){
  for(let x = 0 ; x<enemies.length;x++){
    if(enemies[x].following)
    return true
  }
  return false;
}
function animate(time) {
  
  animId = window.requestAnimationFrame(animate)
  if (!lastTime) { lastTime = time; }
  var elapsed = time - lastTime;
  if(!isNaN(elapsed))
  timeToAttack+=elapsed

  console.log(background.position)
  if (elapsed > requiredElapsed) {
      // do stuff
      lastTime = time;
  }
renderables.forEach((renderable) => {
    renderable.draw()
  })

  let moving = true
  player.animate = false
  player.ShowHealth()


  canvas.style.opacity = overlay.opacity
  // heal player below 80 health
  let temp = heart.position
  if(player.health<=80){
    //time to start healing
    counts+=elapsed
    if(counts>=2000 &&!inCombat){
      heart.animate=true
      heart.draw()
      heart.position=temp;
      let r = 5 * Math.sqrt(Math.random())
      let theta = Math.random() * 2 * Math.PI
      heart.position.x = heart.position.x + r * Math.cos(theta)
      heart.position.y = heart.position.y + r * Math.sin(theta)
    }
    if (counts>=5000 && !inCombat ){
      player.health+=10
      counts=0
      heart.animate=true
      heart.draw()
      heart.position=temp;
      let r = 5 * Math.sqrt(Math.random())
      let theta = Math.random() * 2 * Math.PI
      heart.position.x = heart.position.x + r * Math.cos(theta)
      heart.position.y = heart.position.y + r * Math.sin(theta)

      
    }
  }
  //slash animation
  if(isSlash){
    slash.draw()
    counts+=elapsed
    if(counts>=5000){
      isSlash=false;
      counts=0
    }
  }
  if(player.kill){
    let deathimg = new Image()
    deathimg.src = "./img/death.png"
    c.font="20px arial"
    c.fillText("You died",player.position.x,player.position.y,200)
    player = new Sprite({
      position:player.position,
      image:deathimg
    })
    renderables.filter(val=>val!=player)
    renderables.push(player)
  }
  if(isEnemy && enemies.length==0)
  isEnemy=false;
  if(isEnemy){
    for(let i =0 ; i<enemies.length;i++){
      const enemy = enemies[i]

   
      if(enemy.health<=0){
        renderables = renderables.filter((val)=>val!=enemy)
        movables = movables.filter((val)=>val!=enemy)
        enemies = enemies.filter(v=>v!=enemy)
      }
      if(inRange({
        player:player,
        enemy:enemy
      })){
        enemy.follow(player)
        enemy.animate = true; 
        enemy.following = true;
        if(timeToAttack>=15000){
          enemy.attack(player)
          timeToAttack=0
          
        }
      } 
      else{
        inCombat=false;
      }
      if(!isFollow(enemies)){

        inCombat=false;
      }
      else{
        inCombat=true;
      }
    }
  }else{
    inCombat=false;

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
    console.log("Col")
    const ch = getChest()
    if(ch != null ){
       ch.animate = true;
      ch.showContent()
      ch.loot.key()
      for(let x in ch.loot.KeyNum){
        
        if(ch.loot.KeyNum[x]){
          //2 interactables either put on character or put in inventory
    
      
          let num = 0;
          if(x=="one")
          num=0
          if(x=="two")
          num=1
          if(x=="three")
          num=2
      
          var itemfromchest;
         
          if(items[num].id==="boots"){
          itemfromchest= new Sprite({
            position:{
              x:player.position.x,
              y:player.position.y+50
            },
            image:ch.loot.image[num],
            name:"item",
            scale:1
          })
        }
        else if(items[num].id=="chest"){
          itemfromchest= new Sprite({
            position:{
              x:player.position.x,
              y:player.position.y
            },
            image:ch.loot.image[num],
            name:"item",
            scale:1
          })
        }
        else if(items[num].id=="helm"){
          itemfromchest= new Sprite({
            position:{
              x:player.position.x,
              y:player.position.y-50
            },
            image:ch.loot.image[num],
            name:"item",
            scale:1
          })
        }
        else if(items[num].id=="glove"){
        itemfromchest= new Sprite({
          position:{
            x:player.position.x+50,
            y:player.position.y
          },
          image:ch.loot.image[num],
          name:"item",
          scale:1
        })
      }
          renderables.push(itemfromchest)
          currLoot = itemfromchest
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
      }) && !hasEnter){

        player.enter.onComplete();
        hasEnter=true
        break
        //change level
      }
    }
  }
  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up
    if(characters)
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
    if(characters)
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
    if(characters)
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
    if(characters)
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
canvas.addEventListener('click',(e)=>{

  //add sword animation
  isSlash=true
  let slashimg1 = new Image()
  slashimg1.src= "./img/slash/s.png"
  let slashimg2 = new Image()
  slashimg2.src= "./img/slash/s2.png"
  let slashimg3 = new Image()
  slashimg3.src= "./img/slash/s3.png"
  let slashimg4 = new Image()
  slashimg4.src= "./img/slash/s4.png"
  let slashimg5 = new Image()
  slashimg5.src= "./img/slash/s5.png"
  slash = new Sprite({
    position:{x:e.x-60,y:e.y-190},
    image:slashimg1,
    frames:{
      max:6,
      hold:10
    },
    sprites:{
      first:slashimg1,
      second:slashimg2,
      third:slashimg3,
      fourth:slashimg4,
      fifth:slashimg5
    },animate:true,
    scale:.7
  })
  

  //add enemy hit collision
  let hit= {
    position:{
      x:e.x,
      y:e.y
    },
    width:player.width,
    height:player.height
  }
  if(enemies)
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
      enemy.knockback()
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
let cont = document.getElementsByClassName("container")[0]
let root = document.getElementsByClassName("btn-group-vertical d-flex justify-content-center")[0]
let btn = document.createElement("button")
btn.append(document.createTextNode("Start playing"))
btn.className="btn btn-primary"
btn.addEventListener("click",()=>{
animate()
cont.remove()

})
root.append(btn)
let btn1 = document.createElement("button")
btn1.append(document.createTextNode("Continue"))
btn1.className="btn btn-primary"
root.append(btn1)
let btn2 = document.createElement("button")
btn2.append(document.createTextNode("Settings"))
btn2.className="btn btn-primary"
root.append(btn2)

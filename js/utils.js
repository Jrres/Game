

function inRange ({player, enemy}){
  var a = player.position.x - enemy.position.x;
  var b = player.position.y - enemy.position.y;

  var c = Math.sqrt( a*a + b*b );
  if( c < 250 )
  return true;
  else 
  return false;
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function checkForCharacterCollision({
  characters,
  player,
  characterOffset = { x: 0, y: 0 }
}) {
  player.interactionAsset = null
  // monitor for character collision
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...character,
          position: {
            x: character.position.x + characterOffset.x,
            y: character.position.y + characterOffset.y
          }
        }
      })
    ) {
      player.interactionAsset = character
      break
    }
  }
}
let openedChest;
function checkForChestCollision({
  r1,r2
}){

  for(let i =0;i<r1.length;i++){
    const chest = r1[i];
    if(rectangularCollision({
      rectangle1:r2,
      rectangle2:{...chest}
    })){
    openedChest=chest
 
    return true
    }
  }
  return false;
}

function getChest(){
  return openedChest
}

function ConvertToNum(word){
  switch(word){
    case "one":
      return 0
      case "two":
      return 1
      case "three":
      return 2
      case "four":
      return 3
      case "five":
      return 4
      case "six":
      return 5
      case "seven":
      return 6
      case "eight":
      return 7
      case "nine": 
      return 8
  }
}

function LootAction(renderables, player, item){
  cancelAnimationFrame(battleAnimationId)
  let div = document.querySelector('#playerHealthBar')
  div.style.width = '100%'
  div.style.display = "block"
  let button1 = document.createElement("button")
  button1.innerHTML = "Add To Inventory"
  let button2 = document.createElement("button")
  button2.innerHTML = "Equip"

  div.append(button1)
  div.append(button2)

  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      if(e.currentTarget.innerHTML == "Add To Inventory"){
        player.inv.push(item)
      }else{
        renderables.push(item)
      }
    })
  })

}
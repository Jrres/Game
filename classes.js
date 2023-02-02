class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    inventory,
    name,
    enterDoor
  }) {
    this.enter = enterDoor;
    this.name = name
    this.position = position
    this.image = new Image()
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * scale
      this.height = this.image.height * scale
    }
    this.image.src = image.src
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1

    this.rotation = rotation
    this.scale = scale
    this.inventory = inventory
    this.showItem = {
      item1: false,
      item2: false,
      item3: false
    }
    this.weapon
    this.child
    //this.health = 100

  }
  setWeaponName(str) {
    this.weapon = str;
  }
  setWeaponItem(spr) {
    this.child = spr
  }
  getWeaponItem() {
    return this.child
  }
  showInventory() {
    let width = 50
    let height = 50
    let y = 400
    let offset = 500
    let x = 100;
    for (let i = 0; i < this.inventory.length; i++) {

      // if inventory has item show it else skip it
      c.drawImage(this.inventory[0], i * x, y, width, height)
    }
  }
  draw() {
    c.save()
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    c.rotate(this.rotation)
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    c.globalAlpha = this.opacity

    const crop = {
      position: {
        x: this.frames.val * (this.width / this.scale),
        y: 0
      },
      width: this.image.width / this.frames.max,
      height: this.image.height
    }

    const image = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: this.image.width / this.frames.max,
      height: this.image.height
    }

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
    )

    c.restore()

    if (!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
  attack({ attack, renderedSprites, clickpos }) {
    console.log(attack)
    switch (attack) {
      case "sword":
        let attackAnim = new Image();
        attackAnim.src = "./img/fireball.png"

        const c = new Sprite({
          position: {
            x: clickpos.x,
            y: clickpos.y
          },
          velocity: this.velocity,
          image: attackAnim,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          scale: 1,
          name: "  animation"
        })
        setInterval(() => {

        })
        renderedSprites.push(c);
        console.log(c.name)
        setInterval(() => {
          if (renderedSprites.includes(c))
            renderedSprites.pop()
          return
        }, 1000)
        break;

    }


  }
}

class Monster extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
  }

  faint() {
    document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
    audio.battle.stop()
    audio.victory.play()
  }


}
class Enemy extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    animate = false,
    rotation = 0,
    scale = 1,
    loot,
    name,
    health

  }) {
    super({
      position,
      velocity,
      image,
      frames,
      animate,
      rotation,
      scale
    })
    this.position = position
    this.attacks = ["AA", "fire"]
    this.health=health
    this.name=name;
  }
  ShowHealth(){

        c.globalAlpha=1
        c.fillStyle="black"
        c.fillRect(30,55,55,20)
        c.fillStyle = "white"
        c.font = "bold 20px serif";
        c.fillText(this.name,100,50)
        c.fillStyle="red"
        c.fillRect(30,50,this.health,20)
    // gsap.to({
    //   oncomplete:()=>{
    //     gsap.to({
         
    //     })

    //   }
    // })
  }
  TakeDamage(){
    console.log(this.health)
    if(this.health>0)
    this.health-=5;
    else{
      return
    }
  }
  AnimateLoss(){
    
    c.fillStyle="red"
    let g = {
      opacity:0
    }
    let time = new Date();
    console.log(time.getSeconds())
    gsap.to(g,{
      opacity: .5,
      onComplete:()=>{
        gsap.to(g,{
          opacity : 0,
          onComplete:()=>{
            c.globalAlpha=g.opacity;  
          }
        })
      }
    })
    c.fillRect(this.position.x,this.position.y,88,88);
   
    //knockback enemy
    // gsap.to({
    //   onComplete:()=>{
    //     this.position.x-=10;

    //   }
    // }
    // )
  }
  follow(player) {
    let Vy = player.position.y - this.position.y
    let Vx = player.position.x - this.position.x
    Vy *= .05
    Vx *= .05
    this.position.x += Vx
    this.position.y += Vy
  }
  attack(player) {


    let attack = this.attacks[Math.floor(Math.random() * 2)]
    switch (attack) {
      case "AA": {
        player.health -= 2;
        console.log(player.health)
      }
      case "fire": {
        player.health -= 5;
        c.fillText = player.health
      }
    }
  }
}
class Boundary {//scaled 2 times
  static width = 88
  static height = 88
  constructor({ position }) {
    this.position = position
    this.width = 88
    this.height = 88
  }

  draw() {
    // c.fillStyle = 'rgba(255, 0, 0, 1)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
//image needs to be array of images to put into chest
//chest width and height
//num rows cols
class Loot {
  static width = 88
  static height = 88;
  constructor({
    position, image
  }) {
    this.position = position
    this.width = 88
    this.height = 88
    this.rows = 3
    this.cols = 3
    this.image = image;
    this.isOpen = false;
    this.KeyNum = {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false,
      seven: false,
      eight: false,
      nine: false,

    }
    //console.log(this.keyNum[0])

  }
  draw() {

  }
  key() {

    window.addEventListener('keydown', e => {
      //when a slot is clicked in inventory (each inv slot has a pos ), add the item in that slot to char

      switch (e.key) {

        case "1":
          this.KeyNum.one = true;
        case "2":
          this.KeyNum.two = true;
        case "3":
          this.KeyNum.three = true;
        case "4":
          this.KeyNum.four = true;
        case "5":
          this.KeyNum.five = true;
        case "6":
          this.KeyNum.six = true;
        case "7":
          this.KeyNum.seven = true;
        case "8":
          this.KeyNum.eight = true;
        case "9":
          this.KeyNum.nine = true;
      }
    })
  }

}
class Door extends Boundary {
  constructor({
    position,
    number
  }) {
    super({ position })
    this.number = number;
  }

}
class Chest extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    loot
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale,
    })
    this.loot = loot;
  }
  showContent() {
    c.fillStyle = 'rgba(255,255, 0, 1)'
    for (let i = 0; i <= this.rows; i++) {
      for (let j = 0; j <= this.cols; j++) {
        c.fillRect(this.position.x + (50 * j), this.position.y + (50 * i), 200, 200)
      }
    }
    console.log(this.loot.image)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let curr = i * 3 + j;
        let image = this.loot.image[curr];
        if (curr >= this.loot.image.length)
          break
        else
          c.drawImage(image, 0, 0, image.width, image.height, this.position.x + j * 100, this.position.y + i * 100, 75, 75)
      }
    }

  }
  key(player) {
    for (let x in this.loot.KeyNum) {

      if (this.loot.KeyNum[x]) {

        let num = ConvertToNum(x)
        return new Sprite(
          {
            position: {
              x: player.position.x,
              y: player.position.y
            },
            image: this.loot.image[num]
          }
        )
      }
    }
  }

}
class Character extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    dialogue = [''],
    inventory
  }) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale,
      inventory
    })

    this.dialogue = dialogue
    this.dialogueIndex = 0
  }
}

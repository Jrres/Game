const backDia = new Image()
backDia.src ="./img/battleBackground.png"
let cutsceneimage= new Image()
cutsceneimage.src="./img/wizard.png"


let bg = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image:backDia,
    scale:5
})
let wz = new Sprite({
    position: {
        x: 500,
        y: -200
    },
    image:cutsceneimage,
    scale: 2,
    frames:{
        max:5,
        hold:60
    },
    animate:true
})

function dialogue(){
    
    gsap.to('#overlappingDiv', {
        opacity: 1,
        onComplete: () => {
    
          gsap.to('#overlappingDiv', {
            opacity: 0,
            onComplete:()=>{
                bg.draw()
                wz.draw()
                
            }
          })
        }
    })

}
function reset(){
    document.querySelector("#CharacterDialogueBox").style.display = "none"
    bg = null;
    wz=null;
    player.interactionAsset.hasInteracted = true;
    window.requestAnimationFrame(animate)
}
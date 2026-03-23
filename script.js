const game = new Object

    game.time = 0
    game.level = 1
    game.lives = 20
    game.gold = 100
    game.score = 0

    game.grid = 1
    game.mute = 0
    game.pause = 0

    game.enemies = []
    game.weapons = []


function drawGrid(){
    const grid =  document.querySelector('#grid')
    grid.innerHTML = ''
    for(let y=0; y<10; y++){
        const line = document.createElement('div')
        line.className = 'line-path'
        grid.appendChild(line)
        for(let x=0; x<13; x++){
            const cel = document.createElement('div')
            cel.className = 'cel-path'
            cel.id = `cel-${y}-${x}`
            line.appendChild(cel)
        }
    }

}

document.querySelector('#btn-grid').addEventListener('click',()=>{
    game.grid = !game.grid
    if(game.grid){
        document.querySelector('#grid').classList.add('grid')
        document.querySelector('#btn-grid').innerHTML = 'NO GRID'
    }else{
        document.querySelector('#grid').classList.remove('grid')
        document.querySelector('#btn-grid').innerHTML = 'GRID'
    }
})

/*
document.querySelector('#grid').addEventListener('mousemove',(e)=>{
    const bounds = e.target.getBoundingClientRect();
    const x = Math.floor((e.x - Math.floor(bounds.left) -15)/25.6)
    const y = Math.floor((e.y - Math.floor(bounds.top)  -15)/25.6)
    if(x>=0 && x<13 && y>=0 && y<10){
        console.log(x,y)

    }
})
*/


drawGrid()
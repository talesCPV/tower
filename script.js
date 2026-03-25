const game = new Object

    game.clock = setInterval(()=>{
        if(!game.pause && game.scroll < 4098 ){
            game.count++
            game.scroll +=0.026
            document.querySelector('.bottom').scrollTo(game.scroll,0)

            if(game.count >= 100){
                game.count=0
                game.time--
                game.time < 0 ? nextLevel() : null                
                game.time = game.time < 0 ? 0 : game.time
            }
        }else{
            game.pause = 1
            document.querySelector('#btn-start').innerHTML = 'START' 
        }
        score()
    }, 10);


    async function loadData() {
        const response = await fetch("data.json");
        const json = await response.json();
        game.weapons = json.weapons
        game.enemies = json.enemies
        reset()
    }

function reset(){
    game.time = 30
    game.level = 1
    game.lives = 20
    game.gold = 100
    game.score = 0

    game.count=0

    game.grid = 1
    game.mute = 0
    game.pause = 1

    game.scroll = 0

//    game.enemies = []
//    game.weapons = []
    game.board = []
    document.querySelector('.bottom').scrollTo(0,0)

    score()

    const grid =  document.querySelector('#grid')
    grid.innerHTML = ''
    for(let y=0; y<10; y++){
        const line = document.createElement('div')
        line.className = 'line-path'
        grid.appendChild(line)
        game.board.push([])
        for(let x=0; x<13; x++){
            const cel = document.createElement('div')
            cel.className = 'cel-path'
            cel.id = `cel-${y}-${x}`
            line.appendChild(cel)
            const obj = new Object
            obj.weapom = 0
            obj.level = 0
            game.board[game.board.length-1].push(obj)
        }
    }

    // Enemies

    const bottom = document.querySelector('.bottom')
    bottom.innerHTML = ''
    let j=0


    function newSquare(id,i){
        const square = document.createElement('div')
        square.className = 'enemy-square'
        square.classList.add(id)

        const num = document.createElement('p')
        num.className = 'square-num'
        num.innerHTML = i
        square.appendChild(num)

        const name = document.createElement('p')
        name.className = 'square-name'
        name.innerHTML = id
        square.appendChild(name)
        return square
    }

    for(let i=1; i<=50; i++){
        bottom.appendChild(newSquare(game.enemies[j].name,i))
        j = j<game.enemies.length-1 ? j+1 : 0
    }
    const last_square = newSquare('teste',0)
    last_square.classList.add('last-square')
    last_square.innerHTML = ''
    bottom.appendChild(last_square)
}

function nextLevel(){
    if(game.level < 50 ){
        game.level ++
        game.time=30
        const next_level = game.scroll +(82 - + (game.scroll % 82))
        game.scroll = next_level
        score()
    }
}

function score(){
    try{
        document.querySelector('.time').innerHTML = `Time:${game.time.toString().padStart(2,0)}`
        document.querySelector('.level').innerHTML = `Level:${game.level.toString().padStart(2,0)}`
        document.querySelector('.lives').innerHTML = `Lives:${game.lives.toString().padStart(2,0)}`
        document.querySelector('.gold').innerHTML = `Gold:${game.gold}`
        document.querySelector('.score').innerHTML = `Score:${game.score}`
        document.querySelector('.bottom').scrollTo(game.scroll,0)
    }catch{null}

}

function showArea(set=1){
    if(set){
        document.querySelector('#grid').classList.add('arm')
    }else{
        document.querySelector('#grid').classList.remove('arm')
    }
}

function showWeapon(wp=0,pos=null){    

    if(pos==null){
        showArea()
        console.log(game.weapons[wp])
        const speed = game.weapons[wp][0].speed
        const spd_name = speed > 4 ? 'very slow' : speed < 2 ? 'fast' : speed==2 ? 'average' : 'slow' 
        document.querySelector('#panel-2').classList.add('hide')
        document.querySelector('.sell').classList.add('hide')

        document.querySelector('#panel-1').querySelector('.title').innerHTML = game.weapons[wp][0].name
        document.querySelector('#panel-1').querySelector('.about').innerHTML = game.weapons[wp][0].about
        document.querySelector('#panel-1').querySelector('.coast').innerHTML = game.weapons[wp][0].coast
        document.querySelector('#panel-1').querySelector('.damage').innerHTML = game.weapons[wp][0].damage
        document.querySelector('#panel-1').querySelector('.range').innerHTML = game.weapons[wp][0].range
        document.querySelector('#panel-1').querySelector('.speed').innerHTML = spd_name

    }else{
        document.querySelector('.sell').classList.remove('hide')
        document.querySelector('#panel-2').classList.remove('hide')
    }    

}

document.querySelector('#btn-start').addEventListener('click',()=>{
    game.pause = !game.pause
    document.querySelector('#btn-start').innerHTML = game.pause ? 'START' : 'PAUSE'
})

document.querySelector('#btn-reset').addEventListener('click',()=>{
    reset()
})

document.querySelector('#btn-next').addEventListener('click',()=>{
    nextLevel()
})

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

    loadData()

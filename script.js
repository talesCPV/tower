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
    game.board = []


    async function loadData() {
        const response = await fetch("data.json");
        const json = await response.json();
        game.weapons = json.weapons
        game.enemies = json.enemies
    }

function drawGrid(){
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
        document.querySelector('#panel-2').classList.add('hide')
        console.log(game.weapons[wp])

        document.querySelector('#panel-1').querySelector('.title').innerHTML = game.weapons[wp][0].name
        document.querySelector('#panel-1').querySelector('.about').innerHTML = game.weapons[wp][0].about
        document.querySelector('#panel-1').querySelector('.coast').innerHTML = game.weapons[wp][0].coast
        document.querySelector('#panel-1').querySelector('.damage').innerHTML = game.weapons[wp][0].damage
        document.querySelector('#panel-1').querySelector('.range').innerHTML = game.weapons[wp][0].range
        document.querySelector('#panel-1').querySelector('.speed').innerHTML = game.weapons[wp][0].speed



    }else{
        document.querySelector('#panel-2').classList.remove('hide')
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

loadData()
drawGrid()
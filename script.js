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

    function drawWeapom(id_wep,ang){

        const cnv = document.createElement('canvas')

        cnv.width = 100
        cnv.height = 100

        const base = new Image()
        base.src = 'assets/w_base.png'
        base.height = base.width

        const arm = new Image()
        arm.src = `assets/w${id_wep}_cannon.png`

        const angle = ang +35
        const offset = 0
        const l = arm.width
        const h = arm.height
        const offset_ang = ((Math.atan2(l/2, h/2) * 180) / Math.PI) + 90
        const scale =  cnv.width / base.width

        const center = [offset+l/2,offset+h/2]
        const raio = Math.sqrt(Math.pow(l/2,2)+Math.pow(h/2,2))
        const sin = Number((Math.sin(Math.PI/180 * angle)).toFixed(2))
        const cos = Number((Math.cos(Math.PI/180 * angle)).toFixed(2))
        const cord = [center[0]+raio*cos, center[1]+raio*sin]

//console.log(l,h,base.width,base.height)

        if (cnv.getContext) {
            ctx = cnv.getContext('2d');
            ctx.clearRect(0, 0, cnv.width, cnv.height)
            ctx.save();
            ctx.scale(scale,scale)
            ctx.drawImage(base,offset,offset, base.width, base.height)
            ctx.translate(cord[0]+((base.width-l)/2),cord[1]+((base.height-h)/2));
            ctx.rotate(Math.PI / 180 * (angle + offset_ang))
//            ctx.strokeRect(0,0, l, h)
            ctx.drawImage(arm,0,0, l,h);
            ctx.restore(); 
        }

        return cnv
    }

function reset(){
    game.time = 30
    game.level = 1
    game.lives = 20
    game.gold = 1000
    game.score = 0

    game.count=0

    game.grid = 1
    game.mute = 0
    game.pause = 1

    game.scroll = 0

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
            cel.addEventListener('click',(e)=>{
                if(e.target.parentNode.parentNode.classList.contains('arm') && !game.board[y][x].coast){
                    const weapom = document.querySelector('#panel-1').weapom
                    if(game.gold >= weapom.coast){
                        game.gold -= weapom.coast
                        game.board[y][x] = weapom 
                        const cel = document.querySelector(`#cel-${y}-${x}`)
                        cel.innerHTML = ''
                        cel.appendChild(drawWeapom(weapom.id+1,weapom.angle))

                    }
                    console.log(weapom)
    
                }
            })
            line.appendChild(cel)
            const obj = new Object
            obj.about = ''
            obj.coast = 0
            obj.damage = 0
            obj.id = 0
            obj.name = ''
            obj.range = 0
            obj.sell = 0
            obj.speed = 0
            obj.upgrade = ""
            obj.level = 0
            obj.angle = 0
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

        document.querySelector('#panel-1').weapom = game.weapons[wp][0]
        document.querySelector('#panel-1').weapom.id  = wp
        document.querySelector('#panel-1').weapom.level = 0
        document.querySelector('#panel-1').weapom.angle = 0

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

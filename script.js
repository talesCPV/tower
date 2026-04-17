
class Enemy{
    constructor(id_en=0, force=1){
        this.id = id_en
        this.name = game.db.enemies[id_en].name
        this.background = game.db.enemies[id_en].background
        this.flying = game.db.enemies[id_en].flying
        this.imune = game.db.enemies[id_en].imune
        this.health = game.db.enemies[id_en].health * force
        this.speed = game.db.enemies[id_en].speed
        this.angle = 0
        this.x = -10
        this.y = 150
    }
}

Enemy.prototype.move = function(){

}

class Weapom{
    constructor(id_wep=0,x,y){
        this.id = id_wep
        this.name = game.db.weapons[id_wep][0].name
        this.about = game.db.weapons[id_wep][0].about
        this.upgrade = game.db.weapons[id_wep][0].upgrade
        this.coast = game.db.weapons[id_wep][0].coast
        this.damage = game.db.weapons[id_wep][0].damage
        this.speed = game.db.weapons[id_wep][0].speed
        this.range = game.db.weapons[id_wep][0].range
        this.sell = game.db.weapons[id_wep][0].sell
        this.angle = 0
        this.level = 0
        this.x = x
        this.y = y
    }
}

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
        game.db = new Object
        game.db.weapons = json.weapons
        game.db.enemies = json.enemies
        reset()
    }

    function showArm(){
        const cnv = document.querySelector('#war-field')
        function drawWeapom(wep){

            const base = new Image()
            base.src = 'assets/w_base.png'
            base.height = base.width

            const arm = new Image()
            arm.src = `assets/w${wep.id+1}_cannon.png`

            arm.onload= ()=>{
                const scale =  [cnv.width/13,cnv.height/10]
                const offset = [(scale[1]/2) * wep.pivot[0],(scale[0]/2) * wep.pivot[1]]
    
                const l = arm.width*0.5
                const h = arm.height*0.5
                const angle = wep.angle + 225
    
                const center = [offset[1]+scale[0]/2,offset[0]+scale[1]/2]
                const raio = Math.sqrt(Math.pow(l/2,2)+Math.pow(h/2,2))
                const sin = Number((Math.sin(Math.PI/180 * angle)).toFixed(2))
                const cos = Number((Math.cos(Math.PI/180 * angle)).toFixed(2))
                const cord = [center[0]+raio*cos, center[1]+raio*sin]
        
                if (cnv.getContext) {
                    ctx = cnv.getContext('2d');
                    ctx.drawImage(base,offset[1],offset[0], scale[0], scale[1])
                    ctx.save();
                    ctx.translate(cord[0],cord[1]);
//                    ctx.clearRect(0, 0, l,h)
                    ctx.rotate(Math.PI / 180 * (angle + 135))
                    ctx.drawImage(arm,0,0, l, h);
                    ctx.restore(); 
                }
            }          
        }

        for(let i=0; i<game.weapons.length; i++){
            drawWeapom(game.weapons[i])
        }
    }
/*
    function showRange(cel=null){
        const range = document.querySelectorAll('.raio')
        for(let i=0; i<range.length; i++){
            range[i].classList.remove('raio')
        }
        if(cel!=null){
            document.documentElement.style.setProperty('--range', `${cel.weapom.range*2.5}px`);
            cel.classList.add('raio')
        }
    }
*/
/*
    function showEnemies(){

        function drawEnemy(id_enemy){

            const cnv = document.createElement('canvas')
    
            cnv.width = 100
            cnv.height = 100
    
            const enemy = new Image()
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
    
            if (cnv.getContext) {
                ctx = cnv.getContext('2d');
                ctx.clearRect(0, 0, cnv.width, cnv.height)
                ctx.save();
                ctx.scale(scale,scale)
                ctx.drawImage(base,offset,offset, base.width, base.height)
                ctx.translate(cord[0]+((base.width-l)/2),cord[1]+((base.height-h)/2));
                ctx.rotate(Math.PI / 180 * (angle + offset_ang))
                ctx.drawImage(arm,0,0, l,h);
                ctx.restore(); 
            }
    
            return cnv
        }

    }
*/
function reset(){
    game.time = 30
    game.level = 1
    game.lives = 20
    game.gold = 1000
    game.score = 0
    game.pivot = 0

    game.count=0

    game.grid = 1
    game.mute = 0
    game.pause = 1

    game.scroll = 0

    game.enemies = []
    game.weapons = []
    game.board = []
    document.querySelector('.bottom').scrollTo(0,0)

    score()

    for(let y=0; y<20; y++){
        game.board.push([])
        for(let x=0; x<26; x++){
            const obj = new Object
            obj.id = -1
            obj.level = 0
            obj.pivot = [0,0]
            obj.index = -1
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
        bottom.appendChild(newSquare(game.db.enemies[j].name,i))
        j = j<game.db.enemies.length-1 ? j+1 : 0
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

function spaw(id_en,qtd,force=1){

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

function showPanel(wep){

    function draw(id,obj){
        const speed = obj.speed > 4 ? 'very slow' : obj.speed < 2 ? 'fast' : obj.speed==2 ? 'average' : 'slow'
        obj.cel = wep.cel

        document.querySelector(`#panel-${id}`).classList.remove('hide')
        document.querySelector(`#panel-${id}`).weapom = obj
        document.querySelector(`#panel-${id}`).querySelector('.btn-upgd').classList.remove('hide')
        document.querySelector(`#panel-${id}`).querySelector('.title').innerHTML = obj.name
        document.querySelector(`#panel-${id}`).querySelector('.about').innerHTML = obj.about
        document.querySelector(`#panel-${id}`).querySelector('.coast').innerHTML = obj.coast
        document.querySelector(`#panel-${id}`).querySelector('.damage').innerHTML = obj.damage
        document.querySelector(`#panel-${id}`).querySelector('.range').innerHTML = obj.range
        document.querySelector(`#panel-${id}`).querySelector('.speed').innerHTML = speed
        document.querySelector(`#panel-${id}`).querySelector('.btn-upgd').innerHTML = id==1 ? `Sell for ${obj.sell}` : 'Upgrade'
    }

    draw(1,game.db.weapons[wep.id][wep.level])
    draw(2,game.db.weapons[wep.id][wep.level+1])
}

function showWeapon(wp=0){
    game.pivot = 0
    const wep = game.db.weapons[wp][0]
    wep.id = wp
    wep.level = 0
    wep.angle = 0

    showPanel(wep)

    document.querySelector('#panel-2').classList.add('hide')
    document.querySelector('.sell').classList.add('hide')
    document.querySelector('#arm').classList.remove('hide')
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

document.querySelector('.sell').addEventListener('click',(e)=>{
    if(confirm('Do you really wanna sell it?')){
        const wep = e.target.parentNode.weapom
        game.gold += wep.sell
        game.weapons.splice(wep.index,1) 
        document.querySelector(`#cel-${wep.y}-${wep.x}`).innerHTML = ''
        showArm()
    }
})

document.querySelector('.buy').addEventListener('click',(e)=>{
    buy(game.pivot)
})

function buy(obj){
    const weapom = game.board[obj.fill[0][1]][obj.fill[0][0]]
    const wep_id = obj.has ?weapom.id:0
    const next_level = !obj.has ? 0 : weapom.level+1 >= game.db.weapons[wep_id].length ? -1 : weapom.level+1
   
    if(next_level >=0){
        const wep = new Object
        if(obj.has){
            game.weapons[weapom.index].level = next_level
            weapom.level = next_level
        }else{
            wep.id = document.querySelector('#panel-1').weapom.id
            wep.pivot = [obj.fill[0][1],obj.fill[0][0]]
            wep.pivot[0] -= game.board[obj.fill[0][1]][obj.fill[0][0]].pivot[0] 
            wep.pivot[1] -= game.board[obj.fill[0][1]][obj.fill[0][0]].pivot[1] 
            const cel = game.board[wep.pivot[0]][wep.pivot[1]]
            wep.level = cel.level
            wep.angle = 0

            for(let i=0; i<4; i++){
                const cel = game.board[wep.pivot[0]+(i%2)][wep.pivot[1]+(i<2?0:1)]
                cel.id = wep.id
                cel.level = wep.level
                cel.pivot = [i%2,i<2?0:1]
                cel.index = wep.level ? cel.index : game.weapons.length                
            }
            game.weapons.push(wep)
        }
/*
        if(game.gold >= next_wepom.coast){
            game.gold -= next_wepom.coast

        }
*/            
    }



    showArm()
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

function ghost(obj){
    const cnv = document.querySelector('#arm')
    const square = [cnv.width/13,cnv.height/10]
    const pos = [square[0]/2*obj.fill[0][0],square[1]/2*obj.fill[0][1]]
    if (cnv.getContext) {
        ctx = cnv.getContext('2d');
        ctx.clearRect(0, 0, cnv.width, cnv.height)
        if(obj.x>=0 && obj.x<arm.offsetWidth && obj.y>=0 && obj.y<arm.offsetHeight && !obj.has){            
            ctx.save();
            ctx.fillStyle = '#76fb096f';
            ctx.fillRect(pos[0],pos[1],square[0],square[1])
            ctx.restore(); 
        }
    }    
}

function setPosition(obj){
    game.pivot = [obj.fill[0][1],obj.fill[0][0]]
    const nw = game.board[obj.fill[0][1]][obj.fill[0][0]].id < 0
    if(nw){
        buy(obj)
    }else{
        const wep_index = game.board[obj.fill[0][1]][obj.fill[0][0]].index
        const board = game.board[game.weapons[wep_index].pivot[0]][game.weapons[wep_index].pivot[1]]
        board.cel = [game.weapons[wep_index].pivot][0]
        showPanel(board)
    }
}

function getPosition(e){
    const obj = new Object
    const cnv = e.target
    const bounds = e.target.getBoundingClientRect();
    obj.x = Math.floor((e.x - Math.floor(bounds.left) )) 
    obj.y = Math.floor((e.y - Math.floor(bounds.top))) 
    let pos = [Math.floor(obj.x/(cnv.clientWidth/26)),Math.floor(obj.y/(cnv.clientHeight/20))]
    pos[0] = pos[0]>24 ? 24 : pos[0]
    pos[1] = pos[1]>18 ? 18 : pos[1]
    obj.fill = [[pos[0],pos[1]],[pos[0],pos[1]+1],[pos[0]+1,pos[1]],[pos[0]+1,pos[1]+1]]
    obj.has = 0
    for(let i=0; i<4; i++){
        obj.has = obj.has ? 1 : game.board[obj.fill[i][1]][obj.fill[i][0]].id >=0
    }
    return obj
}

document.querySelector('#arm').addEventListener('mousemove',(e)=>{
    ghost(getPosition(e))
})

document.querySelector('#arm').addEventListener('click',(e)=>{
    setPosition(getPosition(e))
    document.querySelector('#arm').classList.add('hide')
})

document.querySelector('#war-field').addEventListener('click',(e)=>{

    const pivot = getPosition(e)
    const cel = game.board[pivot.fill[0][1]][pivot.fill[0][0]]
    if(cel.id<0){
        game.pivot = 0
        document.querySelector('#panel-1').classList.add('hide')
        document.querySelector('#panel-2').classList.add('hide')
    }else{
        game.pivot = pivot
        const board = game.board[pivot.fill[0][1]][pivot.fill[0][0]]
        board.cel = [pivot.fill[0][1]-cel.pivot[0],pivot.fill[0][0]-cel.pivot[1]]
        showPanel(board)
    }
})

loadData()

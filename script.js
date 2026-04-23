
class Enemy{
    constructor(id_en=0, health=1, direct = 'h'){
        this.id = id_en
        this.name = game.db.enemies[id_en].name
        this.background = game.db.enemies[id_en].background
        this.flying = game.db.enemies[id_en].flying
        this.imune = game.db.enemies[id_en].imune
        this.health = game.db.enemies[id_en].health * health
        this.speed = game.db.enemies[id_en].speed * 0.1
        this.angle = 0
        this.direct = direct
        this.kill = 0

        this.offset_y = 30
        this.offset_x = 40
        this.line_h = 14.2    
        this.line_w = 12.7

        if(direct == 'h'){
            this.x = -10 - Math.floor(Math.random()*50)
            this.y = this.offset_y + Math.floor((Math.random()*6) + 7) * this.line_h
        }else{
            this.x = this.offset_x + Math.floor((Math.random()*8) + 9) * this.line_w
            this.y = -10 - Math.floor(Math.random()*50)
        }


        this.sprite = new Image()
        this.sprite.src = `assets/en_${this.name.toLowerCase()}.png`
    }
}

Enemy.prototype.plot = function(){

        const cnv = document.querySelector('#enemies-field')
        const scale = 0.7
        const l = this.sprite.width*scale
        const h = this.sprite.height*scale
        const offset_ang = ((Math.atan2(l/2, h/2) * 180) / Math.PI) + 90
        const angle = this.angle + 225

        const center = [this.x+l/2,this.y+h/2]
        const raio = Math.sqrt(Math.pow(l/2,2)+Math.pow(h/2,2))
        const sin = Number((Math.sin(Math.PI/180 * angle)).toFixed(2))
        const cos = Number((Math.cos(Math.PI/180 * angle)).toFixed(2))
        const cord = [center[0]+raio*cos, center[1]+raio*sin]

        if (cnv.getContext) {
            ctx = cnv.getContext('2d');
            ctx.save();
            ctx.translate(cord[0]+((this.sprite.width-l)/2),cord[1]+(h/2));
            ctx.rotate(Math.PI / 180 * (angle + offset_ang))
            ctx.drawImage(this.sprite,0,0, l, h);
            ctx.restore(); 
        }
}

Enemy.prototype.move = function(){
    if(this.direct == 'h'){
        this.x += this.speed
        this.kill = this.x >= this.offset_x + 26*this.line_w ? 1 : 0
        this.angle = 0
    }else{
        this.y += this.speed
        this.kill = this.y >= this.offset_y + 20*this.line_h ? 1 : 0
        this.angle = 90
    }
    this.plot()
}

class Weapom{
    constructor(y,x,id_wep){
        this.name = ''
        this.id = id_wep
        this.level = 0
        this.pivot = [y,x]
        this.angle = 0
        this.range = 0
        this.speed = 0
        this.sell = 0
        this.damage = 0
        this.loading = 0
        this.bullets = []
        this.refresh()
        this.base = new Image()
        this.base.src = 'assets/w_base.png'
        this.base.height = this.base.width
    }
}

Weapom.prototype.refresh = function(){
    const wep = game.db.weapons[this.id][this.level]
    this.name = wep.name
    this.range = wep.range
    this.speed = wep.speed
    this.damage = wep.damage
    this.sell = wep.sell
    game.gold -= !this.level ? wep.coast : 0
    this.plot()
}

Weapom.prototype.upgrade = function(){
    if(!this.loading){
        const wep = game.db.weapons[this.id]
        if(this.level >= wep.length -1){
            this.level = wep.length -1
        }else if(wep[this.level+1].coast <= game.gold){
            game.gold -= wep[this.level+1].coast            
            this.level++
            game.board[this.pivot[0]][this.pivot[1]].level = this.level
            game.begin ? this.load() : null
            this.refresh()
        }
    }
}

Weapom.prototype.plot = function(){

    const arm = new Image()
    arm.src = `assets/w${this.id+1}_cannon.png`

    arm.onload= ()=>{
        const cnv = document.querySelector('#war-field')
        const scale =  [cnv.width/13,cnv.height/10]
        const offset = [(scale[1]/2) * this.pivot[0],(scale[0]/2) * this.pivot[1]]

        const l = arm.width*0.7
        const h = arm.height*0.7
        const angle = this.angle + 225

        const center = [offset[1]+scale[0]/2,offset[0]+scale[1]/2]
        const raio = Math.sqrt(Math.pow(l/2,2)+Math.pow(h/2,2))
        const sin = Number((Math.sin(Math.PI/180 * angle)).toFixed(2))
        const cos = Number((Math.cos(Math.PI/180 * angle)).toFixed(2))
        const cord = [center[0]+raio*cos, center[1]+raio*sin]

        if (cnv.getContext) {
            ctx = cnv.getContext('2d');
            ctx.clearRect(offset[1],offset[0], scale[0], scale[1])
            ctx.drawImage(this.base,offset[1],offset[0], scale[0], scale[1])
            ctx.fillStyle = '#a40300'
            for(let i=0; i<this.level; i++){
                ctx.fillRect(offset[1]+(i*4.5)+2,offset[0] + scale[1]-5, 3, 2);
            }
            ctx.save();
            ctx.translate(cord[0],cord[1]);
            ctx.rotate(Math.PI / 180 * (angle + 135))
            ctx.drawImage(arm,0,0, l, h);
            ctx.restore(); 
        }
    } 
}

Weapom.prototype.load = function(){
    this.loading = this.level * 10
    this.timer = setInterval(()=>{
        const cnv = document.querySelector('#war-field')
        const scale =  [cnv.width/13,cnv.height/10]
        const offset = [(scale[1]/2) * this.pivot[0],(scale[0]/2) * this.pivot[1]]
        const w = scale[0]/(this.level * 10)*(this.level * 10 - this.loading)

        if (cnv.getContext) {
            ctx = cnv.getContext('2d');
            ctx.clearRect(offset[1],offset[0], scale[0], scale[1])
            ctx.drawImage(this.base,offset[1],offset[0], scale[0], scale[1])
            ctx.fillStyle = '#fe9900'
            ctx.fillRect(offset[1]+4,offset[0]+scale[1]/2 , w-4, 2);
        }
        this.loading--
        if(this.loading<=0){
            clearInterval(this.timer)
            showAll()
        }

    }, this.level * 50);

}

class Bullet{
    constructor(y,x,force,speed,angle){
        this.pivot = [y,x]
        this.angle = angle
        this.force = force
        this.speed = speed
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
        plotEnemies()

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
    game.db.waves = json.waves
    reset()
}

function showAll(){ 
    const cnv = document.querySelector('#war-field')
    if (cnv.getContext) {
        ctx = cnv.getContext('2d');
        ctx.clearRect(0,0,cnv.width,cnv.height)
    }

    for(let i=0; i<game.weapons.length; i++){
        game.weapons[i].plot()
    }

    showRange()
}

function teste(){
    game.enemies.push(new Enemy(1)) 
    game.enemies[0].x = 40
    game.enemies[0].y = 30
    game.enemies[0].plot()
}

function plotEnemies(){
    const cnv = document.querySelector('#enemies-field')
    if (cnv.getContext) {
        ctx = cnv.getContext('2d');
        ctx.clearRect(0,0,cnv.width,cnv.height)
    }

    for(let i=0; i<game.enemies.length; i++){
        game.enemies[i].move()
        if(game.enemies[i].kill){
            game.enemies.splice(i,1)
            game.lives--
        }
    }
}

function showRange(){
    if(game.pivot){
        const range = game.weapons[game.board[game.pivot.fill[0][1]][game.pivot.fill[0][0]].index].range
        const cnv = document.querySelector('#war-field')
        const scale =  [cnv.width/13,cnv.height/10]
        const offset = [(scale[1]/2) * game.pivot.fill[0][1],(scale[0]/2) * game.pivot.fill[0][0]]
        if (cnv.getContext) {
            ctx = cnv.getContext('2d')
            ctx.fillStyle = '#0000002b'
            ctx.beginPath();
            ctx.arc(offset[1]+scale[0]/2,offset[0]+scale[1]/2, range, 0, 2*Math.PI);
            ctx.fill();
        }
    }
}

function reset(){
    game.time = 30
    game.level = 1
    game.lives = 20
    game.gold = 1000
    game.score = 0
    game.pivot = 0
    game.begin = 0

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

    for(let i=0; i<game.db.waves.length; i++){
        bottom.appendChild(newSquare(game.db.enemies[game.db.waves[i].id_enemy].name,i+1))
    }
    const last_square = newSquare('teste',0)
    last_square.classList.add('last-square')
    last_square.innerHTML = ''
    bottom.appendChild(last_square)
}

function nextLevel(){
    if(game.level < game.db.waves.length ){
        game.level ++
        game.time=30
        const next_level = game.scroll +(82 - + (game.scroll % 82))
        game.scroll = next_level
        score()
        newWave()
    }
}

function newWave(){
    const nextWave = game.db.waves[game.level-1]
    for(let i=0; i<nextWave.qtd; i++){
        game.enemies.push(new Enemy(nextWave.id_enemy,nextWave.health,i%2?'h':'v'))
    }
    console.log(nextWave)
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
        if(obj != undefined){
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
        }else{
            document.querySelector(`#panel-${id}`).classList.add('hide')
        }
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

function buy(obj){
    if(!game.begin || !game.pause){
        const pivot = [obj.fill[0][1],obj.fill[0][0]]
        const weapom = game.board[pivot[0]][pivot[1]]
        const wep_id = obj.has ?weapom.id:0
        const next_level = !obj.has ? 0 : weapom.level+1 >= game.db.weapons[wep_id].length ? -1 : weapom.level+1
       
        if(next_level >=0){
            if(obj.has){
                game.weapons[weapom.index].upgrade()
                showPanel(game.weapons[weapom.index])
            }else{
                const wep = new Weapom(pivot[0],pivot[1],document.querySelector('#panel-1').weapom.id)
                for(let i=0; i<4; i++){
                    const cel = game.board[wep.pivot[0]+(i%2)][wep.pivot[1]+(i<2?0:1)]
                    cel.id = wep.id
                    cel.level = wep.level
                    cel.pivot = [i%2,i<2?0:1]
                    cel.index = wep.level ? cel.index : game.weapons.length                
                }
                game.weapons.push(wep)
                obj.has = 1
                game.weapons[game.weapons.length-1].plot()            
                showPanel(game.weapons[game.weapons.length-1])
            }
            showAll()
        }
    }
}

function sell(obj){
    const pivot = [obj.fill[0][1],obj.fill[0][0]]
    const cel = game.board[pivot[0]][pivot[1]]
    const wep = game.weapons[cel.index]

    game.gold += wep.sell
    game.weapons.splice(cel.index,1)

    for(let i=0; i<4;i++){
        const cel = game.board[pivot[0]+(i%2)][pivot[1]+(i<2?0:1)]
        cel.id = -1
        cel.index = -1
        cel.level = 0 
        cel.pivot = [0,0]
    }

    for(let i=0; i<game.weapons.length; i++){
        game.board[game.weapons[i].pivot[0]][game.weapons[i].pivot[1]].index = i
        game.board[game.weapons[i].pivot[0]][game.weapons[i].pivot[1]+1].index = i
        game.board[game.weapons[i].pivot[0]+1][game.weapons[i].pivot[1]].index = i
        game.board[game.weapons[i].pivot[0]+1][game.weapons[i].pivot[1]+1].index = i
    }
    game.pivot = 0
    document.querySelector('#panel-1').classList.add('hide')
    document.querySelector('#panel-2').classList.add('hide')

    showAll()
}

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

function setPosition(e){
    game.pivot = getPosition(e)
    const nw = game.board[game.pivot.fill[0][1]][game.pivot.fill[0][0]].id < 0
    if(nw){
        buy(game.pivot)
    }else{
        const wep_index = game.board[game.pivot.fill[0][1]][game.pivot.fill[0][0]].index
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
    const pivot = game.board[obj.fill[0][1]][obj.fill[0][0]].pivot
    for(let i=0; i<4; i++){
        obj.has = obj.has ? 1 : game.board[obj.fill[i][1]][obj.fill[i][0]].id >=0
        if(obj.has){
            obj.fill[i][0] -= pivot[1]
            obj.fill[i][1] -= pivot[0]            
        }
    }

    return obj
}

document.querySelector('#btn-start').addEventListener('click',()=>{
    game.pause = !game.pause
    !game.begin ? newWave() : null
    game.begin = 1
    document.querySelector('#btn-start').innerHTML = game.pause ? 'START' : 'PAUSE'
})

document.querySelector('#btn-reset').addEventListener('click',()=>{
    reset()
})

document.querySelector('#btn-next').addEventListener('click',()=>{
    nextLevel()
})

document.querySelector('.sell').addEventListener('click',()=>{
    if(confirm('Do you really wanna sell it?')){
        sell(game.pivot)
    }
})

document.querySelector('.buy').addEventListener('click',(e)=>{
    buy(game.pivot)
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

document.querySelector('#arm').addEventListener('mousemove',(e)=>{
    ghost(getPosition(e))
})

document.querySelector('#arm').addEventListener('click',(e)=>{
    setPosition(e)
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
        const wep = game.db.weapons[board.id][board.level]
        wep.id = board.id
        wep.level = board.level
        showPanel(wep)
    }
    showAll()

})

loadData()

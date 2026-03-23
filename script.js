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
    document.querySelector('.grid').style.display = game.grid ? 'block' : 'none'
}



document.querySelector('#btn-grid').addEventListener('click',()=>{
    game.grid = !game.grid
    drawGrid()
    document.querySelector('#btn-grid').innerHTML = game.grid ? 'NO GRID' : 'GRID'
})
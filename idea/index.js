const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const gravity = 0.2

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.attackBox = {
            position: {
                x: this.position.x, y: this.position.y,
            }, offset, width: 100, height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        if (this.isAttacking) {
            ctx.fillStyle = 'green'
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height,
            )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        if (this.position.y + this.height + this.velocity.y > canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
    position: {
        x: 0, y: 0,
    }, velocity: {
        x: 0, y: 0,
    }, offset: {
        x: 0, y: 0,
    }
})

const enemy = new Sprite({
    position: {
        x: 974, y: 0,
    }, velocity: {
        x: 0, y: 0,
    }, color: 'blue', offset: {
        x: -50, y: 0,
    }
})

const key = {
    a: {
        pressed: false
    }, d: {
        pressed: false
    }, ArrowLeft: {
        pressed: false
    }, ArrowRight: {
        pressed: false
    }, j: {
        pressed: false
    }

}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <=
        rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }

}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    console.log('go')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    if (key.a.pressed) {
        player.velocity.x = -5
    } else if (key.d.pressed) {
        player.velocity.x = 5
    }
    if (key.ArrowLeft.pressed) {
        enemy.velocity.x = -5
    } else if (key.ArrowRight.pressed) {
        enemy.velocity.x = 5
    }

    if (rectangularCollision({
        rectangle1: player, rectangle2: enemy,
    }) && player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    if (rectangularCollision({
        rectangle1: enemy, rectangle2: player,
    }) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }

}


animate()

window.addEventListener('keydown', (event) => {
    console.log(event)
    switch (event.key) {
        case 'd':
            key.d.pressed = true
            break;
        case 'a':
            key.a.pressed = true
            break;
        case 'w':
            player.velocity.y = -10
            break;
        case ' ':
            player.attack()
            break

        case 'ArrowDown':
            enemy.attack()
            break

        case 'ArrowLeft':
            key.ArrowLeft.pressed = true
            break;
        case 'ArrowRight':
            key.ArrowRight.pressed = true
            break;
        case 'ArrowUp':
            enemy.velocity.y = -10
            break;
    }

})

window.addEventListener('keyup', (event) => {
    console.log(event)
    switch (event.key) {
        case 'd':
            key.d.pressed = false
            break;
        case 'a':
            key.a.pressed = false
            break;
        case 'ArrowLeft':
            key.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            key.ArrowRight.pressed = false
            break;
    }
})

class Plane {
    constructor(props) {
        this.props = props;

        this.init();
    }
    init = () => {
        const { src, id } = this.props;
        this.plane = document.createElement('img');
        this.plane.src = src;
        this.plane.style.position = 'absolute';
        document.getElementById(id).appendChild(this.plane);
    }

    place = (x = 0, y = 0) => {
        this.plane.style.left = x + 'px';
        this.plane.style.top = y + 'px';
    }
}

class Enemyplane extends Plane {
    constructor(props) {
        super(props);
        this.move();
    }

    move = () => {
        this.place(200, 50);
    }
}

class PlayerPlane extends Plane {
    constructor(props) {
        super(props);
        this.place(10, 50);
    }
}

class Game {
    constructor(props) {
        this.props = props;
        this.init();
    }

    init = () => {
        this.bindEvent();
    }

    startGame = () => {
        const { id, playerPlaneImg } = this.props;
        new PlayerPlane({
            id,
            src: playerPlaneImg
        });
        this.enemyplaneFactory();
    }

    bindEvent = () => {
        const { id } = this.props;
        document.querySelector(`#${id} .startBtn`).addEventListener('click', () => {
            this.startGame();
        })
    }

    enemyplaneFactory = () => {
        const { id, enemyplaneImg } = this.props;
        this.setInterval = setInterval(() => {
            new Enemyplane({
                id,
                src: enemyplaneImg
            });
        }, 2000)
    }
}

new Game({
    id: 'main',
    enemyplaneImg: 'images/enemy1_fly_1.png',
    playerPlaneImg: 'images/myplane.gif',
});
/* ----------------------------模型开始-------------------------------------------- */

/* 飞机的公用属性，用于敌方飞机和我方飞机继承 */
let upStatus = false;
let downStatus = false;
let leftStatus = false;
let rightStatus = false;
let playerPlane;
//所有敌方小飞机数组
let enemyArray = [];
//所有子弹数组
let bulletArray = [];
/* 接口 */
class Plane {
    constructor(props) {
        this.props = props;
        this.props.uuid = `plane${new Date().getTime()}`;
        this.mainDiv = document.getElementById(`${this.props.id}`);
        this.mainHeight = this.mainDiv.offsetHeight; //main的高度
        this.mainWidth = this.mainDiv.offsetWidth; //main的宽度
        // this.mainLeft = this.mainDiv.offsetLeft; //当前main盒子距离左边
        this.mainTop = this.mainDiv.offsetTop; //当前main盒子距离top
        this.init();
    }
    init = () => {
        const { src, uuid } = this.props;
        this.plane = document.createElement("img");
        this.plane.src = src;
        this.plane.id = uuid;
        this.plane.style.position = "absolute";
        this.mainDiv.appendChild(this.plane);
    }
    palce = (x = 0, y = 0) => {
        this.plane.style.left = x + 'px';;
        this.plane.style.top = y + 'px';

    }
}
/* 敌方小飞机 */
class Enemyplane extends Plane {
    constructor(props) {
        super(props);
        this.props.thisImage = document.getElementById(`${this.props.uuid}`);
        let x = Math.random() * (this.mainDiv.offsetWidth - 34);
        let y = Math.round(Math.random() * 8);
        this.palce(x, y);
        setInterval(this.move, 100); //飞机移动
        setInterval(this.remove, 100); //超出移除
    }
    move = () => {
        this.props.thisImage.style.top = parseInt(this.plane.style.top) + this.props.speed + "px";
    }
    remove = () => {
        // console.log(enemyArray.length);
        let pTop = this.plane.offsetTop + this.props.thisImage.naturalHeight; //当前飞机高度
        let mTop = this.mainHeight; //主界面高度
        if (pTop >= mTop) {
            enemyArray.forEach((item, i) => {
                if (item.id == `${this.props.uuid}`) {
                    this.mainDiv.removeChild(this.props.thisImage);
                    enemyArray.splice(i, 1)
                    return;
                }
            });
        }
    }

}
/* 我方小飞机 */
class PlayerPlane extends Plane {
    constructor(props) {
        super(props);
        this.thisImage = document.getElementById(`${this.props.uuid}`);
        this.palce(20, this.mainHeight - 100); //初始化改变x,y坐标
        this.top = parseInt(this.thisImage.style.top); //当前飞机距离顶部
        this.left = parseInt(this.thisImage.style.left); //当前飞机距离main左边
        this.thisImageW = this.thisImage.naturalWidth;
        this.lastTop = 0;
        this.lastLeft = 0;
        setInterval(this.move, 100); //=监听用户键盘操作/
        this.shoot();
    }


    controllerKeyboard = () => {
        document.addEventListener('keydown', (e) => {
            console.log(e.keyCode)
        })
    }

    //上移动
    upMove = () => {
            this.top = this.top - this.props.speed;
            if (this.top <= this.mainTop) {
                this.top = 0;
            }

            this.thisImage.style.top = this.top + "px";
        }
        //下移动
    downMove = () => {
            this.top = this.top + this.props.speed;
            if (this.top + 80 >= this.mainHeight) {
                this.top = this.mainHeight - 80;
            }
            this.thisImage.style.top = this.top + "px";
        }
        //左移动
    leftMove = () => {
            this.left = this.left - this.props.speed;

            if (this.left <= 0) {
                this.left = 0;
            }
            this.thisImage.style.left = this.left + "px";
        }
        //右移动
    rightMove = () => {
            this.left = this.left + this.props.speed;
            if (this.left + 66 >= this.mainWidth) {
                this.left = this.mainWidth - 66;
            }
            this.thisImage.style.left = this.left + "px";
        }
        /* 移动 */
    move = () => {

            if (upStatus) {
                this.upMove();
            }
            if (downStatus) {
                this.downMove();
            }
            if (leftStatus) {
                this.leftMove();
            }
            if (rightStatus) {
                this.rightMove();
            }

        }
        //发射子弹
    shoot = () => {
        // console.log("d");
        // const { id, bulletImg, speed, blood } = this.props;
        var obj = {
            id: this.props.id,
            src: this.props.bulletImg,
            blood: this.props.blood,
            speed: this.props.speed,
            left: this.left,
            top: this.top

        }
        var bullet = new Bullet(obj);
        bulletArray.push(bullet);

    }



}
/*发射子弹 */
class Bullet extends Plane {
    constructor(props) {
        super(props);

        this.thisImage = document.getElementById(`${this.props.uuid}`);
        // console.log(this.props.left)
        this.palce(this.props.left + 30, this.props.top - 15); //初始化改变x,y坐标
        this.top = parseInt(this.thisImage.style.top);

        // setInterval(, 500); //飞机移动
        setInterval(this.remove, 100); //超出移除
    }
    move = () => {

        // console.log(this.thisImage.style.top);
        this.top = this.top - this.props.speed;
        // console.log(this.top);
        this.thisImage.style.top = this.top + "px";

    }
    remove = () => {
        this.top = this.top - this.props.speed;
        // console.log(bulletArray.length);
        if (bulletArray.length > 0) {
            bulletArray.forEach((item, i) => {
                this.move();
                // console.log(this.top, this.mainTop);
                // console.log(item.plane.id, `${this.props.uuid}`);
                if (this.top <= 0) {
                    if (item.plane.id == `${this.props.uuid}`) {
                        this.mainDiv.removeChild(this.thisImage)
                        bulletArray.splice(i, 1);
                        return;
                    };
                }
            });
        }
    }
}

/* ----------------------------模型结束-------------------------------------------- */
//游戏

class Game {

    constructor(props) {
        this.props = props;
        this.init();
    }
    init = () => {
            this.bindEvent();
        }
        /* 点击游戏开始。 */
    bindEvent = () => {
            const { id } = this.props;
            document.querySelector(`#${id} .startBtn`).addEventListener('click', () => {
                /* 游戏开始 */
                this.startGame();
            });
            document.addEventListener("keydown", (e) => {
                // let e = window.event || arguments[0];
                //    //38-上 40-下 37-左 39-右

                switch (e.keyCode) {
                    case 38:
                        upStatus = true;
                        break;
                    case 40:
                        downStatus = true;
                        break;
                    case 37:
                        leftStatus = true;
                        break;
                    case 39:
                        rightStatus = true;
                        break;
                        //子弹
                    case 32:
                        // playerPlane.shoot();
                        shoot();
                        break;

                }

                // console.log(e.keyCode, rightStatus);
            });
            document.addEventListener("keyup", (e) => {
                switch (e.keyCode) {
                    case 38:
                        upStatus = false;
                        break;
                    case 40:
                        downStatus = false;
                        break;
                    case 37:
                        leftStatus = false;
                        break;
                    case 39:
                        rightStatus = false;
                        break;
                }
            });

        }
        /* 游戏开始 */
    startGame = () => {
            const { id, speed, blood, imgs: { playerPlaneImg } } = this.props;
            document.getElementById(`${id}`).className = "main hide";
            //调用玩家
            playerPlane = new PlayerPlane({
                id,
                imgs: playerPlaneImg,
                blood: blood,
                speed: speed
            });
            setInterval(this.enemyplaneFactory, 1000);
        }
        /* 生产敌军工厂 */
    enemyplaneFactory = () => {
        const { id, imgs: { enemyPlaneImg }, speed, blood } = this.props;
        var obj = new Enemyplane({
            id,
            src: enemyPlaneImg,
            blood: blood,
            speed: speed,

        });
        enemyArray.push(obj.plane);
    }
}


new Game({
    id: 'main',
    playerPlane: {
        imgs: {
            nomral: 'images/enemy1_fly_1.png',
            boom: 'images/enemy1_fly_1.png',
        }
    },
    enemyPlane: {
        imgs: {
            nomral: 'images/enemy1_fly_1.png',
            boom: 'images/enemy1_fly_1.png',
        }
    },
    enemyPlaneMidSize: {
        imgs: {
            nomral: 'images/enemy1_fly_1.png',
            boom: 'images/enemy1_fly_1.png',
        }
    },
    boss: {
        imgs: {
            nomral: 'images/enemy1_fly_1.png',
            boom: 'images/enemy1_fly_1.png',
        }
    },
    // enemyPlaneMidSize: {
    //     playerPlane: {
    //         nomral: 'images/enemy1_fly_1.png',
    //         boom: 'images/enemy1_fly_1.png',
    //     },
    //     enemyPlane: {
    //         nomral: 'images/enemy1_fly_1.png',
    //         boom: 'images/enemy1_fly_1.png',
    //     },
    //     bullet: {
    //         'images/bullet1.png',
    //     },
    //     bossPlane: {
    //         boom: '',
    //         normal: '',

    //     }
    // },
    speed: 10,
    blood: 10
});
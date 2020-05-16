/** 
 * @param {string} imgsrc 图片路径 
 * @param {number} x X坐标
 * @param {number} y Y坐标
 * @param {number} blood 血量
 * @param {number} speed 射击
 **/
function Playpalne(config) {
    const { imgsrc, x, y, blood, speed, isSelf } = config;
    /* 初始化值 */
    const mainobj = document.getElementById("main");
    this.planeNode = document.createElement("img");
    this.imgsrc = imgsrc;
    this.x = x;
    this.y = y;
    this.blood = blood;
    this.speed = speed;
    this.uuid = `plane${new Date().getTime()}`;
    /* 初始化数据 */
    this.init = function() {
            this.planeNode.id = this.uuid;
            this.planeNode.src = this.imgsrc;
            this.planeNode.style.position = "absolute";
            this.planeNode.style.left = x + "px";
            this.planeNode.style.top = y + "px";
            mainobj.appendChild(this.planeNode);
            this.move();
            if (!isSelf) {
                // 敌机位移
                this.enemyplane();
            }
            //让最后一个img动起来。则就相当于为每一个img都绑定了动画

        }
        /* 敌飞机 */
    this.enemyplane = function() {
            console.log(this.uuid);
            var item = document.getElementById(this.uuid);
            setInterval(() => {
                let top = parseInt(item.style.top) + 20;
                if (top >= mainobj.offsetHeight) {
                    console.log((item))
                    mainobj.removeChild(item);
                    return;
                }
                item.style.top = top + "px";
                // console.log(item.style.top);
            }, 1000);

        }
        //鼠标移动
    this.move = function() {
            const img = document.getElementsByName("palyername")[0];
            const mainL = mainobj.pageX;
            let x, y, addw, addh;
            document.onkeydown = function() {
                addw = 0;
                addh = 0;
                let e = window.event || arguments[0];
                x = parseInt(img.style.left);
                y = parseInt(img.style.top);
                if (e.keyCode == 37) {
                    addw = -10;
                    addh = 0;
                } else if (e.keyCode == 39) {
                    addw = 10;
                    addh = 0;
                } else if (e.keyCode == 38) {
                    addh = -10;
                    addw = 0;
                } else if (e.keyCode == 40) {
                    addw = 0;
                    addh = 10;
                } else {
                    addh = 0;
                    addw = 0;
                }

                if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 38 || e.keyCode == 40) {
                    let lastX = x + addw;
                    let lastY = y + addh;
                    // console.log(mainobj.offsetWidth);
                    // console.log(img.offsetWidth);
                    if (lastX <= 0) {
                        lastX = 0;

                    } else if (lastX >= mainobj.offsetWidth - img.offsetWidth) {
                        lastX = mainobj.offsetWidth - img.offsetWidth;
                    }

                    if (lastY <= 0) {
                        lastY = 0;

                    } else if (lastY >= mainobj.offsetHeight - img.offsetHeight) {
                        lastY = mainobj.offsetHeight - img.offsetHeight;
                    }
                    img.style.left = lastX + "px";
                    img.style.top = lastY + "px";

                }
            }
        }
        //射击
    this.shoot = function() {

    }
    this.init();


}
window.playstart = function() {
    document.getElementById("main").className = "main hide";
    let myplayerPlane = new Playpalne({
        imgsrc: "images/myplane.gif",
        x: 50,
        y: 450,
        blood: 10,
        speed: 10,
        isSelf: true
    });
    createEnemyname()
}

createEnemyname = () => {
    setInterval(() => {
        let x = 0;
        x = Math.round(Math.random() * 370);
        new Playpalne({
            imgsrc: "images/enemy1_fly_1.png",
            x,
            y: 0,
            blood: 10,
            speed: 10,
            isSelf: false
        });
    }, 2000)
}
/*TODO
* Сделать класс точки
*   Поля: Координаты + радиус круга (изначально 0)
*   Методы:
*       Поиск расстояния между двумя точками
*       Проверка окружностей на столкновение
*       Вернуть координаты относительно канваса
*
*
* Сделать анимацию разрастания кругов
* Сделать детекцию коллизии
*
*
* Реализовать панорамирование
* Зум (Частично реализован)
*
* Поворот идёт нахуй до второй лабы
*
* Сделать интерфейс
*
* */

class Dot {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.type = "relative";
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }

    static checkCollision(a, b) {
        return (Dot.distance(a, b) - (a.radius + b.radius)) <= 1e-8;
    }
}

class Engine {

    constructor(canvas, center, unitSize) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext(`2d`);
        this.center = center;
        this.unitSize = unitSize;
        this.dotArr = [];
        this.stdR = 3;
    }

    // Assumed implemented
    addDot(dot) {
        let rel = this.getRelative(dot)
        let relDot = new Dot(rel.x, rel.y);
        this.dotArr.push(relDot);

        console.log(this.dotArr); // Debug

        this.drawDot(dot);
        // this.ctx.beginPath();
        // this.ctx.arc(dot.x, dot.y, this.stdR, 0, 2 * Math.PI, true);
        // this.ctx.fill();
    }

    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, this.stdR, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }

    getReal(dot) {
        let newDot = new Dot(this.center.x + dot.x * this.unitSize, this.center.y - dot.y * this.unitSize);
        newDot.x = +newDot.x.toFixed(2);
        newDot.y = +newDot.y.toFixed(2);
        newDot.type = "real";
        return newDot;
    }

    getRelative(dot) {
        let x = (dot.x - this.center.x) / this.unitSize;
        let y = -(dot.y - this.center.y) / this.unitSize;

        let newDot = new Dot(+x.toFixed(2), +y.toFixed(2));
        newDot.type = "relative";

        return newDot;
    }

    putDot(dot){
        let relDot = new Dot(dot.x, dot.y);
        this.dotArr.push(relDot);

        let realDot = this.getReal(dot);

        this.drawDot(realDot);
/*        this.ctx.beginPath();
        this.ctx.arc(realDot.x, realDot.y, 3, 0, 2 * Math.PI, true);
        this.ctx.fill();*/
    }

    // grow() {
    //     // Make new array
    //     // Grow little
    //         // Code
    //     // Check collision
    //         // Code
    //         // If collided
    //             // Remove dot from array
    //     let growArr = Array.from(this.dotArr);
    //     growArr.forEach((dot) => {
    //         ctx.beginPath();
    //         ctx.arc(dot.x, dot.y, dot.r++, 0, 2 * Math.PI, true);
    //         ctx.fill();
    //     })
    // }

    drawCenterCross() {
        this.ctx.beginPath()

        this.ctx.moveTo(this.center.x, 0);
        this.ctx.lineTo(this.center.x, this.canvas.height);

        this.ctx.moveTo(0, this.center.y);
        this.ctx.lineTo(this.canvas.width, this.center.y);

        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }

    drawGrid() {
        this.ctx.beginPath()
        for (let i = this.unitSize; i < this.canvas.width; i += this.unitSize) {
            this.ctx.moveTo(this.center.x + i, 0);
            this.ctx.lineTo(this.center.x + i, this.canvas.height);
            this.ctx.moveTo(this.center.x - i, 0);
            this.ctx.lineTo(this.center.x - i, this.canvas.height);
        }
        for (let i = this.unitSize; i < this.canvas.height; i += this.unitSize) {
            this.ctx.moveTo(0, this.center.y + i);
            this.ctx.lineTo(this.canvas.width, this.center.y + i);
            this.ctx.moveTo(0, this.center.y - i);
            this.ctx.lineTo(this.canvas.width, this.center.y - i);
        }
        this.ctx.strokeStyle = "grey";
        this.ctx.stroke();

        this.drawCenterCross(this.center)
    }

    render() {
        this.drawGrid();
        this.dotArr.forEach((dot) => {
            let realDot = this.getReal(dot)
            this.ctx.beginPath();
            this.ctx.arc(realDot.x, realDot.y, this.stdR, 0, 2 * Math.PI, true);
            this.ctx.fill();
        });
    }
}

class App {
    constructor(container) {
        this.layer = new Layer(container);
    }
}

// Сюда все слушалки и рисовалки
class Layer {
    constructor(container) {
        this.canvas = document.querySelector(`#canvas`);

        this.fit(this.canvas);
        this.engine = new Engine(this.canvas,{x: this.canvas.width / 2, y: this.canvas.height / 2 }, 30)

        // Штука, которая реагирует на смену размера окна
        addEventListener(`resize`, () => {
            this.fit(this.canvas);
            this.engine.center = {x: this.canvas.width / 2, y: this.canvas.height / 2}
            this.engine.render()
        })

        // Штука, которая рисует точку при нажатии на холст
        this.canvas.addEventListener('mousedown', (e) => {
            let rect = this.canvas.getBoundingClientRect()
            this.engine.addDot({x: e.clientX - rect.left, y: e.clientY - rect.top, r: this.engine.stdR})
        })

        // Метод движка, который вызывает отрисовку заранее поставленных точек
        this.engine.render()
    }

    // Метод, который изменяет размер канваса
    fit(cnv) {
        let relative = document.querySelector(".canvas__container");
        cnv.height = relative.clientHeight;
        cnv.width = relative.clientWidth;
    }
}

onload = () => {
    new App(document.querySelector(`body`));
}
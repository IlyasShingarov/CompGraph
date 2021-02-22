/*TODO
* Сделать класс точки -- DONE
*   Поля: Координаты + радиус круга (изначально 0) + флаг роста + тип координат точки -- DONE
*   Методы:
*       Поиск расстояния между двумя точками -- DONE
*       Проверка окружностей на столкновение -- DONE
*
* Движок:
*       Вернуть координаты относительно канваса -- DONE
*       Рассчитать относительные координаты -- DONE
*
*
*       Отрисовка точки -- DONE
*       Отрисовка круга -- DONE
*       Прорисовка фигур из списка -- DONE
*
*       Добавить перерасчёт радиуса в абсолютные координаты
*       (Походу оно не нужно~)
*
*
* Интерфейс:
*       Добавление точки мышью -- DONE
*       Добавление точки через интерфейс
*       Редактирование точки
*       Удаление точки
*       Очистка радиусов, кругов и флагов роста
*
*
*
* Сделать анимацию разрастания кругов
* Сделать детекцию коллизии -- DONE
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
        this.grown = false;
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
    }

    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, this.stdR, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }

    drawCircle(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius * this.unitSize, 0, 2 * Math.PI, true);
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }

    getReal(dot) {
        let newDot = new Dot(this.center.x + dot.x * this.unitSize, this.center.y - dot.y * this.unitSize);
        newDot.radius = dot.radius;
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
    }

    grow() {
        let workArr = this.dotArr;

        workArr.forEach((dot) => {
            if (!dot.grown) {
                dot.radius += +(1/this.unitSize).toFixed(2);
                // this.drawCircle(this.getReal(dot));
            }
        });
        console.log(workArr);
        for (let i = 0; i < workArr.length - 1; i++) {
            for (let j = i + 1; j < workArr.length; j++) {
                if (Dot.checkCollision(workArr[i], workArr[j])) {
                    workArr[i].grown = true;
                    workArr[j].grown = true;
                }
            }
        }
    }

    drawCenterCross() {
        this.ctx.beginPath();

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
    }

    renderDots() {
        this.dotArr.forEach((dot) => {
            let realDot = this.getReal(dot)
            this.ctx.beginPath();
            this.ctx.arc(realDot.x, realDot.y, this.stdR, 0, 2 * Math.PI, true);
            this.ctx.fill();
        });
    }

    renderCircles() {
        this.dotArr.forEach((circle) => {
            let realCircle = this.getReal(circle)
            this.drawCircle(realCircle)
/*            this.ctx.beginPath();
            this.ctx.arc(realCircle.x, realCircle.y, realCircle.radius * this.unitSize, 0, 2 * Math.PI, true);
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();*/
        })
    }

    renderAll() {
        // this.putDot({x: 0, y: 0});
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCenterCross(this.center);
        this.drawGrid();
        this.renderDots();
        this.renderCircles();
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
            this.engine.renderAll()
        })

        // Штука, которая рисует точку при нажатии на холст
        this.canvas.addEventListener('mousedown', (event) => {
            let rect = this.canvas.getBoundingClientRect()
            this.engine.addDot({x: event.clientX - rect.left, y: event.clientY - rect.top, r: this.engine.stdR});
        })

        document.addEventListener(`keydown`, (event) => {
            if (event.code == 'Space') {
                this.engine.grow();
                this.engine.renderAll();
            }
            if (event.code == 'BracketLeft' && (event.ctrlKey || event.metaKey)) {
                this.engine.unitSize > 0 ? this.engine.unitSize -= 10 : alert("Достигнуто минимальное приближение");
            }
            if (event.code == 'BracketRight' && (event.ctrlKey || event.metaKey)) {
                this.engine.unitSize < 100 ? this.engine.unitSize += 10 : alert("Достигнуто максимальное приближение");
                // this.engine.unitSize += 10;
            }
            this.engine.renderAll()
        })

        // Метод движка, который вызывает отрисовку заранее поставленных точек
        this.engine.renderAll()
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
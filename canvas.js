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
*       Добавление точки через интерфейс -- DONE
*       Редактирование точки -- DONE
*       Удаление точки -- DONE
*       Очистка радиусов, кругов и флагов роста -- DONE
*       Отмена последнего действия <Ctrl + Z>
        Проверка на ввод чего-либо -- DONE
*
*
*
* Сделать анимацию разрастания кругов -- DONE
* Сделать детекцию коллизии -- DONE
*
*
* Реализовать панорамирование <Ну наверн стрелочки> -- DONE
* Зум (Частично реализован) -- DONE <Ctrl + [> <Ctrl + ]>
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
        this.id = 0;
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

    dotCount = 0;

    constructor(canvas, unitSize) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext(`2d`);
        this.center = {x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.unitSize = unitSize;
        this.dotArr = [];
        this.stdR = 3;
    }

    // Добавление точки по абсолютным координатам
    addDot(dot) {
        let rel = this.getRelative(dot)
        let relDot = new Dot(rel.x, rel.y);
        if (this.dotArr.reduce( (dot, curValue) => (curValue.x === rel.x && curValue.y === rel.y) || dot, false)) {
            alert(`Введена существующая точка`);
            return false;
        } else {
            relDot.id = this.dotCount++;
            this.dotArr.push(relDot);
            return relDot;
        }

    }

    // Добавить точку по относительным координатам
    putDot(dot){
        let relDot = new Dot(dot.x, dot.y);

        relDot.id = this.dotCount++;

        this.dotArr.push(relDot);
        console.log(this.dotArr);

        return relDot;
    }

    // Получить относительные координаты из абсолютных
    getRelative(dot) {
        let x = (dot.x - this.center.x) / this.unitSize;
        let y = -(dot.y - this.center.y) / this.unitSize;

        let newDot = new Dot(+x.toFixed(2), +y.toFixed(2));
        newDot.type = "relative";

        return newDot;
    }

    // Получить абсолютные координаты из относительных
    getReal(dot) {
        let newDot = new Dot(this.center.x + dot.x * this.unitSize, this.center.y - dot.y * this.unitSize);
        newDot.radius = dot.radius;
        newDot.x = +newDot.x.toFixed(2);
        newDot.y = +newDot.y.toFixed(2);
        newDot.type = "real";
        return newDot;
    }

    // Функция, запускающая рост кругов
    // Добавить маркер конца роста для останова анимации.
    grow() {
        let workArr = this.dotArr;

        workArr.forEach((dot) => {
            if (!dot.grown) {
                dot.radius += 1/this.unitSize;
            }
        });
        // console.log(workArr);
        for (let i = 0; i < workArr.length - 1; i++) {
            for (let j = i + 1; j < workArr.length; j++) {
                if (Dot.checkCollision(workArr[i], workArr[j])) {
                    workArr[i].grown = true;
                    workArr[j].grown = true;
                }
            }
        }
    }

    // Рисовать точку
    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, this.stdR, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }

    // Рисовать круг
    drawCircle(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius * this.unitSize, 0, 2 * Math.PI, true);
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }

    //Функция отрисовывает оси координат
    drawCenterCross() {
        this.ctx.beginPath();

        this.ctx.moveTo(this.center.x, 0);
        this.ctx.lineTo(this.center.x, this.canvas.height);

        this.ctx.moveTo(0, this.center.y);
        this.ctx.lineTo(this.canvas.width, this.center.y);

        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }

    // Функция отрисоываывает координатную сетку
    drawGrid() {
        this.ctx.beginPath()
        for (let i = this.unitSize; i < this.canvas.width * 2; i += this.unitSize) {
            this.ctx.moveTo(this.center.x + i, 0);
            this.ctx.lineTo(this.center.x + i, this.canvas.height);
            this.ctx.moveTo(this.center.x - i, 0);
            this.ctx.lineTo(this.center.x - i, this.canvas.height);
        }
        for (let i = this.unitSize; i < this.canvas.height * 2; i += this.unitSize) {
            this.ctx.moveTo(0, this.center.y + i);
            this.ctx.lineTo(this.canvas.width, this.center.y + i);
            this.ctx.moveTo(0, this.center.y - i);
            this.ctx.lineTo(this.canvas.width, this.center.y - i);
        }
        this.ctx.strokeStyle = "lightgrey";
        this.ctx.stroke();
    }

    // Функция для увеличения масштаба
    scaleUp(factor) {
        this.unitSize < 500 ? this.unitSize += factor : alert("Достигнуто максимальное приближение");
    }

    // Функция для уменьшения масштаба
    scaleDown(factor) {
        this.unitSize > 10 ? this.unitSize -= factor : alert("Достигнуто минимальное приближение");
    }

    // Функция отрисовывает все точки, котоорые есть в списке
    renderDots() {
        this.dotArr.forEach((dot) => {
            let realDot = this.getReal(dot)
            this.ctx.beginPath();
            this.ctx.arc(realDot.x, realDot.y, this.stdR, 0, 2 * Math.PI, true);
            this.ctx.fill();
            // let w = this.ctx.measureText(dot.id).width;
            // this.ctx.fillRect(dot.x + 3, dot.y + 3, w+3, 20);
            this.ctx.font = '18px sans-serif';
            this.ctx.fillText(dot.id, realDot.x + 4, realDot.y - 4);
            this.ctx.fillStyle = '#000';
        });
    }

    // Функция отрисовывает соответствующей точке круг
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

    // Общая функция отрисовки
    renderAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawDot(this.center);
        this.drawCenterCross(this.center);
        this.drawGrid();
        this.renderDots();
        this.renderCircles();
    }

    checkGrowth() {
        return this.dotArr.reduce( (dot, curValue) => curValue.grown && dot, true);
    }
}

class App {
    constructor(container) {
        this.layer = new Layer(container);
    }
}

// Сюда все слушалки и рисовалки
class Layer {
    prevState = 'none'
    constructor(container) {
        this.inpX = document.getElementById('add-x');
        this.inpY = document.getElementById('add-y');
        this.list = document.querySelector(`.list`);
        this.canvas = document.querySelector(`#canvas`);
        this.addBtn = document.getElementById(`add-btn`);
        this.resetBtn = document.getElementById(`reset-btn`);
        this.runBtn = document.getElementById(`run-btn`);
        this.undoBtn = document.getElementById(`undo-btn`);
        this.fit(this.canvas);
        this.engine = new Engine(this.canvas, 30);

        // Штука, которая реагирует на смену размера окна
        addEventListener(`resize`, () => {
            this.fit(this.canvas);
            this.engine.center = {x: this.canvas.width / 2, y: this.canvas.height / 2}
            this.engine.renderAll()
        })

        // Штука, которая рисует точку при нажатии на холст
        this.canvas.addEventListener('mousedown', (event) => {
            let rect = this.canvas.getBoundingClientRect()
            let dot = this.engine.addDot({x: event.clientX - rect.left, y: event.clientY - rect.top})
            if (dot) {
                this.addToList(dot);
            }
            this.engine.renderAll();
        })

        document.addEventListener(`keydown`, (event) => {
            if (event.code === 'BracketLeft' && (event.ctrlKey || event.metaKey)) {
                this.engine.scaleDown(10);
            }
            if (event.code === 'BracketRight' && (event.ctrlKey || event.metaKey)) {
                this.engine.scaleUp(10);
            }
            if (event.code === 'ArrowLeft' && (event.ctrlKey || event.metaKey)) {
                this.engine.center.x += 10;
            }
            if (event.code === 'ArrowRight' && (event.ctrlKey || event.metaKey)) {
                this.engine.center.x -= 10;
            }
            if (event.code === 'ArrowUp' && (event.ctrlKey || event.metaKey)) {
                this.engine.center.y += 10;
            }
            if (event.code === 'ArrowDown' && (event.ctrlKey || event.metaKey)) {
                this.engine.center.y -= 10;
            }
            this.engine.renderAll();
        })

        document.addEventListener(`keypress`, (event) => {
            if (event.code === 'Space' && (event.ctrlKey || event.metaKey)) {
                this.engine.dotArr.forEach((dot) => {
                    dot.radius = 0;
                    dot.grown = false;
                })

                this.updateRadius();
                this.engine.renderAll();

                let timer = setInterval(()=>{
                    this.engine.grow();
                    this.updateRadius();
                    this.engine.renderAll();
                    if (this.engine.checkGrowth()) clearInterval(timer)
                }, 1000 / 100)
            }
            if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) {
                switch (this.prevState) {
                    case 'none':
                        break;
                    case 'del':
                        this.engine.dotArr.push(this.prevDot);
                        this.addToList(this.prevDot);
                        this.engine.renderAll();
                        this.prevState = 'add';
                        break;
                    case 'add':
                        this.engine.dotArr.forEach((dot, i) => {
                            if (dot.id === parseInt(this.prevDot.id)) {
                                this.prevDot = dot;
                                this.prevDot.radius = 0;
                                this.prevState = 'del';
                                this.engine.dotArr.splice(i, 1);
                                document.getElementById(dot.id).remove();
                            }
                            this.engine.renderAll();
                        })
                        break;
                    case 'change':
                        break;
                }
            }
        })

        this.undoBtn.addEventListener(`click`, () => {
            switch (this.prevState) {
                case 'none':
                    break;
                case 'del':
                    this.engine.dotArr.push(this.prevDot);
                    this.addToList(this.prevDot);
                    this.engine.renderAll();
                    this.prevState = 'add';
                    break;
                case 'add':
                    this.engine.dotArr.forEach((dot, i) => {
                        if (dot.id === parseInt(this.prevDot.id)) {
                            this.prevDot = dot;
                            this.prevState = 'del';
                            this.engine.dotArr.splice(i, 1);
                            this.engine.renderAll();
                            document.getElementById(dot.id).remove();
                        }
                    })
                    break;
                case 'change':
                    break;
            }
        })

        this.addBtn.addEventListener(`click`, () => {
            let nx = parseFloat(this.inpX.value);
            let ny = parseFloat(this.inpY.value);
            if (!this.inpX.value || !this.inpY.value){
                alert(`Попытка ввести пустые поля`)
            } else {
                if (this.engine.dotArr.reduce( (dot, curValue) => (curValue.x === nx && curValue.y === ny) || dot, false)) {
                    alert(`Введена существующая точка`);
                } else {
                    this.addToList(this.engine.putDot({x : nx, y : ny}));
                    this.engine.renderAll();
                }
            }
        });

        this.resetBtn.addEventListener(`click`, () => {
            this.engine.dotArr.forEach((dot) => {
                dot.radius = 0;
                dot.grown = false;
            })

            this.engine.renderAll();
            this.updateRadius();
        })

        this.runBtn.addEventListener(`click`, () => {
            this.engine.dotArr.forEach((dot) => {
                dot.radius = 0;
                dot.grown = false;
            })

            this.updateRadius();
            this.engine.renderAll();

            let timer = setInterval(() => {
                this.engine.grow();
                this.engine.renderAll();
                this.updateRadius();
                if (this.engine.checkGrowth()){
                    clearInterval(timer);
                };
            }, 1000 / 100)
        })

        // Метод движка, который вызывает отрисовку заранее поставленных точек
        this.engine.renderAll();
    }


    addToList(dot) {
        let element = document.createElement('div');
        console.log(this.engine.dotArr)
        element.id = dot.id;
        element.className = `dotElement`;

        let idText = document.createElement(`span`);
        idText.className = "dot-id";
        idText.textContent = `id: ` + dot.id;
        element.append(idText);

        let xLabel = document.createElement(`label`);
        xLabel.htmlFor = `x-inp`;
        xLabel.textContent = `X:`

        let xIn = document.createElement(`input`);
        xIn.className = `x-inp inp`;
        xIn.type = 'number';
        xIn.value = dot.x + "";
        xIn.addEventListener(`change`, () => {
            dot.x = parseFloat(xIn.value);
            this.engine.renderAll();
        });
        xLabel.append(xIn);
        element.append(xLabel);

        let yLabel = document.createElement(`label`);
        yLabel.htmlFor = `y-inp`;
        yLabel.textContent = `Y:`;

        let yIn = document.createElement(`input`);
        yIn.type = `number`;
        yIn.className = `y-inp inp`;
        yIn.value = dot.y + "";
        yIn.addEventListener(`change`, () => {
            dot.y = parseFloat(yIn.value);
            this.engine.renderAll();
        });
        yLabel.append(yIn);
        element.append(yLabel);

        let rad = document.createElement(`span`);
        rad.id = `rid-` + dot.id;
        rad.textContent = `R: ` + dot.radius.toFixed(3);
        element.append(rad);

        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "-"
        deleteButton.id = dot.id;
        deleteButton.className = `delBtn btn btn-dark btn-sm`;
        deleteButton.addEventListener(`click`, () => {
            this.engine.dotArr.forEach((dot, i) => {
                if (dot.id === parseInt(deleteButton.id)) {
                    this.prevDot = dot;
                    this.prevDot.radius = 0;
                    this.prevState = 'del';
                    this.engine.dotArr.splice(i, 1);
                }
            })
            this.engine.renderAll();
            element.remove();
        })
        element.append(deleteButton);

        this.list.append(element);
    }

    updateRadius() {
        this.engine.dotArr.forEach((dot) => {
          let text = document.getElementById(`rid-` + dot.id);
          text.innerHTML = `R: ` + dot.radius.toFixed(3);
        })
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
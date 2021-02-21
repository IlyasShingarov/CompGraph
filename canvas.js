const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get realCoordinates() {
        return [this.x  - center.x, this.y + center.y]
    }
}*/

class Engine {

    constructor(center, unitSize) {
        this.center = center;
        this.unitSize = unitSize;
        this.dotArr = [];
    }

    getReal(dot) {
        return [this.center.x + dot.x * this.unitSize, this.center.y - dot.y * this.unitSize]
    }

    getRelative(dot) {
        let x = (dot.x - this.center.x) / this.unitSize;
        let y = -(dot.y - this.center.y) / this.unitSize;
        return [x.toFixed(3), y.toFixed(3)]
    }

    drawDot(dot){
        let dotVector = this.getReal(dot);
        this.dotArr.push(dot);

        ctx.beginPath();
        ctx.arc(dotVector[0], dotVector[1], 3, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    addDot(dot) {
        let dotVector = this.getRelative(dot)
        this.dotArr.push({x: dotVector[0], y: dotVector[1]});
        console.log(this.dotArr)

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    drawCenterCross() {
        ctx.beginPath()

        ctx.moveTo(this.center.x, 0);
        ctx.lineTo(this.center.x, canvas.height);

        ctx.moveTo(0, this.center.y);
        ctx.lineTo(canvas.width, this.center.y);

        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    drawGrid() {
        ctx.beginPath()
        for (let i = this.unitSize; i < canvas.width; i += this.unitSize) {
            ctx.moveTo(this.center.x + i, 0);
            ctx.lineTo(this.center.x + i, canvas.height);
            ctx.moveTo(this.center.x - i, 0);
            ctx.lineTo(this.center.x - i, canvas.height);
        }
        for (let i = this.unitSize; i < canvas.height; i += this.unitSize) {
            ctx.moveTo(0, this.center.y + i);
            ctx.lineTo(canvas.width, this.center.y + i);
            ctx.moveTo(0, this.center.y - i);
            ctx.lineTo(canvas.width, this.center.y - i);
        }
        ctx.strokeStyle = "grey";
        ctx.stroke();

        this.drawCenterCross(this.center)
    }

    render() {
        this.dotArr.forEach((dot) => {
            let vect = this.getReal(dot)
            ctx.beginPath();
            ctx.arc(vect[0], vect[1], 3, 0, 2 * Math.PI, true);
            ctx.fill();
        });
    }
}


function test(engine) {
    engine.drawGrid()
    engine.drawDot({x: 1, y: 1})
    engine.drawDot({x: 5, y: 3})
    engine.drawDot({x: 3, y: 2})
    engine.drawDot({x: 6, y: 7})
    engine.drawDot({x: 5, y: -3})
    engine.drawDot({x: -3, y: 2})
    engine.drawDot({x: -6, y: -7})
}

class App {
    constructor(container) {
        this.layer = new Layer(container);
    }
}

class Layer {
    constructor(container) {
        this.canvas = document.querySelector(`#canvas`);
        this.ctx = this.canvas.getContext(`2d`);

        this.fit(this.canvas);
        this.engine = new Engine({x: this.canvas.width / 2, y: this.canvas.height / 2 }, 30)
        test(this.engine)
        canvas.addEventListener('mousedown', (e) => {
            let rect = canvas.getBoundingClientRect();
            this.engine.addDot({x: e.clientX, y: e.clientY})
            this.engine.render()
        })
        addEventListener(`resize`, () => {
            this.fit(this.canvas);
            this.engine = new Engine({x: this.canvas.width / 2, y: this.canvas.height / 2}, 30)
            test(this.engine)
            this.engine.render()
        })
    }

    fit(cnv) {
        cnv.height = window.innerHeight;
        cnv.width = window.innerWidth;
    }

}

onload = () => {
    new App(document.querySelector(`body`));
}

/*window.addEventListener('load', () => {

    canvas.height = window.innerHeight - 20;
    canvas.width = window.innerWidth - 20;
    let engine = new Engine({x: canvas.width / 2, y: canvas.height / 2}, 30)

    test(engine)
})


addEventListener('resize', () => {
    canvas.height = window.innerHeight - 20;
    canvas.width = window.innerWidth - 20;

    let engine = new Engine({x: canvas.width / 2, y: canvas.height / 2}, 30)

    test(engine)

})*/

var GRID_SIZE = 50;
var TOTAL_FRAMES = 100;
var frame = 0;
var step = 1;
var canvas;
var context;
var dominos = {};
var state = 0;
var toFill = [];
var colitions = [];
class Domino {
    constructor(x, y, o) {
        //x and y are the top left corner of the domino
        this.x = x;
        this.y = y;
        //orientation 0-> horizontal up, 1-> horizontal down, 2->vertical left, 3->vertical right
        this.orientation = o;
    }

    move() {
        let blocked = [];
        switch (this.orientation) {
            case 0:
                this.y += -1;
                blocked = [this.x + 1, this.y];
                break;
            case 1:
                this.y += 1;
                blocked = [this.x + 1, this.y];
                break;
            case 2:
                this.x += -1;
                blocked = [this.x, this.y + 1];
                break;
            case 3:
                this.x += 1;
                blocked = [this.x, this.y + 1];
                break;
        }


        return [
            [this.x, this.y], blocked
        ];
    }

    drawArrow(ax, ay) {
        if (ax == null) {
            ax = this.x * GRID_SIZE;
            ay = this.y * GRID_SIZE;
        }
        //grey body
        context.save();
        context.beginPath();

        context.fillStyle = "#d9d9d9";
        if (this.orientation >= 2) {
            context.rect(ax, ay, GRID_SIZE, GRID_SIZE * 2);
        } else {
            context.rect(ax, ay, GRID_SIZE * 2, GRID_SIZE);
        }
        context.fill();
        context.stroke();
        context.beginPath();
        context.fillStyle = "blue"
        context.strokeStyle = "blue";
        context.translate(ax, ay);
        switch (this.orientation) {
            case 0:
                break;
            case 1:
                context.translate(2 * GRID_SIZE, GRID_SIZE);
                context.rotate(180 * Math.PI / 180);
                break;
            case 2:
                context.translate(0, 2 * GRID_SIZE);
                context.rotate(270 * Math.PI / 180);
                break;
            case 3:
                context.translate(GRID_SIZE, 0);
                context.rotate(90 * Math.PI / 180);
                break;
        }

        context.moveTo(GRID_SIZE * 0.95, GRID_SIZE * 0.9);
        context.lineTo(GRID_SIZE * 1.05, GRID_SIZE * 0.9);
        context.lineTo(GRID_SIZE * 1.05, GRID_SIZE * 0.5);
        context.lineTo(GRID_SIZE * 1.25, GRID_SIZE * 0.65);
        context.lineTo(GRID_SIZE, GRID_SIZE * 0.1);
        context.lineTo(GRID_SIZE * 0.75, GRID_SIZE * 0.65);
        context.lineTo(GRID_SIZE * 0.95, GRID_SIZE * 0.5);
        context.fill();
        context.stroke();
        context.restore();
    }
    drawTile() {
        context.save();
        context.beginPath();
        //orientation 0-> horizontal up, 1-> horizontal down, 2->vertical left, 3->vertical right
        // 3 ->  #ff3333   0 -> #3385ff   2 ->#ffdb4d  1->#5cd65c
        switch (this.orientation) {
            case 0:
                context.fillStyle = "#3385ff"
                context.rect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE);
                break;
            case 1:
                context.fillStyle = "#5cd65c"
                context.rect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE);
                break;
            case 2:
                context.fillStyle = "#ffdb4d"
                context.rect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE, GRID_SIZE * 2);
                break;
            case 3:
                context.fillStyle = "#ff3333"
                context.rect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE, GRID_SIZE * 2);
                break;
        }
        context.fill();
        context.stroke();
        context.restore();
    }

    drawTileNoBorder() {
        context.save();
        switch (this.orientation) {
            case 0:
                context.fillStyle = "#3385ff"
                context.fillRect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE);
                break;
            case 1:
                context.fillStyle = "#5cd65c"
                context.fillRect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE);
                break;
            case 2:
                context.fillStyle = "#ffdb4d"
                context.fillRect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE, GRID_SIZE * 2);
                break;
            case 3:
                context.fillStyle = "#ff3333"
                context.fillRect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE, GRID_SIZE * 2);
                break;
        }
        context.restore();
    }

    animateMove(frame) {
        context.rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
}


function substeps() {
    let btn = document.getElementById("btnState");
    let ck = document.getElementById("subSteps").checked;
    if (!ck) {
        while (state != 0) {
            switch (state) {
                case 2:
                    lookforColitions(false);
                    break;
                case 3:
                    removeColitions(false);
                    break;
                case 4:
                    moveAllTiles(false);
                    break;
                case 5:
                    emptyBlocks(false);
                    break;
                case 6:
                    setEmptyBlocks(false);
                    break;
                case 7:
                    colorAll(true);
                    break;
            }
            state = (state + 1) % 8;
        }
        btn.innerText = "Advance"
    } else {

    }

}

function update() {
    let btn = document.getElementById("btnState");
    let substeps = document.getElementById("subSteps").checked;
    if (substeps) {
        switch (state) {
            case 2:
                lookforColitions(true);
                //action "Look for colisions"
                btn.innerText = "Remove blocks with colisions"
                break;
            case 3:
                removeColitions(true);
                //"Remove blocks with colisions"
                btn.innerText = "Move the tiles"
                break;
            case 4:
                moveAllTiles(true);
                //"Move the tiles"
                btn.innerText = "Find empty blocks"
                break;
            case 5:
                emptyBlocks(true);
                // "Find empty blocks"
                btn.innerText = "Randomly fill the empty blocks"
                break;
            case 6:
                setEmptyBlocks(true);
                //"Randomly fill the empty blocks"
                btn.innerText = "Color the blocks"
                break;
            case 7:
                colorAll(true);
                //"Color the blocks"
                btn.innerText = "Generate Grid"
                break;
            case 0:
                drawNewBoxes();
                step += 1;
                let c = document.getElementById("stepDisplay");
                c.innerText = step - 1;
                //"Generate Grid"
                btn.innerText = "Draw Arrows"
                break;
            case 1:
                drawAllArrows();
                // "Draw Arrows"
                btn.innerText = "Look for colisions"
                break;
        }
        state = (state + 1) % 8;
    } else {
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        increaseBoxes();
        step += 1;
        let c = document.getElementById("stepDisplay");
        c.innerText = step - 1;
        lookforColitions(false);
        removeColitions(false);
        moveAllTiles(false);
        emptyBlocks(false);
        setEmptyBlocks(false);
        ajustSize();
        colorAll(true);

    }


}


function colorAll(animate) {

    if (step <= 79) {
        for (let j = -step; j < step; j++) {
            for (let i = -step; i < step; i++) {
                let d = dominos[j][i];
                if (d instanceof Domino)
                    d.drawTile();
            }
        }
    } else {
        for (let j = -step; j < step; j++) {
            for (let i = -step; i < step; i++) {
                let d = dominos[j][i];
                if (d instanceof Domino)
                    d.drawTileNoBorder();
            }
        }
    }

}

function moveAllTiles(animate) {


    //animation
    let cbox = document.getElementById("animation").checked;
    if (step <= 25 && cbox && animate) {
        frame = 0;
        arrowMovement();
        return;
    }
    let newDominosPos = {};
    let prevStep = step - 1;
    for (let i = -step; i < step; i++) {
        newDominosPos[i] = {};
    }

    //fill with zero in the right spot;
    for (let j = -prevStep; j < prevStep; j++) {
        for (let i = -prevStep; i < prevStep; i++) {
            if (dominos[j][i] == undefined) continue;
            newDominosPos[j][i] = 0;
        }
    }

    for (let j = -prevStep; j < prevStep; j++) {
        for (let i = -prevStep; i < prevStep; i++) {
            let d = dominos[j][i];
            if (!(d instanceof Domino)) continue;
            let newPos = d.move();
            newDominosPos[newPos[0][1]][newPos[0][0]] = d;
            newDominosPos[newPos[1][1]][newPos[1][0]] = 1;
        }
    }

    dominos = newDominosPos;

    if (!animate) return;
    drawGrid(step - 1);
    drawAllArrows();
}


function arrowMovement() {
    let dis = (frame * GRID_SIZE) / (TOTAL_FRAMES);

    //clear screen
    for (let i = 0; i < step; i++) {
        drawGrid(i);
    }
    let prevStep = step - 1;
    for (let j = -prevStep; j < prevStep; j++) {
        for (let i = -prevStep; i < prevStep; i++) {
            let d = null;
            try {
                d = dominos[j][i];
            } catch {
                continue;
            }
            //orientation 0-> horizontal up, 1-> horizontal down, 2->vertical left, 3->vertical right
            if (d instanceof Domino) {
                switch (d.orientation) {
                    case 0:
                        d.drawArrow(d.x * GRID_SIZE, d.y * GRID_SIZE - dis);
                        break;
                    case 1:
                        d.drawArrow(d.x * GRID_SIZE, d.y * GRID_SIZE + dis);
                        break;
                    case 2:
                        d.drawArrow(d.x * GRID_SIZE - dis, d.y * GRID_SIZE);
                        break;
                    case 3:
                        d.drawArrow(d.x * GRID_SIZE + dis, d.y * GRID_SIZE);
                        break;
                }

            }

        }
    }

    frame += 1;
    if (frame >= TOTAL_FRAMES) {
        let newDominosPos = {};
        let prevStep = step - 1;
        for (let i = -step; i < step; i++) {
            newDominosPos[i] = {};
        }

        //fill with zero in the right spot;
        for (let j = -prevStep; j < prevStep; j++) {
            for (let i = -prevStep; i < prevStep; i++) {
                if (dominos[j][i] == undefined) continue;
                newDominosPos[j][i] = 0;
            }
        }

        for (let j = -prevStep; j < prevStep; j++) {
            for (let i = -prevStep; i < prevStep; i++) {
                let d = dominos[j][i];
                if (!(d instanceof Domino)) continue;
                let newPos = d.move();
                newDominosPos[newPos[0][1]][newPos[0][0]] = d;
                newDominosPos[newPos[1][1]][newPos[1][0]] = 1;
            }
        }

        dominos = newDominosPos;

        if (!animate) return;
        drawGrid(step - 1);
        drawAllArrows();
        return;
    }
    window.requestAnimationFrame(arrowMovement);

}

function drawAllArrows() {
    let prevStep = step;
    for (let j = -prevStep; j < prevStep; j++) {
        for (let i = -prevStep; i < prevStep; i++) {
            let d = null;
            try {
                d = dominos[j][i];
            } catch {
                continue;
            }

            if (d instanceof Domino)
                d.drawArrow();
        }
    }
}

function removeColitions(animate) {
    if (!animate) return;
    context.beginPath();
    context.fillStyle = "#FFFFFF";
    for (let i = 0; i < colitions.length; i++) {
        let x = colitions[i][0];
        let y = colitions[i][1];
        drawBox(x, y);
        drawBox(x, y + 1);
        drawBox(x + 1, y);
        drawBox(x + 1, y + 1);
    }
    context.fill();
    context.stroke();
}

function emptyBlocks(animate) {
    let prevStep = step;
    toFill = [];

    for (let j = -prevStep; j < prevStep - 1; j++) {
        for (let i = -prevStep; i < prevStep - 1; i++) {
            if (dominos[j][i] == 0 && dominos[j][i + 1] == 0 && dominos[j + 1][i] == 0 && dominos[j + 1][i + 1] == 0) {
                toFill.push([i, j]);
                dominos[j][i] = 1;
                dominos[j][i + 1] = 1;
                dominos[j + 1][i] = 1;
                dominos[j + 1][i + 1] = 1;
            }
        }
    }
    if (!animate) return;
    context.beginPath();
    context.fillStyle = "orange";
    for (let i = 0; i < toFill.length; i++) {
        let x = toFill[i][0];
        let y = toFill[i][1];
        context.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE * 2);
    }
    context.stroke();
}

function setEmptyBlocks(animate) {
    //Generate random position 0 - horizontal, 1 vertical
    for (let i = 0; i < toFill.length; i++) {
        let x = toFill[i][0];
        let y = toFill[i][1];
        let blockOrientation = Math.floor(Math.random() * 2);
        if (blockOrientation == 0) {
            let block1 = new Domino(x, y, 0);
            let block2 = new Domino(x, y + 1, 1);
            dominos[y][x] = block1;
            dominos[y + 1][x] = block2;
            dominos[y + 1][x + 1] = 1;
            dominos[y][x + 1] = 1;
            //draw with arrows
            if (!animate) continue;
            block1.drawArrow();
            block2.drawArrow();
        } else {
            let block1 = new Domino(x, y, 2);
            let block2 = new Domino(x + 1, y, 3);
            dominos[y][x] = block1;
            dominos[y][x + 1] = block2;
            dominos[y + 1][x] = 1;
            dominos[y + 1][x + 1] = 1;
            //draw with arrows
            if (!animate) continue;
            block1.drawArrow();
            block2.drawArrow();
        }
    }



}

function lookforColitions(animate) {
    colitions = []
    let prevStep = step - 1;
    for (let j = -prevStep; j < prevStep; j++) {
        for (let i = -prevStep; i < prevStep; i++) {
            let d = dominos[j][i];
            if (!(d instanceof Domino)) continue;
            //moving position 
            //orientation 0-> horizontal up, 1-> horizontal down, 2->vertical left, 3->vertical right
            let o = null;
            switch (d.orientation) {
                case 1:
                    o = dominos[j + 1][i];
                    if ((o instanceof Domino) && o.orientation == 0) {
                        dominos[j + 1][i] = 0;
                        dominos[j][i] = 0;
                        dominos[j + 1][i + 1] = 0;
                        dominos[j][i + 1] = 0;
                        colitions.push([i, j])
                    }
                    break;
                case 3:
                    o = dominos[j][i + 1];
                    if ((o instanceof Domino) && o.orientation == 2) {
                        dominos[j + 1][i] = 0;
                        dominos[j][i] = 0;
                        dominos[j + 1][i + 1] = 0;
                        dominos[j][i + 1] = 0;
                        colitions.push([i, j])
                    }
                    break;
            }
        }
    }
    if (!animate) return;
    context.beginPath();
    context.fillStyle = "yellow";
    for (let i = 0; i < colitions.length; i++) {
        let x = colitions[i][0];
        let y = colitions[i][1];
        context.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE * 2);
    }
    context.stroke();
}


function reset() {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    step = 1;
    let c = document.getElementById("stepDisplay");
    c.innerText = step - 1;
    state = 0;
    dominos = {};
    GRID_SIZE = 50;
    toFill = [];
    colitions = [];
    let btn = document.getElementById("btnState");
    btn.innerText = "Generate Grid"

}




function drawBox(x, y) {
    //x,y is the position of top left corner
    context.rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}


function drawNewBoxes() {
    //if the grid is too big redraw all the boxes with smaller grid_size
    if (canvas.height < 2 * step * GRID_SIZE) {
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        GRID_SIZE = canvas.height / (2 * step);
        for (let i = 0; i < step; i++) {
            drawGrid(i);
        }
        colorAll(true);
    }
    //add the space for storing the max and min values for the array that stores the dominos
    dominos[-step] = {}
    dominos[step - 1] = {}

    //start drawing
    context.beginPath();
    context.lineWidth = "1";
    //top right diagonal
    for (let i = 0, j = -step; j < 0; i++, j++) {
        drawBox(i, j);
        dominos[i][j] = 0;
    }
    //top left diagonal
    for (let i = -1, j = -step; j < 0; i--, j++) {
        drawBox(i, j);
        dominos[i][j] = 0;
    }
    //bottom right diagonal
    for (let i = 0, j = step - 1; j >= 0; i++, j--) {
        drawBox(i, j);
        dominos[i][j] = 0;
    }
    //bottom left diagonal
    for (let i = -1, j = step - 1; j >= 0; i--, j--) {
        drawBox(i, j);
        dominos[i][j] = 0;
    }

    context.stroke();

}

function increaseBoxes() {
    //if the grid is too big redraw all the boxes with smaller grid_size
    //add the space for storing the max and min values for the array that stores the dominos
    dominos[-step] = {}
    dominos[step - 1] = {}
    for (let i = 0, j = -step; j < 0; i++, j++) {
        dominos[i][j] = 0;
    }
    //top left diagonal
    for (let i = -1, j = -step; j < 0; i--, j++) {
        dominos[i][j] = 0;
    }
    //bottom right diagonal
    for (let i = 0, j = step - 1; j >= 0; i++, j--) {
        dominos[i][j] = 0;
    }
    //bottom left diagonal
    for (let i = -1, j = step - 1; j >= 0; i--, j--) {
        dominos[i][j] = 0;
    }
}

function ajustSize() {
    let s = step - 1;
    if (canvas.height < 2 * s * GRID_SIZE) {
        GRID_SIZE = canvas.height / (2 * s);
    }
}

function drawGrid(size) {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    context.beginPath();
    for (let step = 1; step <= size; step++) {
        for (let i = 0, j = -step; j < 0; i++, j++) {
            drawBox(i, j);
        }
        for (let i = -1, j = -step; j < 0; i--, j++) {
            drawBox(i, j);
        }
        for (let i = 0, j = step - 1; j >= 0; i++, j--) {
            drawBox(i, j);
        }
        for (let i = -1, j = step - 1; j >= 0; i--, j--) {
            drawBox(i, j);
        }
    }
    context.stroke();

}

function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.beginPath();
    //context.moveTo(0, 0);
    //context.lineTo(canvas.width, canvas.height);
    //context.moveTo(canvas.width, 0);
    //context.lineTo(0, canvas.height);

    context.translate(canvas.width / 2, canvas.width / 2);
    context.stroke();
}


function resize() {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    draw();
}





window.addEventListener("load", function() {
    canvas = document.getElementById("draw");
    context = canvas.getContext('2d');


    //window.addEventListener("resize", resize);
    resize();
});

document.onkeypress = function(e) {
    if (e.key == "n" || e.key == "N") {
        update();
    }
};

function autoAdvance() {
    let e = document.getElementById("autoAdvance");
    if (e.checked) {
        update();
        setTimeout(autoAdvance, 1000);
    }
}

function generate() {
    let val = document.getElementById("generateRnd");
    let num = parseInt(val.value);
    val.value = num;

    if (!(num > 0 && num <= 500)) {
        alert("Not valid value...")
        return;
    }

    reset();

    for (let i = 0; i < num; i++) {
        increaseBoxes()
        step += 1;

        lookforColitions(false);
        removeColitions(false);
        moveAllTiles(false);
        emptyBlocks(false);
        setEmptyBlocks(false);

    }
    ajustSize();
    let c = document.getElementById("stepDisplay");
    c.innerText = step - 1;
    colorAll(true);
}
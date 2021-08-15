export default class BackgroundHexagon  {

    constructor(p5, x, y, colour, hasFill, maxSize = 10000) {
        this.p = p5;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.hasFill = hasFill;
        this.maxSize = maxSize;
        this.radius = 1;
    }

    draw() {
        this.p.stroke(this.colour);
        if(this.hasFill){
            this.p.fill(this.colour);
        }
        else {
            this.p.noFill();
        }
        const r = this.radius / 2;
        this.p.angleMode(this.p.RADIANS);
        var angle = this.p.TWO_PI / 6;
        this.p.beginShape();
        for (let a = this.p.TWO_PI / 12; a < this.p.TWO_PI + this.p.TWO_PI / 12; a += angle) {
            let sx = this.x + this.p.cos(a) * r;
            let sy = this.y + this.p.sin(a) * r;
            this.p.vertex(sx, sy);
        }
        this.p.endShape(this.p.CLOSE);
    }

    update() {
        if(this.radius < this.maxSize){
            this.radius = this.radius + 16;
        }
    }
}
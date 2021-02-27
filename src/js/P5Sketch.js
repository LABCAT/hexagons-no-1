import React, { useRef, useEffect } from "react";
import * as p5 from "p5";
import ShuffleArray from "./ShuffleArray.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.i = 0;

        p.coloursArray = [0, 255, 'variable'];

        p.strokeColour = {
            'r' : 0,
            'g' : 0,
            'b' : 0,
        }

        p.fillColour = {
            'r' : 0,
            'g' : 0,
            'b' : 0,
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            let colours = ShuffleArray(p.coloursArray);
            p.strokeColour.r = colours[0];
            p.strokeColour.g = colours[1];
            p.strokeColour.b = colours[2];
            colours = ShuffleArray(p.coloursArray);
            p.fillColour.r = colours[0];
            p.fillColour.g = colours[1];
            p.fillColour.b = colours[2];
        };

        p.draw = () => {
            p.background(0);
            p.animateHexagons(p.width / 2, p.height / 2, p.width / 18);
            p.i = p.i + 3;
        };

        p.getColourValue = (value, negation) => {
            if(value === 'variable'){
                return 255 - negation;
            }
            return value;
        }

        p.animateHexagons = (x, y, r) => {
            let count = p.i - 1;
            while(count < p.i){
                let colourAdjuster = 255 - count;
                p.strokeWeight(p.width / 288);
                //p.stroke(255, 0, colourAdjuster);
                p.stroke(
                  p.getColourValue(p.strokeColour.r, count),
                  p.getColourValue(p.strokeColour.g, count),
                  p.getColourValue(p.strokeColour.b, count)
                );
                //p.fill(colourAdjuster, 0, 255, 63);
                p.fill(
                  p.getColourValue(p.fillColour.r, count),
                  p.getColourValue(p.fillColour.g, count),
                  p.getColourValue(p.fillColour.b, count),
                  63
                );
                p.hexagon(x + count, y + count, r);
                p.hexagon(x + count, y - count, r);
                p.hexagon(x + count, y, r);
                p.hexagon(x - count, y, r);
                p.hexagon(x - count, y + count, r);
                p.hexagon(x - count, y - count, r);
                p.hexagon(x, y + count, r);
                p.hexagon(x, y - count, r);
                count++;
            }
        }

        p.hexagon = (x, y, r) => {
            const radius = r / 2;
            p.angleMode(p.RADIANS);
            var angle = p.TWO_PI / 6;
            p.beginShape();
            for (let a = p.TWO_PI/12; a < p.TWO_PI + p.TWO_PI/12; a += angle) {
                let sx = x + p.cos(a) * radius;
                let sy = y + p.sin(a) * radius;
                p.vertex(sx, sy);
            }
            p.endShape(p.CLOSE);
        }

        p.mousePressed = () => {
            p.i = 0;
            let colours = ShuffleArray(p.coloursArray);
            p.strokeColour.r = colours[0];
            p.strokeColour.g = colours[1];
            p.strokeColour.b = colours[2];
            colours = ShuffleArray(p.coloursArray);
            p.fillColour.r = colours[0];
            p.fillColour.g = colours[1];
            p.fillColour.b = colours[2];
        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;

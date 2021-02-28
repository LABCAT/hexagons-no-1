import React, { useRef, useEffect } from "react";
//import PlayIcon from "./PlayIcon.js";
import ShuffleArray from "./ShuffleArray.js";
import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from "../audio/hexagons-no-1.ogg";
import cueSet1 from "./cueSet1.js";

const P5Sketch = () => {
  const sketchRef = useRef();

  const Sketch = (p) => {
    p.canvas = null;

    p.canvasWidth = window.innerWidth;

    p.canvasHeight = window.innerHeight;

    p.song = null;

    p.cueSet1Completed = [];

    p.cueSet2Completed = [];

    p.i = 0;

    p.coloursArray = [0, 255, "variable"];

    p.colourSets = [];

    p.strokeColour = {
      r: 0,
      g: 0,
      b: 0,
    };

    p.fillColour = {
      r: 0,
      g: 0,
      b: 0,
    };

    p.preload = () => {
      p.song = p.loadSound(audio);
    };

    p.setup = () => {
      p.frameRate(30);
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      let colours = ShuffleArray(p.coloursArray);
      p.strokeColour.r = colours[0];
      p.strokeColour.g = colours[1];
      p.strokeColour.b = colours[2];
      colours = ShuffleArray(p.coloursArray);
      p.fillColour.r = colours[0];
      p.fillColour.g = colours[1];
      p.fillColour.b = colours[2];

      p.song.onended(p.logCredits);

      for (let i = 0; i < cueSet1.length; i++) {
        let colours = ShuffleArray(p.coloursArray);
        let colourSet = {
          strokeColour: {
            r: colours[0],
            g: colours[1],
            b: colours[2],
          },
        };
        colours = ShuffleArray(p.coloursArray);
        colourSet.fillColour = {
          r: colours[0],
          g: colours[1],
          b: colours[2],
        };
        p.colourSets.push(colourSet);
      }

      for (let i = 0; i < cueSet1.length; i++) {
        p.song.addCue(cueSet1[i].time, p.executeCueSet1, i);
      }
    };

    p.draw = () => {
      p.background(0);
      if (p.song.isPlaying()) {
        p.animateHexagons(p.width / 2, p.height / 2, p.width / 18);
        p.i = p.i + 16;
      }
    };

    p.executeCueSet1 = (currentCue) => {
      if (!p.cueSet1Completed.includes(currentCue)) {
        p.cueSet1Completed.push(currentCue);
        p.i = 0;
        p.strokeColour.r = p.colourSets[currentCue].strokeColour.r;
        p.strokeColour.g = p.colourSets[currentCue].strokeColour.g;
        p.strokeColour.b = p.colourSets[currentCue].strokeColour.b;
        p.fillColour.r = p.colourSets[currentCue].fillColour.r;
        p.fillColour.g = p.colourSets[currentCue].fillColour.g;
        p.fillColour.b = p.colourSets[currentCue].fillColour.b;
      }
    };

    p.getColourValue = (value, negation) => {
      if (value === "variable") {
        return 255 - negation;
      }
      return value;
    };

    p.animateHexagons = (x, y, r) => {
      let count = p.i - 1;
      while (count < p.i) {
        let colourAdjuster = 255 - count;
        p.strokeWeight(p.width / 288);
        p.stroke(
          p.getColourValue(p.strokeColour.r, count),
          p.getColourValue(p.strokeColour.g, count),
          p.getColourValue(p.strokeColour.b, count)
        );
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
    };

    p.hexagon = (x, y, r) => {
      const radius = r / 2;
      p.angleMode(p.RADIANS);
      var angle = p.TWO_PI / 6;
      p.beginShape();
      for (let a = p.TWO_PI / 12; a < p.TWO_PI + p.TWO_PI / 12; a += angle) {
        let sx = x + p.cos(a) * radius;
        let sy = y + p.sin(a) * radius;
        p.vertex(sx, sy);
      }
      p.endShape(p.CLOSE);
    };

    p.mousePressed = () => {
      if (p.song.isPlaying()) {
        p.song.pause();
      } else {
        if (
          parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
        ) {
          p.reset();
        }
        //document.getElementById("play-icon").classList.add("fade-out");
        p.canvas.addClass("fade-in");
        p.song.play();
      }
    };

    p.creditsLogged = false;

    p.logCredits = () => {
      if (
        !p.creditsLogged &&
        parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
      ) {
        p.creditsLogged = true;
        console.log("\n", "\n");
      }
    };

    p.reset = () => {
      p.clear();
      p.background(0);
    };

    p.updateCanvasDimensions = () => {
      p.canvasWidth = window.innerWidth;
      p.canvasHeight = window.innerHeight;
      p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.redraw();
    };

    if (window.attachEvent) {
      window.attachEvent("onresize", function () {
        p.updateCanvasDimensions();
      });
    } else if (window.addEventListener) {
      window.addEventListener(
        "resize",
        function () {
          p.updateCanvasDimensions();
        },
        true
      );
    } else {
      //The browser does not support Javascript event binding
    }
  };

  useEffect(() => {
    new p5(Sketch, sketchRef.current);
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Sketch;

import React, { useRef, useEffect } from "react";
//import PlayIcon from "./PlayIcon.js";
import ShuffleArray from "./ShuffleArray.js";
import BackgroundHexagon from './BackgroundHexagon.js';
import "./globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from "../audio/hexagons-no-1.ogg";
import midi from "../audio/hexagons-no-1.mid";
import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'

const P5Sketch = () => {
  const sketchRef = useRef();

  const Sketch = (p) => {
    p.canvas = null;

    p.canvasWidth = window.innerWidth;

    p.canvasHeight = window.innerHeight;

    p.isLoaded = false;

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

    p.noteSet1 = [];

    p.noteSet1CurrentCue = 0;

    p.hexSizeDivider = 16;

    p.innerHexCount = 1;

    p.noteSet2 = [];

    p.noteSet2CurrentCue = 1;
    
    p.backgroundHexagons = [];

    p.outroHexagons = [];

    p.outroFills = [];
    
    p.outroStrokes = [];

    p.preload = () => {
      p.song = p.loadSound(audio);
      Tone.Transport.PPQ = 3840 * 4;
      p.randomColor = require('randomcolor');
      p.outroFills = p.randomColor({luminosity: 'dark', count: 14, format: 'rgbArray'});
      p.outroStrokes = p.randomColor({luminosity: 'bright', count: 14, format: 'rgbArray'});
      Midi.fromUrl(midi).then(
        function(result) {
          
          p.noteSet1 = result.tracks[3].notes;//Sampler 1
          p.noteSet2 = result.tracks[7].notes;//Synth 3
          p.loadColours();
          p.player = new Tone.Player(audio).toMaster();
          p.player.sync().start(0);
          let lastTicks = -1;
          for (let i = 0; i < p.noteSet1.length; i++) {
            const note = p.noteSet1[i],
              { ticks } = note;
            if(ticks !== lastTicks){
              Tone.Transport.schedule(
                () => {
                  p.executeNoteSet1(p.noteSet1CurrentCue);
                  p.noteSet1CurrentCue++
                }, 
                note.time
              );
              lastTicks = ticks;
            }
          }

          lastTicks = -1;
          for (let i = 0; i < p.noteSet2.length; i++) {
            const note = p.noteSet2[i],
              { time, ticks } = note;
            if(ticks !== lastTicks){
              Tone.Transport.schedule(
                () => {
                  p.executeNoteSet2(p.noteSet2CurrentCue);
                  p.noteSet2CurrentCue++
                }, 
                time
              );
              lastTicks = ticks;
            }
          }        
          p.isLoaded = true;
        }
      );
    };

    p.setup = () => {
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.background(0);
      p.frameRate(30);
      
    };

    p.redrawBG = true;

    p.draw = () => {
      if (p.player.state === 'started' && p.isLoaded) {
        if(p.redrawBG){
          p.background(0);
        }
        for (let i = 0; i < p.backgroundHexagons.length; i++) {
            p.backgroundHexagons[i].update();
            p.backgroundHexagons[i].draw();
        }
        p.animateHexagons1(p.width / 2, p.height / 2, p.width / p.hexSizeDivider);
        p.i = p.i + 16;
        for (let i = 0; i < p.outroHexagons.length; i++) {
            p.outroHexagons[i].update();
            p.outroHexagons[i].draw();
        }
      }
    };

    p.executeNoteSet1 = (currentCue) => {
      if (!p.cueSet1Completed.includes(currentCue)) {
        p.cueSet1Completed.push(currentCue);
        p.i = 0;
        p.strokeColour.r = p.colourSets[currentCue].strokeColour.r;
        p.strokeColour.g = p.colourSets[currentCue].strokeColour.g;
        p.strokeColour.b = p.colourSets[currentCue].strokeColour.b;
        p.fillColour.r = p.colourSets[currentCue].fillColour.r;
        p.fillColour.g = p.colourSets[currentCue].fillColour.g;
        p.fillColour.b = p.colourSets[currentCue].fillColour.b;
        if(currentCue > 78){
          p.hexSizeDivider = 12;
          p.innerHexCount = 2;
        }
        if(currentCue >= 119){
          p.redrawBG = false;
          p.strokeColour.r = p.outroStrokes[currentCue-119][0];
          p.strokeColour.g = p.outroStrokes[currentCue-119][1];
          p.strokeColour.b = p.outroStrokes[currentCue-119][2];
          p.fillColour.r = p.outroFills[currentCue-119][0];
          p.fillColour.g = p.outroFills[currentCue-119][1];
          p.fillColour.b = p.outroFills[currentCue-119][2];
        }
        if(currentCue === 132){
          const delayAmount = parseInt(p.noteSet1[p.noteSet1.length - 1].duration * 1000) / 24;
          let size = (p.width / p.hexSizeDivider) * 4;
          const colours = p.randomColor({count: 24});
          for (let i = 0; i < 24; i++) {
            setTimeout(
                function () {
                  const colour = p.color(colours[i]);
                  p.outroHexagons.push(new BackgroundHexagon(p, p.width / 2, p.height / 2, colour, true, size));
                  p.hexagon(p.width / 2, p.height / 2, size);
                  size = size - size / 24;
                },
                (delayAmount * i)
            );
          }
        }
      }
    };

    p.executeNoteSet2 = (currentCue) => {
      if (!p.cueSet2Completed.includes(currentCue)) {
        p.cueSet2Completed.push(currentCue);
        if(currentCue % 9 === 1){
          p.backgroundHexagons = [];
        } 
        const colour = currentCue === 27 ? 0 : p.color(p.random(255), p.random(255), p.random(255)),
          hasFill = (currentCue > 18 && currentCue <= 27);
        p.backgroundHexagons.push(new BackgroundHexagon(p, p.width / 2, p.height / 2, colour, hasFill));
      }
    };

    p.animateHexagons1 = (x, y, r) => {
      let count = p.i - 1;
      while (count < p.i) {
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
          63 + (count / 8)
        );
        for(let i = 1; i <= p.innerHexCount; i++) {
          p.hexagon(x + count, y + count, r / i);
          p.hexagon(x + count, y - count, r / i);
          p.hexagon(x + count, y, r / i);
          p.hexagon(x - count, y, r / i);
          p.hexagon(x - count, y + count, r / i);
          p.hexagon(x - count, y - count, r / i);
          p.hexagon(x, y + count, r / i);
          p.hexagon(x, y - count, r / i);
        }
        
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

    p.loadColours = () => {
      for (let i = 0; i < p.noteSet1.length; i++) {
        const colours1 = ShuffleArray(p.coloursArray);
        const colourSet = {
          strokeColour: {
            r: colours1[0],
            g: colours1[1],
            b: colours1[2],
          },
        };
        const colours2 = colours1.reverse();
        colourSet.fillColour = {
          r: colours2[0],
          g: colours2[1],
          b: colours2[2],
        };
        p.colourSets.push(colourSet);
      }
    }


    p.getColourValue = (value, negation) => {
      if (value === "variable") {
        return 255 - negation;
      }
      return value;
    };

    p.mousePressed = () => {
      if (p.player.state === "started") {
        // Use the Tone.Transport to pause audio
        Tone.Transport.pause();
      } 
      else if (p.player.state === "stopped") {
        // Use the Tone.Transport to start again
        Tone.Transport.start();
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

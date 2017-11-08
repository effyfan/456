let url1 = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/static/0,0,1,0,0/1024x512?access_token='
/////////////////////////////////////////////////////////////////lat,long,zoom,angle,angle//////////
let apiKey = 'pk.eyJ1IjoiZWZmeWZhbiIsImEiOiJjajh6N3psdGMwZjZtMzJvNGx5Ym54aTdkIn0.BcJIyPZ2FXZBbVWg71unOA'
let emissions;

let zoom = 1;
let particles = [];
let myMap;
let canvas;
let mappa;

let options = {
  lat: 0,
  lng: 0,
  zoom: 1,
  style: 'mapbox://styles/effyfan/cj91vol42g93z2rmiqyhjfref'
}


function preload() {
  emissions = loadStrings('./scripts/emissions2.csv',callback);
}

function callback(e){
  console.log(e);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  mappa = new Mappa('Mapboxgl', apiKey);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  //myMap.onChange(drawPoints);

  fill(70, 200, 200);
  stroke(100);
  imageMode(CENTER);
}

function draw() {
  clear();
  // draw red circles indicate emissions amount
    for (let i = 0; i < emissions.length; i++) {
      let data = emissions[i].split(",");
      let latitude = data[1];
      let longitude = data[2];
      let co2 = data[3];
      let popl = data[4];
      let area = co2 * 100000 / popl
      console.log(area);
      let d = sqrt(area/PI);

      noStroke();
      fill(255, 0, 0, 100);
      let pos = myMap.latLngToPixel(latitude, longitude);
      ellipse(pos.x, pos.y, d, d);

      // draw emission animation
      if (area > emiinp){
       for (let j = 0; j < 1; j++) {
          let p = new Particle(pos.x, pos.y, d/5);
          particles.push(p);
       }
       for (let j = particles.length - 1; j >= 0; j--) {
          particles[j].update();
          particles[j].show();
          if (particles[j].finished()) {
          // remove this particle
          particles.splice(j, 1);
       }
      }
    }
  }
}


class Particle {
  constructor(a, b, dia) {
    this.x = a;
    this.y = b;
    this.dia = dia;
    this.vx = random(-dia/50, dia/50);
    this.vy = random(-0.05, -dia/100);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1;
  }

  show() {
    noStroke();
    //stroke(255);
    fill(100, this.alpha);
    ellipse(this.x, this.y, this.dia);
  }
}

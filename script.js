//  File Name: script.js
//  Author: Artem Suprun
//  Date: 06/14/2022
//  Summary: A JS script file for the rain folder, which runs a
//  program on the javascript canvas.
//

const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
let w = canvas.width;
let h = canvas.height;
const v = [];
let angle = 0.0;

// projection of the cube
const projection = [
  [1], [0], [0],
  [0], [1], [0],
  [0], [0], [0]
];

// Vertex class
class Vertex {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = 5;
  }
}

// Vertex class
class Plane {
  constructor(v1, v2, v3, v4, vList, color) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.v4 = v4;
    this.vList = vList;
    this.color = color;
    this.z = ((vList[v1].z + vList[v2].z + vList[v3].z + vList[v4].z) / 4);
  }
}

// background() function to set canvas color
const background = (color) => {
  ctx.fillStyle = color;
  ctx.fillRect(-w, -h, w*2, h*2);
}

// setSize(), set canvas size
function setSize(x, y) {
  ctx.canvas.width = x;
  ctx.canvas.height = y;
  w = x;
  h = y;
}

// setVertex()  creates and sets the vertexs into position
function setVertex(size) {
  let d = 50;
  for (let i = 0; i < size; i++) {
    let vx = ((-1) ** (i));
    let vy = ((-1) ** (Math.floor(i/2)));
    let vz = ((-1) ** (Math.floor(i/4)));
    console.log(vx, vy, vz);
    v[i] = new Vertex(vx * d, vy * d, vz * d);
  }
}

// point()  Draws the vertex onto the canvas
function point(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// connect()  Creates the edge
function connect(i, j, vList) {
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(vList[i].x, vList[i].y);
  ctx.lineTo(vList[j].x, vList[j].y);
  ctx.stroke();
}

// side() creates planes on the sides
function side(pList) {
  /*ctx.beginPath();
  ctx.moveTo();
  ctx.lineTo();
  ctx.lineTo();
  ctx.lineTo();
  ctx.fillStyle = ;
  ctx.fill();*/
}

// matMul() multiplies a matrix with a vertex point
function matMul(matrix, v1) {
  let c0r0 = matrix[0],
    c1r0 = matrix[1],
    c2r0 = matrix[2];
  let c0r1 = matrix[3],
    c1r1 = matrix[4],
    c2r1 = matrix[5];
  let c0r2 = matrix[6],
    c1r2 = matrix[7],
    c2r2 = matrix[8];
  let x = v1.x;
  let y = v1.y;
  let z = v1.z;
  let resultX = x * c0r0 + y * c0r1 + z * c0r2;
  //let resultX = x * c0r0 + y * c1r0 + z * c2r0;
  let resultY = x * c1r0 + y * c1r1 + z * c1r2;
  //let resultY = x * c0r1 + y * c1r1 + z * c2r1;
  let resultZ = x * c2r0 + y * c2r1 + z * c2r2;
  //let resultZ = x * c0r2 + y * c1r2 + z * c2r2;
  
  const mv = new Vertex(resultX, resultY, resultZ);
  return mv;
}

// Setup
function setup() {
  setSize(500, 500);
  ctx.transform(1, 0, 0, -1, 0, h);
  ctx.translate(w/2, h/2);
  //ctx.rotate(-90 * (Math.PI / 180));
  ctx.scale(2, 2);
  ctx.globalAlpha = 0.2;
  setVertex(8);
}

// Draw
function draw() {
  background("black")
  
  // rotations
  let rotationX = [
    [1], [0],               [0],
    [0], [Math.cos(angle)], [-Math.sin(angle)],
    [0], [Math.sin(angle)], [Math.cos(angle)]
  ];
  let rotationY = [
    [Math.cos(angle)],  [0], [Math.sin(angle)],
    [0],                [1], [0],
    [-Math.sin(angle)], [0], [Math.cos(angle)]
  ];
  let rotationZ = [
    [Math.cos(angle)], [-Math.sin(angle)], [0],
    [Math.sin(angle)], [Math.cos(angle)],  [0],
    [0],               [0],                [1]
  ];
  
  let prevV = [v.length];
  // Draws the moving vertices onto the canvas
  for (let i = 0; i < v.length; i++){
    let rv = matMul(rotationY, v[i]);
    rv = matMul(rotationX, rv);
    rv = matMul(rotationZ, rv);
    let pv = matMul(projection, rv);
    prevV[i] = pv;
    point(pv.x, pv.y, v[i].r);
  }
  
  // connects the vertices
  for (let i = 0; i < (v.length/2); i++) {
    if (i < v.length/4) {
      connect(i, (i+i+1)%4, prevV);
      connect(i+4, ((i+i+1)%4)+4, prevV);
    }else {
      connect(i, (i*2)%4, prevV);
      connect(i+4, ((i*2)%4)+4, prevV);
    }
    connect(i, i+4, prevV);
  }
  
  // creates z indexed planes
  let p = [
    new Plane(0, 1, 3, 2, prevV, "blue"),
    new Plane(4, 5, 7, 6, prevV, "red"),
    new Plane(0, 4, 5, 1, prevV, "green"),
    new Plane(0, 4, 6, 2, prevV, "pink"),
    new Plane(3, 7, 5, 1, prevV, "yellow"),
    new Plane(3, 7, 6, 2, prevV, "purple")
  ];
  // orders the z index of the planes
  
  // draws the plains
  
  /*// connects the edges
  for (let i = 0; i < (v.length/2); i++) {
    
  }*/
  
  angle += 0.012;
}

// The main output
setup();
var interval = setInterval(draw, 10);

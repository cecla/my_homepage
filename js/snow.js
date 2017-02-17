var glSnow;
var shaderProgram;
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

var lastTime = 0;

function initGLSnow(canvas){
	try{
		var displayWidth = canvas.clientWidth;
		var displayHeight = canvas.clientHeight;

		if(canvas.width != displayWidth || canvas.height != displayHeight) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;
		}
		glSnow = canvas.getContext("experimental-webgl");
		glSnow.viewportWidth = canvas.width;
		glSnow.viewportHeight = canvas.height;

		console.log(glSnow.viewportWidth);
	} catch(e) {
		console.log(e);
	}
	if(!glSnow) {
		alert("Sorry, not working");
	} else {
		var extensions = glSnow.getSupportedExtensions();

		console.log(glSnow);
		console.log(extensions);
	}
}

function getShaderSnow(gl, id){
	var shaderScript = document.getElementById(id);

	if(!shaderScript){
		return null;
	}

	var str ='';
	var k = shaderScript.firstChild;
	while(k){
		if(k.nodeType == 3){
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if(shaderScript.type == "x-shader/x-fragment"){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if(shaderScript.type == "x-shader/x-vertex"){
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.log("wrong in getShader")
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShadersSnow(){
	var fragmentShader = getShaderSnow(glSnow, "shader-fs");
	var vertexShader =  getShaderSnow(glSnow, "shader-vs");

	shaderProgram = glSnow.createProgram();
	glSnow.attachShader(shaderProgram, vertexShader);
	glSnow.attachShader(shaderProgram, fragmentShader);
	glSnow.linkProgram(shaderProgram);

	if(!glSnow.getProgramParameter(shaderProgram, glSnow.LINK_STATUS)) {
		console.log("wrong in initShader")
		alert("Couldn't initialise shaders");
	}

	glSnow.useProgram(shaderProgram);
	//reference to position attribute
	shaderProgram.vertexPositionAttribute = glSnow.getAttribLocation(shaderProgram, "aVertexPosition");
	glSnow.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	//reference to color attribute
	shaderProgram.textureCoordAttribute = glSnow.getAttribLocation(shaderProgram, "aTextureCoord");
	glSnow.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = glSnow.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = glSnow.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.samplerUniform = glSnow.getUniformLocation(shaderProgram, "uSampler");
	shaderProgram.colorUniform = glSnow.getUniformLocation(shaderProgram, "uColor");
	shaderProgram.opacityUniform = glSnow.getUniformLocation(shaderProgram, "uOpacity");
	shaderProgram.smokeUniform = glSnow.getUniformLocation(shaderProgram, "smoke");
}

function handleLoadedTextureSnow(texture){
	glSnow.pixelStorei(glSnow.UNPACK_FLIP_Y_WEBGL, true);
	glSnow.bindTexture(glSnow.TEXTURE_2D, texture);
	glSnow.texImage2D(glSnow.TEXTURE_2D, 0, glSnow.RGBA, glSnow.RGBA, glSnow.UNSIGNED_BYTE, texture.image);
	glSnow.texParameteri(glSnow.TEXTURE_2D, glSnow.TEXTURE_MAG_FILTER, glSnow.LINEAR);
	glSnow.texParameteri(glSnow.TEXTURE_2D, glSnow.TEXTURE_MIN_FILTER, glSnow.LINEAR);
	glSnow.texParameteri(glSnow.TEXTURE_2D, glSnow.TEXTURE_WRAP_S, glSnow.CLAMP_TO_EDGE);
// Prevents t-coordinate wrapping (repeating).
	glSnow.texParameteri(glSnow.TEXTURE_2D, glSnow.TEXTURE_WRAP_T, glSnow.CLAMP_TO_EDGE);

	glSnow.bindTexture(glSnow.TEXTURE_2D, null);
}

var particleTexture;
var textTexture;
function initTextureSnow(){
	particleTexture = glSnow.createTexture();
	particleTexture.image = new Image();
	particleTexture.image.onload = function(){
		handleLoadedTextureSnow(particleTexture);
	}

	particleTexture.image.src = "./images/snow1.png";

	textTexture = glSnow.createTexture();
	textTexture.image = new Image();
	textTexture.image.onload = function(){
		handleLoadedTextureSnow(textTexture);
	}

	textTexture.image.src = "./images/ceciliaLagerwall1.png";

	masterTexture = glSnow.createTexture();
	masterTexture.image = new Image();
	masterTexture.image.onload = function(){
		handleLoadedTextureSnow(masterTexture);
	}

	masterTexture.image.src = "./images/master1.png";
}

function mvPushMatrixSnow(){
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrixSnow(){
	if(mvMatrixStack.length == 0){
		throw "invalid popMatrix";
	}
	mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees){
	return degrees * Math.PI / 180;
}

function setMatrixUniformsSnow(){
	glSnow.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	glSnow.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

var zoom = -20;

var particleVertexPositionBuffer;
var particleVertexTextureCoordBuffer;

var textVertexPositionBuffer;
var textVertexTextureCoordBuffer;
function initBuffersSnow(){
	//PARTICLES
	particleVertexPositionBuffer = glSnow.createBuffer();
	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, particleVertexPositionBuffer);
	var vertices = [-1 , -1, 0.0,
				1, -1, 0.0,
				-1, 1, 0.0,
				1, 1, 0.0];

	glSnow.bufferData(glSnow.ARRAY_BUFFER, new Float32Array(vertices), glSnow.STATIC_DRAW);
	particleVertexPositionBuffer.itemSize = 3;
	particleVertexPositionBuffer.numItems = 4;

	particleVertexTextureCoordBuffer = glSnow.createBuffer();
	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, particleVertexTextureCoordBuffer);
	var textureCoords = [0.0, 0.0,
						1.0, 0.0,
						0.0, 1.0,
						1.0, 1.0];
	glSnow.bufferData(glSnow.ARRAY_BUFFER, new Float32Array(textureCoords), glSnow.STATIC_DRAW);
	particleVertexTextureCoordBuffer.itemSize = 2;
	particleVertexTextureCoordBuffer.numItems = 4;

	//TEXT
	textVertexPositionBuffer = glSnow.createBuffer();
	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, textVertexPositionBuffer);
	var vertices = [-5 , -1, 0.0,
				5, -1, 0.0,
				-5, 1, 0.0,
				5, 1, 0.0];

	glSnow.bufferData(glSnow.ARRAY_BUFFER, new Float32Array(vertices), glSnow.STATIC_DRAW);
	textVertexPositionBuffer.itemSize = 3;
	textVertexPositionBuffer.numItems = 4;

	textVertexTextureCoordBuffer = glSnow.createBuffer();
	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, textVertexTextureCoordBuffer);
	var textureCoords = [0.0, 0.0,
						1.0, 0.0,
						0.0, 1.0,
						1.0, 1.0];
	glSnow.bufferData(glSnow.ARRAY_BUFFER, new Float32Array(textureCoords), glSnow.STATIC_DRAW);
	textVertexTextureCoordBuffer.itemSize = 2;
	textVertexTextureCoordBuffer.numItems = 4;
}

function drawSnowParticle(){
	glSnow.activeTexture(glSnow.TEXTURE0);
	glSnow.bindTexture(glSnow.TEXTURE_2D, particleTexture);
	glSnow.uniform1i(shaderProgram.samplerUniform, 0);

	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, particleVertexTextureCoordBuffer);
	glSnow.vertexAttribPointer(shaderProgram.textureCoordAttribute, particleVertexTextureCoordBuffer.itemSize, glSnow.FLOAT, false, 0, 0);

	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, particleVertexPositionBuffer);
	glSnow.vertexAttribPointer(shaderProgram.vertexPositionAttribute, particleVertexPositionBuffer.itemSize, glSnow.FLOAT, false, 0, 0);

	setMatrixUniformsSnow();
	glSnow.drawArrays(glSnow.TRIANGLE_STRIP, 0, particleVertexPositionBuffer.numItems);
}

function drawText(tex){
	glSnow.activeTexture(glSnow.TEXTURE1);
	glSnow.bindTexture(glSnow.TEXTURE_2D, tex);

	glSnow.uniform1i(shaderProgram.samplerUniform, 1);

	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, textVertexTextureCoordBuffer);
	glSnow.vertexAttribPointer(shaderProgram.textureCoordAttribute, textVertexTextureCoordBuffer.itemSize, glSnow.FLOAT, false, 0, 0);

	glSnow.bindBuffer(glSnow.ARRAY_BUFFER, textVertexPositionBuffer);
	glSnow.vertexAttribPointer(shaderProgram.vertexPositionAttribute, textVertexPositionBuffer.itemSize, glSnow.FLOAT, false, 0, 0);

	setMatrixUniformsSnow();
	glSnow.drawArrays(glSnow.TRIANGLE_STRIP, 0, textVertexPositionBuffer.numItems);
}

var effectiveFPMS = 60/1000;

var max = 60;
var min = 10;

SnowParticle.prototype.animate = function(elapsedTime){
	this.y -= 0.01 * this.v * effectiveFPMS * elapsedTime;

	this.x += Math.cos(timePassed)/100;
	//this.z += Math.cos(Math.random()*2 * Math.PI)*effectiveFPMS;

	//dead - reset
	if(this.y < -20){
		this.y = Math.random() * 40 + 20;
		this.x = Math.random() * 40 - 20;
		//this.z = Math.random()*2*Math.sqrt(4 - Math.pow(this.x, 2)) - Math.sqrt(4 - Math.pow(this.x, 2));
		this.smoke = false;
	}
};

SnowParticle.prototype.draw = function(){
	mvPushMatrixSnow();
	//first rotate to face the viewer and then translate the particle to right place
	mat4.translate(mvMatrix, [this.x, this.y, this.z]);
	//mat4.rotate(mvMatrix, degToRad(-rFloor), [0.0, 1.0, 0.0]);

	//set color  and opacity
	glSnow.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
	glSnow.uniform1f(shaderProgram.opacityUniform, this.a);
	glSnow.uniform1f(shaderProgram.smokeUniform, 0.0);
	drawSnowParticle();

	mvPopMatrixSnow();
};

//starting values for particles
function SnowParticle(x, z){
	this.r = 1.0;
	this.g = 1.0;
	this.b = 1.0;
	this.a = 1.0+(z/30.0);
	this.v = Math.random()+2;
	this.y = Math.random() * 40 + 20;
	this.x = x;
	this.z = z;
	this.smoke = false;
}

var particles = [];
function initWorldObjectsSnow(){
	var numParticles = 100;

	//create particles
	console.log("using this");
	for(var i = 0; i < numParticles; i++){
		var x = Math.random() * 40 - 20;
		var z = -(Math.random() * 30);
		particles.push(new SnowParticle(x, z));
	}
}

var rFloor = 0;
function drawSceneSnow(){
	glSnow.viewport(0, 0, glSnow.viewportWidth, glSnow.viewportHeight);
	glSnow.clear(glSnow.COLOR_BUFFER_BIT | glSnow.DEPTH_BUFFER_BIT);

	mat4.perspective(45, glSnow.viewportWidth/glSnow.viewportHeight, 0.1, 100.0, pMatrix);

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, zoom]);
	//mat4.rotate(mvMatrix, degToRad(rFloor), [0.0, 1.0, 0.0]);

	mvPushMatrixSnow();
	//move and rotate particle
	mat4.translate(mvMatrix, [0.0, -4.0, 0.0]);

	mvPopMatrixSnow();

	glSnow.blendFunc(glSnow.SRC_ALPHA, glSnow.ONE);
	glSnow.enable(glSnow.BLEND);

	for(var i in particles){
		particles[i].draw();
	}

	mvPushMatrixSnow();

	mat4.translate(mvMatrix, [0, 1, 0]);
	//mat4.rotate(mvMatrix, degToRad(-rFloor), [0.0, 1.0, 0.0]);

	//set color  and opacity
	glSnow.uniform3f(shaderProgram.colorUniform, 255, 255, 255);
	glSnow.uniform1f(shaderProgram.opacityUniform, 0.7);
	glSnow.uniform1f(shaderProgram.smokeUniform, 0.0);

	drawText(textTexture);

	mvPopMatrixSnow();

	mvPushMatrixSnow();

	mat4.translate(mvMatrix, [0, -1, 0]);
	//mat4.rotate(mvMatrix, degToRad(-rFloor), [0.0, 1.0, 0.0]);

	//set color  and opacity
	glSnow.uniform3f(shaderProgram.colorUniform, 255, 255, 255);
	glSnow.uniform1f(shaderProgram.opacityUniform, 0.5);
	glSnow.uniform1f(shaderProgram.smokeUniform, 0.0);

	drawText(masterTexture);

	mvPopMatrixSnow();

}

var timePassed = 0;
var elapsed = 0;
function animateSnow(){
	var timeNow = new Date().getTime();
	if(lastTime != 0){
		elapsed = timeNow - lastTime;
		timePassed += elapsed;

		rFloor += (10 * elapsed) / 1000.0;

		// make each particle move
		for(var i in particles){
			particles[i].animate(elapsed);
		}
	}
	lastTime = timeNow;
}

function tickSnow(){
	requestAnimFrame(tickSnow);
	drawSceneSnow();
	animateSnow();

}

function webGLStartSnow(){
	console.log("snow");

	var canvas = document.getElementById("gl-snow");

	//initialise WebGL
	initGLSnow(canvas);
	initShadersSnow();
	initBuffersSnow(); //hold the details of the triangle and the square
	initTextureSnow();
	initWorldObjectsSnow();

	//background
	//gl.clearColor(0.0, 0.0, 0.0, 1.0);

	tickSnow();
}
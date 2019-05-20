// 1331 cubes forming an RGB cube
// Implements  glow for lighting effects
// Allows saving the image with a transparent background

let animate = false;

let canvas = document.getElementById('rgbCube');
    canvas.width =  600;
    canvas.height = 600;

let engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
});

let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0,0,0,0);
    
let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene);
    light0.intensity = .25;
let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-50, -80, -50), scene);
let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(50, 80, 50), scene);

let camera = new BABYLON.ArcRotateCamera("Camera", -3*Math.PI/4, 5.5*Math.PI/8, 24, new BABYLON.Vector3(0,0,0), scene);
    
scene.activeCamera.attachControl(canvas);

let glowLayer = new BABYLON.GlowLayer("glowLayer", scene);
    glowLayer.intensity = .2;

for (let zb = 0; zb <= 1; zb += .1)
for (let yg = 0; yg <= 1; yg += .1) 
for (let xr = 0; xr <= 1; xr += .1) {
    let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = new BABYLON.Color3(xr, yg, zb);
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        mat.alpha = .75;
        mat.emissiveColor = new BABYLON.Color3(xr/5, yg/5, zb/5);;

    let mesh = BABYLON.MeshBuilder.CreateBox("box", {size: .65}, scene);
        mesh.position = new BABYLON.Vector3((xr - .5)*10, (yg - .5)*10, (zb - .5)*10);
        mesh.material = mat;
}

engine.runRenderLoop(function()  {
    updateScene()
    scene.render();
});

function updateScene(){
    if (animate) camera.alpha += .005;
}


        /////////////////////
        /**    GUI Menu   **/
        /////////////////////


let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

let panelOptionsContainer = new BABYLON.GUI.Rectangle();
    panelOptionsContainer.name = 'Options Menu';
    panelOptionsContainer.cornerRadius = 5;
    panelOptionsContainer.thickness = 1;
    panelOptionsContainer.color = 'black';
    panelOptionsContainer.background = "lightgray";
    panelOptionsContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panelOptionsContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panelOptionsContainer.height= '5px';
    panelOptionsContainer.width= '80px';
    panelOptionsContainer.isPointerBlock = true;
    panelOptionsContainer.onPointerEnterObservable.add(()=>{ panelOptionsContainer.height= '150px' });
    panelOptionsContainer.onPointerOutObservable.add(()=>{ panelOptionsContainer.height= '5px' });

advancedTexture.addControl( panelOptionsContainer);   


let panelOptions = new BABYLON.GUI.StackPanel();
    formatMenuPanel(panelOptions);
    panelOptions.isPointerBlock = true;

panelOptionsContainer.addControl(panelOptions)


let buttonDownload = BABYLON.GUI.Button.CreateSimpleButton('download button', 'Save/DL');
    formatButton(buttonDownload);
    buttonDownload.onPointerUpObservable.add(() =>{
        BABYLON.Tools.CreateScreenshotUsingRenderTarget( engine, scene.cameras[0],  { width: 1200, height: 1200 } );
    });

panelOptions.addControl(buttonDownload);  


let glowHeader = new BABYLON.GUI.TextBlock();
    glowHeader.text = "Glow: .2";
    glowHeader.height = "18px";
    glowHeader.color    =  "black";
    glowHeader.fontSize =  10;
    glowHeader.paddingTop = 10;

panelOptions.addControl(glowHeader); 


let glowSlider = new BABYLON.GUI.Slider();
    glowSlider.minimum = 0;
    glowSlider.maximum = 2;
    glowSlider.value = .2;
    glowSlider.step = .01;

    glowSlider.thumbWidth = '15px';        
    glowSlider.thumbHeight = '15px';
    glowSlider.isThumbCircle = true;

    glowSlider.height = "12px";
    glowSlider.width = "60px";

    glowSlider.onValueChangedObservable.add((value) => {
        glowLayer.intensity = value;
        glowHeader.text = "Glow: "+value;
    });

panelOptions.addControl(glowSlider);   


let alphaHeader = new BABYLON.GUI.TextBlock();
    alphaHeader.text = "Alpha: .75";
    alphaHeader.height = "18px";
    alphaHeader.color    =  "black";
    alphaHeader.fontSize =  10;
    alphaHeader.paddingTop = 10;

panelOptions.addControl(alphaHeader); 


let alphaSlider = new BABYLON.GUI.Slider();
    alphaSlider.minimum = 0;
    alphaSlider.maximum = 1;
    alphaSlider.value = .75;
    alphaSlider.step = .01;

    alphaSlider.thumbWidth = '15px';        
    alphaSlider.thumbHeight = '15px';
    alphaSlider.isThumbCircle = true;

    alphaSlider.height = "12px";
    alphaSlider.width = "60px";

    alphaSlider.onValueChangedObservable.add((value) => {
        scene.materials.forEach( mat => mat.alpha = value );
        alphaHeader.text = "Alpha: " + value; 
    });

panelOptions.addControl(alphaSlider);   



function formatButton(button){
    button.width  =  "60px"
    button.height =  "22px";
    button.color    =  "black";
    button.fontSize =  10;
    button.paddingTop    =  5;
    button.cornerRadius =  5;
    button.background =  "white";
    button.background = '#eeeeee';
    button.shadowBlur = 3;
    button.shadowOffsetX = 2.5;
    button.shadowOffsetY = 3;
    button.shadowColor = '#555'
}

function formatMenuPanel(panel){
    panel.width = "80px";
    panel.height = "150px";
    panel.cornerRadius = 5;
    panel.thickness = 1;
    panel.color = 'black';
    panel.background = "lightgray";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
}
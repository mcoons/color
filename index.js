// 1331 cubes forming an RGB cube
// Implements  glow for lighting effects
// Allows saving the image with a transparent background

// simple variable to toggle animation
let animate = false;

// define an object array to hold our meshes for easy access
let objects = [];

// get the canvas element in the html and set its size
let canvas = document.getElementById('rgbCube');
    canvas.width =  800;
    canvas.height = 800;
    canvas.style.width = 800;
    canvas.style.height = 800;

// define an engine to run the canvas setting required attributes for picture downloading
let engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true
});

// define the scene that the engine will render
let scene = new BABYLON.Scene(engine);
    // define the scene background color (0 alpha is clear)
    scene.clearColor = new BABYLON.Color4(0,0,0,0);
    
// add lights to the scene    
let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene);
    light0.intensity = .25;
let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-50, -80, -50), scene);
let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(50, 80, 50), scene);

// add a camera to the scene
let camera = new BABYLON.ArcRotateCamera("Camera", -7*Math.PI/4, 2.5*Math.PI/8, 24, new BABYLON.Vector3(0,0,0), scene);
    
// attach a controller to the camera
scene.activeCamera.attachControl(canvas);

// set a glow layer if desired
let glowLayer = new BABYLON.GlowLayer("glowLayer", scene);
    glowLayer.intensity = .2;


addObjects();    

function addObjects(){

    //createGround();

    function createGround(){
        // create a ground mesh using a height map
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("my ground mesh", "textures/image.jpg", 20, 20, 100, 0, 1, scene, false);
            ground.position.y = -6.5;

        // create the material for the ground
        var groundMaterial = new BABYLON.StandardMaterial("my ground material", scene);
            groundMaterial.diffuseTexture = new BABYLON.Texture("textures/image.jpg", scene);
            groundMaterial.diffuseTexture.uScale = 1;
            groundMaterial.diffuseTexture.vScale = 1;
            groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            
            // add the ground material to the ground mesh
            ground.material = groundMaterial;
    }

    // add objects to the scene
    for (let xr = 0; xr <= 1; xr += .15) 
    for (let yg = 0; yg <= 1; yg += .15) 
    for (let zb = 0; zb <= 1; zb += .15)
    {
        // create a material for the mesh and set various aspects
        let mat = new BABYLON.StandardMaterial("object material("+xr+","+yg+","+zb+")", scene);
            mat.diffuseColor = new BABYLON.Color3(xr, yg, zb);
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            mat.alpha = 1;
            mat.emissiveColor = new BABYLON.Color3(xr/5, yg/5, zb/5);

        // create a mesh in the scene and set its position and material
        // let mesh = BABYLON.MeshBuilder.CreateBox("box("+xr+","+yg+","+zb+")", {size: .65}, scene);
        let mesh = BABYLON.MeshBuilder.CreateSphere("sphere("+xr+","+yg+","+zb+")", {size: .65}, scene);
            mesh.position = new BABYLON.Vector3((xr - .5)*10, (yg - .5)*10, (zb - .5)*10);
            mesh.material = mat;

        // add the mesh to an objects array for easy access
        objects.push(mesh);
    }

}

// have the engine run a continuous render loop
engine.runRenderLoop(function()  {
    updateScene();
    scene.render();
});

// function to update objects in the scene
function updateScene(){
    if (animate){
        objects.forEach( obj => { obj.rotation.y +=.01 } );
    }
}


        /////////////////////
        /**    GUI Menu   **/
        /////////////////////


createGUI();

function  createGUI(){

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
            BABYLON.Tools.CreateScreenshotUsingRenderTarget( engine, scene.cameras[0],  { width: 3000, height: 3000 } );
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
        alphaHeader.text = "Alpha: 1";
        alphaHeader.height = "18px";
        alphaHeader.color    =  "black";
        alphaHeader.fontSize =  10;
        alphaHeader.paddingTop = 10;

    panelOptions.addControl(alphaHeader); 


    let alphaSlider = new BABYLON.GUI.Slider();
        alphaSlider.minimum = 0;
        alphaSlider.maximum = 1;
        alphaSlider.value = 1;
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

}
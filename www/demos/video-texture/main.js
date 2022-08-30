// Include BabylonJS TS definions
/// <reference path="https://preview.babylonjs.com/babylon.d.ts"/>

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

/**
* 
* Global vars  
*/

var engine = null;
var scene = null;
var sceneToRender = null;

// commonMaterials
var commonMaterials = null
var debugButton = null;

// video texture vars
var videoMaterialTexture = null;
var videoMaterial = null;
var videoTexture = null;
var videoPlaneMesh = null;
var videoBox = null;
var streaming = null;
// var videoDome = null;

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    scene = new BABYLON.Scene(engine);

    // init our project Materials
    commonMaterials = new CommonMaterials(BABYLON, scene)
    streaming = new Streaming()


    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("arcR", -Math.PI / 2, Math.PI / 2, 15, BABYLON.Vector3.Zero(), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    camera.target.y = 2 // move up 


    // Lighting 
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(3, 3, 0), scene);
    light.intensity = 0.9;

    // ground plane
    var ground = BABYLON.Mesh.CreateGround("ground", 8, 8, 2, scene);
    ground.material = commonMaterials.groundMaterial();


    // Video texture on a plane (16:9 aspect ratio)
    let scale = 3
    let height = 9 / scale
    let width = 16 / scale
    let depth = 1.5

    let size = {
        width: width,
        height: height,
        depth: depth,
    }

    var videoPlaneOptions = {
        height: height,
        width: width,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };

    videoPlaneMesh = BABYLON.MeshBuilder.CreatePlane("plane", videoPlaneOptions, scene);
    videoPlaneMesh.position = new BABYLON.Vector3(0, height + 2, -2);


    let arthur = '../../assets/textures/arthur.mp4';

    // Alternate load from a URL
    // let bear = 'https://dynamicgamesdeveloper.github.io/Video/Bear.webm';

    var videos = [arthur]; // this Array may contain alternate video format and resolutions

    // Load Video
    commonMaterials.createVideoMaterialAndTexture(videos, false, false).then((videoTM) => {
        videoMaterial = videoTM.videoMaterial
        videoPlaneMesh.material = videoMaterial
        videoTexture = videoTM.videoTexture

        // videoTexture.video is our target video element
        //  apply attributes directly  
        videoTexture.video.loop = true;
        videoTexture.video.autoplay = true;
        videoTexture.video.pause(); // stop the video from playing 
/*
// Optional Tile texture
        videoPlaneMesh.material.diffuseTexture.uScale = 1; //Repeat 1 times on the Vertical Axes
        videoPlaneMesh.material.diffuseTexture.vScale = 1;  // Repeat 1.2 times on the Horizontal Axes
        videoPlaneMesh.material.backFaceCulling = false; //Always show the front and the back of an element
*/

        if (videoTexture) {
            videoBox = commonMaterials.makeCube("videoBox", videoMaterial, videoTexture, size, false)
            videoBox.position = new BABYLON.Vector3(0, height / 2, -2);
        }
    }).catch(e => console.log(e))


    // Numbered Box
    var mat = new BABYLON.StandardMaterial("mat", scene);
    var texture = new BABYLON.Texture("../../assets/textures/numbers.jpg", scene);

    let box2 = commonMaterials.makeCube("box", mat, texture, {
        width: 2,
        height: 2,
        depth: 2,
    }, true)

    box2.position = new BABYLON.Vector3(0, height / 2, 1);



    /**
     * 
     * Load GUI UI https://doc.babylonjs.com/toolsAndResources/tools/guiEditor#loading-from-the-snippet-server
     * 
     * // our template
     * /// gui snip BZP7AM  https://gui.babylonjs.com/#BZP7AM
    
    */

    //UI Button Show Debug
    commonMaterials.createGUIButton("Debug", "right", "top").then((gui) => {
        debugButton = gui.button
        gui.button.onPointerUpObservable.add(function () {
            scene.debugLayer.show()
        });
        gui.button.isVisible = !gui.button.isVisible
    }).catch(e => console.log(e));


    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);


    advancedTexture.parseFromSnippetAsync("#BZP7AM#6").then((gui) => {
 
        let toggleMenu = advancedTexture.getControlByName("toggleMenu");
        let menu = advancedTexture.getControlByName("menu");
        let toggleMenuButton = advancedTexture.getControlByName("toggleMenuButton");
        let playButton = advancedTexture.getControlByName("playButton");
        let pauseButton = advancedTexture.getControlByName("pauseButton");
        let videoButton = advancedTexture.getControlByName("videoButton");
        let streamButton = advancedTexture.getControlByName("streamButton");
        let broadcastButton = advancedTexture.getControlByName("broadcastButton");
        let muteButton = advancedTexture.getControlByName("muteButton");


        // Toggle viibility on the menu and buttons
        menu.isVisible = !menu.isVisible

        toggleMenuButton.onPointerUpObservable.add(function () {
            menu.isVisible = !menu.isVisible;
            debugButton.isVisible = !debugButton.isVisible
        });


        playButton.onPointerUpObservable.add(function () {
            videoTexture.video.play();
        });
        pauseButton.onPointerUpObservable.add(function () {
            videoTexture.video.pause();
        });

        muteButton.onPointerUpObservable.add(function () {
            // toggle mute color
            if (videoTexture.video.muted) {
                muteButton.background = "#333333";
            } else {
                muteButton.background = "#ff0000";
            }
            // toggle muted
            videoTexture.video.muted = !videoTexture.video.muted

        });


        videoButton.onPointerUpObservable.add(function () {
            videoTexture.video.srcObject = arthur.srcObject
            videoTexture.video.play();
        });

        streamButton.onPointerUpObservable.add(function () {
            // Begin streaming 
            if (!streaming.stream) {
                streaming.beginReceiving(videoTexture).then(() => {
                    streaming.video.srcObject = streaming.stream;
                    videoTexture.video.play();
                    // optional add to videoDome
                    // videoDome.material.diffuseTexture.video.srcObject = streaming.stream
                }).catch(e => console.log(e));
            } else {
                // streaming exists
                streaming.video.srcObject = streaming.stream;
                videoTexture.video.play();
                // optional add to videoDome
                // videoDome.material.diffuseTexture.video.srcObject = streaming.stream
            }
        });

        broadcastButton.onPointerUpObservable.add(function () {
            // open broadcaster app
            let url = `https://streaming.dolby.io/#/broadcast-new?id=${streaming.tokenID}&s=${streaming.streamName}&token=${streaming.subscribeToken}`;
            console.log(url)
            let demo = window.open(url, "_blank");

            demo.focus();

        });

    }).catch(e => console.log(e));



    scene.onPointerObservable.add(function (evt) {
        // on plane pick
        if (evt.pickInfo.pickedMesh === videoPlaneMesh) {
            //console.log("picked");
            if (videoTexture.video.paused) {
                videoTexture.video.play();
            }
            else {
                videoTexture.video.pause();
                console.log(videoTexture.video.paused ? "paused" : "playing");
            }

        }
        // on box.pick
        if (evt.pickInfo.pickedMesh === scene.getMeshByName('videoBox')) {
            //console.log("picked");
            if (videoTexture.video.paused) {
                videoTexture.video.play();
            }
            else {
                videoTexture.video.pause();
                console.log(videoTexture.video.paused ? "paused" : "playing");
            }

        }
    }, BABYLON.PointerEventTypes.POINTERPICK);



    /*
    // Video Dome example
     videoDome = new BABYLON.VideoDome("skybox", videos, { size: 40, loop: true, resolution: 32 }, scene) 
 
     if(videoMaterial) {
         videoDome.material.diffuseTexture.video.srcObject = videoMaterial.diffuseTexture.video.srcObject;
     }
    
     */




    return scene;

};

window.initFunction = async function () {


    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
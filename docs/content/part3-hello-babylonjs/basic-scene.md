var createScene = function () {
// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);
// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);


    return scene;

};

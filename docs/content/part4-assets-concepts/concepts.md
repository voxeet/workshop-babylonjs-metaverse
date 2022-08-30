# 3D Assets and Interactivity Concepts

Some code examples for a variety of concepts.

## Create a colored box

[Basic Box Scene](https://playground.babylonjs.com/#5HQLFG ':include :type=iframe width=100% height=800px')
 
 Create an array of faceColors, set the uv color for each face.

```js
	/*********************Create Box***************/
	var faceColors = [];
	faceColors[0] = BABYLON.Color3.Blue();
	faceColors[1] = BABYLON.Color3.White()
	faceColors[2] = BABYLON.Color3.Red();
	faceColors[3] = BABYLON.Color3.Black();
	faceColors[4] = BABYLON.Color3.Green();
	faceColors[5] = BABYLON.Color3.Yellow();
 
	var box = BABYLON.MeshBuilder.CreateBox("Box", {faceColors:faceColors, size:2}, scene, true);
    box.material = new BABYLON.StandardMaterial("", scene);
```

## Load a Babylon File

[loading Scene](https://playground.babylonjs.com/#JUKXQD#4451 ':include :type=iframe width=100% height=800px')

Load a mesh into the scene with ``BABYLON.SceneLoader.ImportMesh`` method. 
View the [demo](http://localhost:9000/demos/mesh-loading/).


```js
// The first parameter can be used to specify which mesh to import. Here we import all meshes
BABYLON.SceneLoader.ImportMesh("", "https://playground.babylonjs.com/scenes/", "skull.babylon", scene, function (newMeshes) {
    // Set the target of the camera to the first imported mesh
    camera.target = newMeshes[0];
});

```



## Drag interactions

[Drag Scene](http://localhost:9000/demos/drag-drop/drag-index.html ':include :type=iframe width=100% height=800px')

We use  ``scene.onPointerObservable.add((pointerInfo)``  to determine the pointer event and info.
So on a ``POINTERDOWN`` event we check to see if there is a hit with this code:
```js
if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != ground) { 
    pointerDown(pointerpickInfo.pickedMesh)
}
```

If there's hit to a mesh and not the ground, we then capture the current mesh and it's position. 
When the move begins ``POINTERMOVE`` we update the current position and finally stop when ``POINTERUP``.


```js
//Interactions

var startingPoint;
var currentMesh;

var getGroundPosition = function () {
  var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
    return mesh == ground;
  });
  if (pickinfo.hit) {
    return pickinfo.pickedPoint;
  }

  return null;
};

var pointerDown = function (mesh) {
  currentMesh = mesh;
  startingPoint = getGroundPosition();
  if (startingPoint) {
    // we need to disconnect camera from canvas
    setTimeout(function () {
      camera.detachControl(canvas);
    }, 0);
  }
};

var pointerUp = function () {
  if (startingPoint) {
    camera.attachControl(canvas, true);
    startingPoint = null;
    return;
  }
};

var pointerMove = function () {
  if (!startingPoint) {
    return;
  }
  var current = getGroundPosition();
  if (!current) {
    return;
  }

  var diff = current.subtract(startingPoint);
  currentMesh.position.addInPlace(diff);

  startingPoint = current;
};

scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case BABYLON.PointerEventTypes.POINTERDOWN:
      if (
        pointerInfo.pickInfo.hit &&
        pointerInfo.pickInfo.pickedMesh != ground
      ) {
        pointerDown(pointerInfo.pickInfo.pickedMesh);
      }
      break;
    case BABYLON.PointerEventTypes.POINTERUP:
      pointerUp();
      break;
    case BABYLON.PointerEventTypes.POINTERMOVE:
      pointerMove();
      break;
  }
});
```

View the [Demo](http://localhost:9000/demos/mesh-loading/)

## Switching between scenes

Use asset containers to switch between scenes. Use the Z key to change to the next scene.

[Scene-switch](https://playground.babylonjs.com/#JA1ND3#48 ':include :type=iframe width=100% height=800px')


View the [Playground](https://playground.babylonjs.com/#JA1ND3#48)

## XR Experiences

BabylonJS is an excelent platform for XR experiences.  Try this example with a mobile phone in a cardboard headset.
The screen will use the device orientation to control the pointer.  


[XR Exp](https://playground.babylonjs.com/#SRV2A0 ':include :type=iframe width=100% height=800px')

View the [Playground](https://playground.babylonjs.com/#SRV2A0)

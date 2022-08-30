# Dolby.io Live Streaming

Dolby.io provides APIs to enable real-time communications with Spatial Audio and Live Streaming.
In this module we'll explore how to bring low latency Streaming into your metaverse experience.
We'll accomplish this by using video textures and modify little bit of [example code](https://dolby.io/blog/building-a-low-latency-livestream-viewer-with-webrtc-millicast/) to consume a live stream.


## Video as a texture

In the 3D scene we apply video as a texture to a material, and then assign the material to a mesh. You can think of the video texture to be very similar to a `<Video/>` element.  Behind the scenes the texture is backed with a video element and the same API applies.  In this example, we'll create a plane mesh with size options, position the plane mesh, then create a material and assign the video texture to the material's diffuseTexture. 


[video texture](https://playground.babylonjs.com/#ZMCFYA#343 ':include :type=iframe width=100% height=800px')

To create the texture use the ``BABYLON.VideoTexture("vidtex","textures/babylonjs.mp4", scene);`` method. 
The method takes a name, URL to the video, and the scene as it's params.

You can play or pause the video with ``videodTex.video.play();`` and ``videodTex.video.pause();`` 
Likewise you can also update the texture's ``src`` and ``srcObject`` which will come in handy when we want to begin streaming to the texture.


Here's a simple example that show the creation of the texture, and using a pointer for play and pause.  

!> **Note** Remember to set the **``emmissiveColor``** to white to ensure the video will be displayed, as the scene lighting will not directly effect the texture.

```
// Set the size options.
	var planeOpts = {
			height: 5.4762, 
			width: 7.3967, 
			sideOrientation: BABYLON.Mesh.DOUBLESIDE
	};
	var videoMesh = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);

	var vidPos = (new BABYLON.Vector3(0,0,0.1))
    videoMesh.position = vidPos;
	var videoMat = new BABYLON.StandardMaterial("m", scene);
	var videodTex = new BABYLON.VideoTexture("vidtex","textures/babylonjs.mp4", scene);
	videoMat.diffuseTexture = videodTex;
	videoMat.roughness = 1;
	videoMat.emissiveColor = new BABYLON.Color3.White();
	videoMesh.material = videoMat;

    // play or pause when clicked.
	scene.onPointerObservable.add(function(evt){
			if(evt.pickInfo.pickedMesh === videoMesh){
                //console.log("picked");
					if(videodTex.video.paused)
						videodTex.video.play();
					else
						videodTex.video.pause();
                    console.log(videodTex.video.paused?"paused":"playing");
			}
	}, BABYLON.PointerEventTypes.POINTERPICK);
```

## Configure Streaming with Dolby.io
Now that we know how to create video textures, let's create a more complex example and add Dolby.io's Low Latency Streaming into the experience.

!> **Try It Out**  Before continuing you'll need to fill the configuration details in the `Streaming.js` file

Open the `Streaming.js` file located in the `www/common` folder.



Go to the [Dolby.io Dashboard](http://dashboard.dolby.io) and then select the ``Streaming`` tab.

On the left menu you'll note that you are on the ``Live Broadcast - Stream Tokens`` section. This section is used to manage your broadcasting tokens.

Think of a token and the associated settings as a way to uniquely identify a broadcast stream.  You'll want to create a unique token for each project or stream.

Click the + icon to create a ``live Broadcast Stream Token``, select the token details, then tap on the ``API`` tab to find the other values for `streamName`, `streamAccountId`, `tokenID`, copy them into the ``Streaming.js`` class as noted below.

Next. navigate the left menu to the ``Subscribe tokens`` section.  A subscribe token is used to limit the broadcast to only viewer clients that have the subscribe token.
This feature allows you to limit just who can view the stream.

Click the + icon to create a ``Subscribe Token`` by navigating to that section and hitting the + icon. Select the token and copy the token value from the ``Subscribe Token Settings`` tab into the subscribeToken portion of the ``Streaming.js`` class as noted below. 

Since this project is running on localhost, we're directly setting these tokens in the code. In a production experience you'll want to setup a secure server and create the tokens via the API.  Learn more about creating [secure tokens](https://dolby.io/blog/secure-token-authentication-with-dolby-io-millicast-streaming-webrtc/) for live streaming with Dolby.io

```
class Streaming {

    streamName = '< Your stream name>';
    streamAccountId = '<Your account id>';
    tokenID = '<Stream Toke ID>';
    publishingToken = '<Publishing Token>';
    subscribeToken = 'Subscribe Token';

 // Additional code continues
 }

```
Now, stop and restart the developer server, and reload this page to make sure the demo is running.  You should be able to run the demo.

Hit the menu and video button to start. Next try the play, pause and mute buttons. Pretty cool, now let's tap the broadcast button, this will open a new browser window, and immediately fire up the broadcasting web application.  Hit start streaming and return to this demo. The video stream should appear, if not click on the Stream button to switch the video textures sources. You can toggle between the pre-recorded video and the live stream. 

[video texture](http://localhost:9000/demos/video-texture/video-index.html ':include :type=iframe width=100% height=800px')



View the [Demo](http://localhost:9000/demos/video-texture/video-index.html)

## Deeper dive into the Streaming Class.

The Streaming class is essentially a convenient class to create a Stream Viewer and set the `videoTexture.srcObject` to the stream.

We begin with calling the`` Director.getSubscriber(streamName, streamAccountId, subscribeToken)`` method.  That method returns a ``tokenGenerator``
token param to then create the ``View(this.streamName, tokenGenerator, this.video, this.autoReconnect)``

this then authenticates with the API by taking the stream information to generate a session token. That token then is used to create a Millicast Viewer. 

```
const newViewer = async (streamName, streamAccountId, subscribeToken) => {

    const tokenGenerator = () => window.millicast.Director.getSubscriber(streamName, streamAccountId, subscribeToken);

    const millicastView = new window.millicast.View(this.streamName, tokenGenerator, this.video, this.autoReconnect)


    millicastView.on("broadcastEvent", (event) => {
        if (!this.autoReconnect) return;

        let layers = event.data["layers"] !== null ? event.data["layers"] : {};
        if (event.name === "layers" && Object.keys(layers).length <= 0) {
        }
    });
    millicastView.on("track", (event) => {
        addStream(event.streams[0]);
    });
    return millicastView
}

millicastView = await newViewer(this.streamName, this.streamAccountId, this.subscribeToken)

```

The View's ``millicastView.on("broadcastEvent", (event) => { ...})`` and ``millicastView.on("track", (event) => {...})`` handle reconnecting and call the addStream method when a stream is connected.

```
this.video = videoTexture.video  // For testing add video element and use document.querySelector("video");

const addStream = (stream) => {
    if (this.video.srcObject) {
        console.log("srcObject exists")
        this.video.srcObject = stream;
        this.stream = stream;
        // already connected but we'll replace it anyway
    } else {
        console.log("new stream")
        this.video.srcObject = stream;
        this.stream = stream;
    }
}
```

The ``AddStream`` method simply assigns the stream to ``videoTexture.video.srcObject``  if it did not already exist.  We do this check since the Stream Viewer can receive multiple streams or may drop.

## Using the Streaming Class in your own code. 

We developed the Streaming wrapper class to make it simple to add Dolby.io Streaming to your own experiences. 
The full source code for the is located at `www/common/Streaming.js`.

Add the script tags for the Millicast Streaming SDK and our Streaming class inside the `<head/>` tag of your main application. 
Adjust your script path according to the location of the `Streaming.js` file.
```
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>Video Textures - Babylon.js X Dolby.io</title>
    
    <!-- Various scripts and tags here -->

    <!-- Dolby.io Streaming (formerly Millicast)  Library -->
    <script src="https://cdn.jsdelivr.net/npm/@millicast/sdk@latest/dist/millicast.umd.js"></script>
    <!-- Streaming Script -->
    <script src="Streaming.js"></script>
</head>
```
Next, inside your ``createScene()`` method, create an instance of the Streaming class.

 ```
 var streaming = new Streaming()

 ```

Create the videoTexture in your code and then call the ``beginReceiving(videoTexture)`` method.
This will create a Stream Viewer and start receiving streams. 

```
// beginReceiving
if (videoTexture) { streaming.beginReceiving(videoTexture) }
```

Elsewhere in your application you can also manage the video playback by referencing the streaming instance's video property. 
Here is an example using the GUI's play, pause and mute buttons. 

```
        playButton.onPointerUpObservable.add(function () {
            streaming.video.play()
        });
        pauseButton.onPointerUpObservable.add(function () {
            streaming.video.pause()
        });

        muteButton.onPointerUpObservable.add(function () {

            if (streaming.video.muted) {
                muteButton.background = "#333333";
            } else {
                muteButton.background = "#ff0000";
            }
            // toggle muted
            streaming.video.muted = !streaming.video.muted
        });

```

We can also switch back and forth between video and live streams. 

!> **Note** After the initial creation of the video texture, we can set it again by changing the ``srcObject``.

```
        videoButton.onPointerUpObservable.add(function () {
            streaming.video.srcObject = arthur.srcObject
            streaming.video.play()
        });

        streamButton.onPointerUpObservable.add(function () {
            streaming.video.srcObject = streaming.stream;
            streaming.video.play()
        });
```


## Mapping Video to a Cube 
 
In our [Create a colored box](http://localhost:3000/#/content/part4-assets-concepts/concepts?id=create-a-colored-box) example we touched on UV mapping the sides of a cube. 
The same technique can be applied to video textures as well.  

To make it easier to create video textured cube we created a helper class called `CommonMaterials`, located in the `www/common/CommonMaterials.js` folder.

Just create an instance of commonMaterials and then create a texture, this could be a video or a image, then call ``makeCube(name = "box", videoMaterial, videoTexture, size, showMap = false)`` with a name, material, texture, size, and showMap. Then set `showMap` to false for video textures; and true for sprite images aligned in rows and columns. `size` is a simple object, ie: `{width: 2, height: 2, depth: 2}`


```
// create an instance of the CommonMaterials class

    var commonMaterials = new CommonMaterials(BABYLON, scene)

    // create a video texture, omitted for brevity.

if (videoTexture) {
            videoBox = commonMaterials.makeCube("videoBox", videoMaterial, videoTexture, size, false)
            videoBox.position = new BABYLON.Vector3(0, height / 2, -2);
}


// using an sprite image texture and a  1 row / 6 cols

    // Numbered Box
    var mat = new BABYLON.StandardMaterial("mat", scene);
    var texture = new BABYLON.Texture("../../assets/textures/numbers.jpg", scene);

    let box2 = commonMaterials.makeCube("box", mat, texture, {
        width: 2,
        height: 2,
        depth: 2
    }, true)


```

The bulk of the method organizes the FaceUV then creates a box with the texture properly mapped.  For more information on UVs check out the BabylonJS documentation on [UV Face Mapping](https://doc.babylonjs.com/divingDeeper/materials/using/texturePerBoxFace)

```
 
    // Cube source https://playground.babylonjs.com/#ICZEXW#2

    makeCube(name = "box", videoMaterial, videoTexture, size, showMap = false) {

        var mat = videoMaterial
        var texture = videoTexture
        mat.diffuseTexture = texture;

        // Setup the FaceUV
        var faceUV = new Array(6);
        if (showMap) {
            var columns = 6;  // 6 columns
            var rows = 1;  // 1 row
            // //set all faces to same
            for (var i = 0; i < 6; i++) {
                faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
            }
        } else {
            //set all values to zero
            for (var i = 0; i < 6; i++) {
                faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
            }

            faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1) // front face 
            faceUV[0] = new BABYLON.Vector4(0, 0, 1, 1) // back face
        }

        //wrap set
        var options = {
            width: size.width,
            height: size.height,
            depth: size.depth,
            faceUV: faceUV,
            wrap: true
        };


        var box = BABYLON.MeshBuilder.CreateBox(name, options, scene);
        box.material = mat;
        box.position.y = 5;

        return box
    }
```
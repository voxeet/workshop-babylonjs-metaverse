/**
 * 
 * Usage
 * 
          // create instance of Common Materials
          var commonMaterials = new CommonMaterials(BABYLON, scene) 

          // Create a mesh 
            var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 4, scene);
            // Add asign Material to Mesh 
              sphere.material = commonMaterials.redMaterial();
      
 */



class CommonMaterials {

    /// <reference path="https://preview.babylonjs.com/babylon.d.ts"/>

    constructor(babylon, scene) {
        this.BABYLON = babylon
        this.scene = scene;
        
    }



    /***
     *   Create Full Streen Texture with message and save
     * 
     *    https://doc.babylonjs.com/divingDeeper/gui/gui#position-and-size
     */

    controlAlignment(horizontalAlignment, verticalAlignment) {
        var horizontal, vertical
        switch (horizontalAlignment) {
            case "right":
                horizontal = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                break;
            case "left":
                horizontal = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                break;
            default:
                horizontal = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                break;
        }

        switch (verticalAlignment) {
            case "top":
                vertical = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
                break;
            case "bottom":
                vertical = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
                break;

            default:
                vertical = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM

                break;
        }
        return { horizontal, vertical }
    }

    async createLabel(message, horizontalAlignment = "left", verticalAlignment = "top") {

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("FullscreenUI")

        var align = this.controlAlignment(horizontalAlignment, verticalAlignment);

        var label = new BABYLON.GUI.TextBlock();
        label.text = message
        label.color = "white";
        label.fontSize = 16;
        label.textHorizontalAlignment = align.horizontal;
        label.textVerticalAlignment = align.vertical;

        label.paddingBottom = "20px";
        label.paddingRight = "20px"
        advancedTexture.addControl(label);
        return { advancedTexture, label }
    }

    async createGUIButton(buttonLabel, horizontalAlignment, verticalAlignment) {

        var align = this.controlAlignment(horizontalAlignment, verticalAlignment);
        // GUI   
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        //  Button
        var button = BABYLON.GUI.Button.CreateSimpleButton("but1", buttonLabel);
        button.width = "150px"
        button.height = "50px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";
        button.horizontalAlignment = align.horizontal;
        button.verticalAlignment = align.vertical;

        advancedTexture.addControl(button)

        return { advancedTexture, button }

    }


    
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

            // assign the individual faces
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

    async createVideoMaterialAndTexture(videos, createAlpha = false, disableLighting = true, mute = false) {

        var videoMaterial = await new BABYLON.StandardMaterial("video-material", scene);
        var videoTexture = await new BABYLON.VideoTexture("videoTexture", videos, scene);
        var videoElement = videoTexture.video

        videoTexture.getAlphaFromRGB = createAlpha;  // make black areas transparent
        videoMaterial.disableLighting = disableLighting; // turn off lighting for object -- improves rendering speed
        videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        videoMaterial.emissiveTexture = videoTexture; // eminates lighting from video texture
        videoMaterial.opacityTexture = videoTexture; // sets opacity -- you could use a video matte for example

        videoMaterial.diffuseTexture = videoTexture;
        videoMaterial.roughness = 1;

        videoMaterial.emissiveTexture = videoTexture;
        videoTexture.video.mute = true; // video can't autoplay if unmuted

        return { videoMaterial, videoTexture, videoElement }
    }


    groundMaterial(color = BABYLON.Color3.Black()) {
        let groundMat = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMat.diffuseColor = color
        groundMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        groundMat.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        return groundMat
    }


    redMaterial() {
        var redMat = new BABYLON.StandardMaterial("redMaterial", scene);
        redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        redMat.emissiveColor = new BABYLON.Color3.Red();
        return redMat
    }

    greenMaterial() {
        var greenMat = new BABYLON.StandardMaterial("greenMaterial", scene);
        greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        greenMat.emissiveColor = new BABYLON.Color3.Green();
        return greenMat
    }

    blueMaterial() {
        var blueMat = new BABYLON.StandardMaterial("blueMaterial", scene);
        blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        blueMat.emissiveColor = new BABYLON.Color3.Blue();
        return blueMat
    }

    purpleMaterial() {
        purpleMat = new BABYLON.StandardMaterial("purpleMaterial", scene);
        purpleMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        purpleMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        purpleMat.emissiveColor = BABYLON.Color3.Purple();
        return purpleMat
    }

    woodMaterial() {
        var woodMaterial = new BABYLON.StandardMaterial("woodMaterial", scene);
        woodMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/wood.jpg", scene);
        woodMaterial.diffuseTexture.uScale = 30;
        woodMaterial.diffuseTexture.vScale = 30;
        woodMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
        return woodMaterial
    }

}



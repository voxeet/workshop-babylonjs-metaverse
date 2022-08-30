# About the Demos

This workshop contains a series of demos, each designed to teach you about a particular topic for creating 3D experiences in BabylonJS.

Let's begin by starting our development server.

Open a terminal to the root of this project and run:
**```npm run dev```**

  
This will launch a simple node server on [localhost](http://localhost:9000) which will host the various demos for each module. 

The source code for each demos are located in the **www/demos/\<name-of-demo>** directory.

    -- www/
            assets/
                    meshes
                    textures
            common/
                    CommonMaterials.js
                    Streaming.js
                    UXhelpers.js
              css/
                    main.css
		    demos/
			   drag-drop/
			   video-texture/
			   firstperson/
			   animation-control/
			   ... more ...
            
  


Each module is designed to explore a topic, feel free to  [explore](http://localhost:9000) the demos. 

If you are attending this workshop in person, we'll be working within the demo folder and it's child folders. It will be here where we edit and modify each sub projects source code.

The **common** folder contains additional shared scripts for common materials, streaming and real-time communications. Likewise, the **assets** folder will contain shared assets such as meshes and textures. Some demo folders may contain addition assets. 



var UXHelpers = (function() {
    'use strict'; 
 
    function saveScene(scene, filename =  "scene.babylon"){
        console.log('Saving Scene')
        BABYLON.SceneSerializer.SerializeAsync(scene).then((serialized) => {
            const blob = new Blob([JSON.stringify(serialized)]);
            BABYLON.Tools.Download(blob,filename);
        });
    }

      
    return {
        saveScene,
    };
})();
  
interface TextureDefinition {
    refName:string,
    path:string,
    wrapU:string,
    wrapV:string
}
interface Vector3LinkDefinition {
    refName:string,
    nodeName:string,
    nodeProperty:string,
}

interface ShaderDefiniton {
    refName:string,
    path:string,
    attributes:string[],
    uniforms:string[],
    textures?: TextureDefinition[],
    nodeLinks?: Vector3LinkDefinition[]
}

// FIXME: Ideally we would like to use this interface, to account for all shader options:
// interface ShaderDefiniton {
//     refName:string,
//     path:string,
//     options:BABYLON.IShaderMaterialOptions,
//     textures: TextureDefinition[]
// }

export class ShaderHelper {

    static applyShaderMaterial(jsonPath:string, mesh:BABYLON.Mesh){
        let shaderMaterial:BABYLON.ShaderMaterial;
        let shaderDef:ShaderDefiniton;
        
        BABYLON.Tools.LoadFile(jsonPath, (json, url) => {
            if(typeof(json) == 'string')
                shaderDef = JSON.parse(json);
            else
                shaderDef = JSON.parse("{}");
            
            // FIXME: if we could use the new interface (commented above), we would use:
            // shaderMaterial = new BABYLON.ShaderMaterial(shaderDef.refName, 
            // this._scene, shaderDef.path, shaderDef.options);
            
            shaderMaterial = new BABYLON.ShaderMaterial(
                shaderDef.refName, 
                mesh.getScene(), shaderDef.path, 
                {
                    uniforms : shaderDef.uniforms,
                    attributes : shaderDef.attributes
                }
            );
                    
            if(shaderDef.textures !== undefined){
                let refTexture:BABYLON.Texture;
                shaderDef.textures.forEach((textDef:TextureDefinition) => {
                    refTexture = new BABYLON.Texture(textDef.path, mesh.getScene());
                    refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                    refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                    shaderMaterial.setTexture(textDef.refName, refTexture);                                      
                });
            } 

            if(shaderDef.nodeLinks !== undefined){
                // Nodes are Camera, Mesh, Light, TransformNode
                let nodeProperty:BABYLON.Vector3;
                shaderDef.nodeLinks.forEach((nodeLink:Vector3LinkDefinition) => {
                    let node = mesh.getScene().getNodeByName(nodeLink.nodeName);
                    if(node){
                        if(nodeLink.nodeProperty == 'rotation')
                            nodeProperty = node.rotation
                        if (nodeLink.nodeProperty == 'position')
                            nodeProperty = node.position;
                    }
                    // NOTE: I checked, the node property is automatically updated before render!
                    // Hence no need to use registerBeforeRender() as in demo;
                    shaderMaterial.setVector3(nodeLink.refName, nodeProperty);                                      
                });
            } 
                      
            mesh.material = shaderMaterial;
            //NOTE: can't use return(shaderMaterial) because async        
        });
        
    }
}

// In case we need to register Before Render:
// if(nodeLink.update){
//     mesh.getScene().registerBeforeRender(()=>{
//         shaderMaterial.setVector3(nodeLink.refName, nodeProperty);
//     });
// }
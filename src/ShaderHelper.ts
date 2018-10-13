interface TextureDefinition {
    refName:string,
    path:string,
    wrapU:string,
    wrapV:string
}
interface ShaderDefiniton {
    refName:string,
    path:string,
    attributes:string[],
    uniforms:string[],
    textures: TextureDefinition[]
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
            mesh.material = shaderMaterial;
            //NOTE: can't use return(shaderMaterial) because async
            
        });
        
    }
}
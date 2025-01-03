
import {Vector4} from "@math.gl/core";
import Material from "./lib/material/Material.ts";
import {ShaderType} from "./lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "./lib/material/DefaultUniformGroups.ts";
import UniformGroup from "./lib/material/UniformGroup.ts";
import DefaultTextures from "./lib/textures/DefaultTextures.ts";
import {CullMode, TextureViewDimension} from "./lib/WebGPUConstants.ts";

export default class CubeMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);

        this.addVertexOutput("normal", ShaderType.vec3 );


        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer), true);
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer), true);


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
        uniforms.addTexture("myTexture",DefaultTextures.getCube(this.renderer),{dimension:TextureViewDimension.Cube})
        uniforms.addSampler("mySampler")
        this.cullMode =CullMode.Front;
       this.logShader =true;
    }
    getShader(): string {
        return /* wgsl */ `
///////////////////////////////////////////////////////////   

${this.getVertexOutputStruct()}   


${this.getShaderUniforms()}
@vertex
fn mainVertex( ${this.getShaderAttributes()} ) -> VertexOutput
{
    var output : VertexOutput;
    output.position =camera.viewProjectionMatrix*model.modelMatrix* vec4( aPos,1.0);
    output.normal =aPos;

    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{


     var cubeMapVec = normalize(normal);
     cubeMapVec.z *= -1;
    return   textureSample(myTexture, mySampler, cubeMapVec);
}
///////////////////////////////////////////////////////////
        `
    }


}

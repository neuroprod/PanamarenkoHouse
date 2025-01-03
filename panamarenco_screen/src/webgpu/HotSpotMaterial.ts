
import {Vector4} from "@math.gl/core";
import Material from "./lib/material/Material.ts";
import {ShaderType} from "./lib/material/ShaderTypes.ts";
import DefaultUniformGroups from "./lib/material/DefaultUniformGroups.ts";
import UniformGroup from "./lib/material/UniformGroup.ts";
import DefaultTextures from "./lib/textures/DefaultTextures.ts";
import {CullMode, TextureViewDimension} from "./lib/WebGPUConstants.ts";
import Blend from "./lib/material/Blend.ts";

export default class HotSpotMaterial extends Material{

    setup(){
        this.addAttribute("aPos", ShaderType.vec3);
        this.addAttribute("aUV0", ShaderType.vec2);
        this.addVertexOutput("uv", ShaderType.vec2 );


        this.addUniformGroup(DefaultUniformGroups.getCamera(this.renderer), true);
        this.addUniformGroup(DefaultUniformGroups.getModelTransform(this.renderer), true);


        let uniforms =new UniformGroup(this.renderer,"uniforms");
        this.addUniformGroup(uniforms,true);
        uniforms.addUniform("position",new Vector4(1,0,0,1))
        uniforms.addUniform("ratio",1)
        uniforms.addUniform("time",0)
        uniforms.addTexture("myTexture",DefaultTextures.getGrid(this.renderer))
        uniforms.addSampler("mySampler")
        this.blendModes =[Blend.preMultAlpha()]
        this.cullMode =CullMode.None;
        this.depthWrite =false;
        this.depthCompare ="always"
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
    
    let pos = camera.viewProjectionMatrix*model.modelMatrix*  uniforms.position;
 
    output.position =pos+vec4(aPos.xy*vec2(uniforms.ratio,1.0)*0.08,0.0,0.0);
    output.uv =aUV0;

    return output;
}


@fragment
fn mainFragment(${this.getFragmentInput()}) ->  @location(0) vec4f
{
let tp = 1.0-pow(1.0-uniforms.time*0.7,3.0);
    let circle = (1.0-smoothstep(tp-0.01,tp,length(uv.xy-vec2(0.5)) * 2.0));    
    let circleAlpha = (1.0-pow(uniforms.time,1.5))*0.5;
    
   var circleColor  = vec4(1,1,0.9,1.0) *circle*circleAlpha;
    var textColor =  textureSample(myTexture, mySampler, uv);
    textColor = vec4(textColor.xyz*textColor.w,textColor.w); 
    circleColor = circleColor *(1- textColor.w)+ textColor; 
    
    
    return   circleColor;
}
///////////////////////////////////////////////////////////
        `
    }


}

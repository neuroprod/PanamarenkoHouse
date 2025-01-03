import Renderer from "./lib/Renderer.ts";
import Model from "./lib/model/Model.ts";

import HotSpotMaterial from "./HotSpotMaterial.ts";
import Quad from "./lib/mesh/geometry/Quad.ts";
import {Vector3, Vector4} from "@math.gl/core";
import Timer from "./lib/Timer.ts";

export default class HotSpot {
    private renderer: Renderer;
    model: Model;
    position = new Vector4(-0.5726927616722736, -0.2715374778752252, 0.7734923392234379,1)
    constructor(renderer:Renderer) {

        this.renderer = renderer;

        this.model = new Model(this.renderer,"hotspot")
        this.model.material =new HotSpotMaterial(this.renderer,"hsMat")
        this.model.material.setTexture("myTexture",this.renderer.getTexture("infoIcon.png"))
        this.model.mesh = new Quad(this.renderer)

    }
    update(){
        this.model.material.setUniform("position",this.position)
        this.model.material.setUniform("ratio",1/this.renderer.ratio)
        this.model.material.setUniform("time",(Timer.time*0.7)%1)
    }



}

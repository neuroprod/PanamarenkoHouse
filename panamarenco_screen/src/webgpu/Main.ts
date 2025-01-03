import Renderer from "./lib/Renderer.ts";
import PreLoader from "./lib/PreLoader.ts";
import Camera from "./lib/Camera.ts";
import CanvasRenderPass from "./CanvasRenderPass.ts";
import UI from "./lib/UI/UI.ts";
import Model from "./lib/model/Model.ts";
import Box from "./lib/mesh/geometry/Box.ts";
import CubeTextureLoader from "./lib/textures/CubeTextureLoader.ts";
import CubeMaterial from "./CubeMaterial.ts";
import MouseListener from "./lib/MouseListener.ts";
import PanoramaViewController from "./PanoramaViewController.ts";
import Ray from "./lib/Ray.ts";
import HotSpot from "./HotSpot.ts";
import TextureLoader from "./lib/textures/TextureLoader.ts";
import Hub from "./Hub.ts";

export default class Main {
    private canvas1: HTMLCanvasElement;
    private canvas2: HTMLCanvasElement;
    private renderer: Renderer;
    private preloader!: PreLoader;


    private cubeModel!: Model;
    private cubeTexture!: CubeTextureLoader;


    private hotSpot1!: HotSpot;
    private hotSpot2!: HotSpot;
    private infoTexture!: TextureLoader;
    private hub1!: Hub;
    private content: HTMLDivElement;
    private hub2!: Hub;

    constructor() {

        this.canvas1 = document.getElementById("webGPUCanvas1") as HTMLCanvasElement;
        this.canvas2 = document.getElementById("webGPUCanvas2") as HTMLCanvasElement;
        this.content = document.getElementById("content") as HTMLDivElement;
        this.onResize()
        this.renderer = new Renderer();
        this.renderer.setup(this.canvas1,this.canvas2).then(() => {
            this.preload()
        })

        window.onresize = this.onResize.bind(this)

    }

    onResize() {
        let pixelRatio = window.devicePixelRatio
        this.canvas1.style.width = Math.floor(window.innerWidth / 3) + "px";
        this.canvas1.style.height = Math.floor(window.innerHeight) + "px";
        this.canvas1.width = Math.floor(window.innerWidth / 3 * pixelRatio);
        this.canvas1.height = Math.floor(window.innerHeight * pixelRatio);
        this.canvas1.style.left = Math.floor(window.innerWidth / 3) + "px"

        this.canvas2.style.width = Math.floor(window.innerWidth / 3) + "px";
        this.canvas2.style.height = Math.floor(window.innerHeight) + "px";
        this.canvas2.width = Math.floor(window.innerWidth / 3 * pixelRatio);
        this.canvas2.height = Math.floor(window.innerHeight * pixelRatio);
       this.canvas2.style.left = Math.floor((window.innerWidth / 3 * 2)) + "px"

    }

    preload() {


        this.preloader = new PreLoader((n) => {
                //onPreload
            }, this.init.bind(this)
        );

        this.preloader.startLoad()
        this.infoTexture = new TextureLoader(this.renderer, "infoIcon.png")
        this.infoTexture.onComplete = () => {
            this.preloader.stopLoad()
        }


        this.preloader.startLoad()
        let textures: Array<string> = []
        // [+X, -X, +Y, -Y, +Z, -Z]
        let posArr = [2, 4, 0, 5, 1, 3]

        for (let i = 0; i < 6; i++) {

            let s = "view1/512_face" + posArr[i] + "_0_0.jpg"
            textures.push(s);
        }
        this.cubeTexture = new CubeTextureLoader(this.renderer, "test", textures)
        this.cubeTexture.onComplete = () => {
            this.preloader.stopLoad()
        }

    }

    init() {

       this.hub1 = new Hub(this.renderer,this.canvas1)
        this.hub2 = new Hub(this.renderer,this.canvas2)
        this.renderer.setCanvasColorAttachment1(this.hub1.canvasRenderPass.canvasColorAttachment);
        this.renderer.setCanvasColorAttachment2(this.hub2.canvasRenderPass.canvasColorAttachment);


        this.cubeModel = new Model(this.renderer, "cubeModel")
        this.cubeModel.mesh = new Box(this.renderer)
        this.cubeModel.material = new CubeMaterial(this.renderer, "testMat")
        this.cubeModel.material.setTexture("myTexture", this.cubeTexture)
        this.hub1.canvasRenderPass.modelRenderer.addModel(this.cubeModel)
        this.hub2.canvasRenderPass.modelRenderer.addModel(this.cubeModel)
        this.hotSpot1 = new HotSpot(this.renderer)
        this.hub1.canvasRenderPass.modelRenderer.addModel(this.hotSpot1.model)
        this.hub2.canvasRenderPass.modelRenderer.addModel(this.hotSpot1.model)

        this.hotSpot2 = new HotSpot(this.renderer)
        this.hotSpot2.position.set(-0.9757119771757714, 0.13768675001373945, 0.17037751162169576, 1)
        this.hub1.canvasRenderPass.modelRenderer.addModel(this.hotSpot2.model)
        this.hub2.canvasRenderPass.modelRenderer.addModel(this.hotSpot2.model)

        this.tick();
    }

    private tick() {

        this.update();


        this.renderer.update(this.draw.bind(this));
        window.requestAnimationFrame(() => this.tick());

    }

    private update() {
        this.hub1.update()
        this.hub2.update()
        this.hotSpot1.update()
        this.hotSpot2.update()




    }

    private draw() {


        this.hub1.canvasRenderPass.add();
        this.hub2.canvasRenderPass.add();
    }


}

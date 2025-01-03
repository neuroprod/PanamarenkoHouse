import CanvasManager from "./lib/CanvasManager.ts";
import Renderer from "./lib/Renderer.ts";
import PreLoader from "./lib/PreLoader.ts";
import Camera from "./lib/Camera.ts";
import CanvasRenderPass from "./CanvasRenderPass.ts";
import UI from "./lib/UI/UI.ts";
import Model from "./lib/model/Model.ts";
import Box from "./lib/mesh/geometry/Box.ts";
import CubeTextureLoader from "./lib/textures/CubeTextureLoader.ts";
import CubeMaterial from "./CubeMaterial.ts";
import Timer from "./lib/Timer.ts";

export default class Main {
    private canvas: HTMLCanvasElement;
    private canvasManager: CanvasManager;
    private renderer: Renderer;
    private preloader!: PreLoader;
    private camera!: Camera;
    private canvasRenderPass!: CanvasRenderPass;
    private cubeModel!: Model;
    private cubeTexture!: CubeTextureLoader;


    constructor() {

        this.canvas = document.getElementById("webGPUCanvas") as HTMLCanvasElement;
        this.canvasManager = new CanvasManager(this.canvas);
        this.renderer = new Renderer();
        this.renderer.setup(this.canvas).then(() => {
            this.preload()
        })


    }

    preload() {

        UI.setWebGPU(this.renderer)
        UI.setSize(this.canvas.width, this.canvas.height)

        this.preloader = new PreLoader((n) => {
                //onPreload
            }, this.init.bind(this)
        );
        this.preloader.startLoad()

        let textures: Array<string> = []
           // [+X, -X, +Y, -Y, +Z, -Z]
        let posArr =[2,4,0,5,1,3]


        for (let i = 0; i < 6; i++) {

            let s = "view1/512_face" +  posArr[i] + "_0_0.jpg"
            textures.push(s);
        }
        this.cubeTexture = new CubeTextureLoader(this.renderer, "test", textures)
        this.cubeTexture.onComplete = () => {
            this.preloader.stopLoad()
        }

    }

    init() {

        this.camera = new Camera(this.renderer)
        this.camera.near = 0.1
        this.camera.far = 10
        this.camera.fovy =1.5
        this.camera.cameraWorld.set(0, 0, 0)
        this.camera.cameraLookAt.set(1, 0, 0)

        this.canvasRenderPass = new CanvasRenderPass(this.renderer, this.camera)
        this.renderer.setCanvasColorAttachment(this.canvasRenderPass.canvasColorAttachment);


        this.cubeModel = new Model(this.renderer, "cubeModel")
        this.cubeModel.mesh = new Box(this.renderer)
        this.cubeModel.material = new CubeMaterial(this.renderer, "testMat")
        this.cubeModel.material.setTexture("myTexture", this.cubeTexture)
        this.canvasRenderPass.modelRenderer.addModel(this.cubeModel)

        this.tick();
    }

    private tick() {
        this.update();

        UI.updateGPU();
        this.renderer.update(this.draw.bind(this));
        window.requestAnimationFrame(() => this.tick());

    }

    private update() {


        this.camera.ratio = this.renderer.ratio;
        this.camera.update();

        this.cubeModel.ry +=Timer.delta*0.2
        UI.pushWindow("test")

        UI.popWindow()
    }

    private draw() {


        this.canvasRenderPass.add();

    }


}

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
import MouseListener from "./lib/MouseListener.ts";
import PanoramaViewController from "./PanoramaViewController.ts";
import Ray from "./lib/Ray.ts";
import HotSpot from "./HotSpot.ts";
import TextureLoader from "./lib/textures/TextureLoader.ts";

export default class Main {
    private canvas: HTMLCanvasElement;
    private canvasManager: CanvasManager;
    private renderer: Renderer;
    private preloader!: PreLoader;
    private camera!: Camera;
    private canvasRenderPass!: CanvasRenderPass;
    private cubeModel!: Model;
    private cubeTexture!: CubeTextureLoader;
    private mouseListener!: MouseListener;
    private panormaViewController!: PanoramaViewController;
    private ray = new Ray()
    private hotSpot1!: HotSpot;
    private hotSpot2!: HotSpot;
    private infoTexture!: TextureLoader;

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

        this.mouseListener = new MouseListener(this.renderer)

        this.camera = new Camera(this.renderer)
        this.camera.near = 0.1
        this.camera.far = 10
        this.camera.fovy = 1.5
        this.camera.cameraWorld.set(0, 0, 0)
        this.camera.cameraLookAt.set(1, 0, 0)

        this.panormaViewController = new PanoramaViewController(this.camera, this.mouseListener)

        this.canvasRenderPass = new CanvasRenderPass(this.renderer, this.camera)
        this.renderer.setCanvasColorAttachment(this.canvasRenderPass.canvasColorAttachment);


        this.cubeModel = new Model(this.renderer, "cubeModel")
        this.cubeModel.mesh = new Box(this.renderer)
        this.cubeModel.material = new CubeMaterial(this.renderer, "testMat")
        this.cubeModel.material.setTexture("myTexture", this.cubeTexture)
        this.canvasRenderPass.modelRenderer.addModel(this.cubeModel)

        this.hotSpot1 = new HotSpot(this.renderer)
        this.canvasRenderPass.modelRenderer.addModel(this.hotSpot1.model)

        this.hotSpot2 = new HotSpot(this.renderer)
        this.hotSpot2.position.set(-0.9757119771757714, 0.13768675001373945, 0.17037751162169576,1)
        this.canvasRenderPass.modelRenderer.addModel(this.hotSpot2.model)

        this.tick();
    }

    private tick() {

        this.update();

        UI.updateGPU();
        this.mouseListener.reset();
        this.renderer.update(this.draw.bind(this));
        window.requestAnimationFrame(() => this.tick());

    }

    private update() {
        this.camera.ratio = this.renderer.ratio;
        this.panormaViewController.update()
this.hotSpot1.update()
        this.hotSpot2.update()
        this.camera.update();

        if (this.mouseListener.isDownThisFrame) {

            this.ray.setFromCamera(this.camera, this.mouseListener.getMouseNorm())

            console.log(this.ray.rayDir)

        }


        UI.pushWindow("test")

        UI.popWindow()
    }

    private draw() {


        this.canvasRenderPass.add();

    }


}

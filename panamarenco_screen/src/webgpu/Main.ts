import CanvasManager from "./lib/CanvasManager.ts";
import Renderer from "./lib/Renderer.ts";
import PreLoader from "./lib/PreLoader.ts";
import Camera from "./lib/Camera.ts";
import CanvasRenderPass from "./CanvasRenderPass.ts";
import UI from "./lib/UI/UI.ts";

export default class Main {
    private canvas: HTMLCanvasElement;
    private canvasManager: CanvasManager;
    private renderer: Renderer;
    private preloader!: PreLoader;
    private camera!: Camera;
    private canvasRenderPass!: CanvasRenderPass;


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


        this.init();
    }

    init(){

        this.camera = new Camera(this.renderer)
        this.camera.near = 0.1
        this.camera.far = 10
        this.camera.cameraWorld.set(1, 5, 1)
        this.camera.cameraLookAt.set(0, 0, 0)

        this.canvasRenderPass = new CanvasRenderPass(this.renderer, this.camera)
        this.renderer.setCanvasColorAttachment(this.canvasRenderPass.canvasColorAttachment);


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


        UI.pushWindow("test")

        UI.popWindow()
    }

    private draw() {


        this.canvasRenderPass.add();

    }


}

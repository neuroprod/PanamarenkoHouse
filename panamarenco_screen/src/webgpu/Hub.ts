import Camera from "./lib/Camera.ts";
import PanoramaViewController from "./PanoramaViewController.ts";
import CanvasRenderPass from "./CanvasRenderPass.ts";
import Renderer from "./lib/Renderer.ts";
import MouseListener from "./lib/MouseListener.ts";
import Ray from "./lib/Ray.ts";

export default class Hub{
    private renderer: Renderer;
    private canvas: HTMLCanvasElement;
    private mouseListener: MouseListener;
    private camera: Camera;
    private panoramaViewController: PanoramaViewController;
   canvasRenderPass: CanvasRenderPass;
    private ray = new Ray()
    constructor(renderer:Renderer,canvas:HTMLCanvasElement) {
        this.renderer =renderer;
        this.canvas = canvas;
        this.mouseListener = new MouseListener(this.renderer, this.canvas)



        this.camera = new Camera(this.renderer)
        this.camera.near = 0.1
        this.camera.far = 10
        this.camera.fovy = 1.5
        this.camera.cameraWorld.set(0, 0, 0)
        this.camera.cameraLookAt.set(1, 0, 0)

        this.panoramaViewController = new PanoramaViewController(this.camera, this.mouseListener)

        this.canvasRenderPass = new CanvasRenderPass(this.renderer, this.camera)

    }

    public update(){

        this.camera.ratio = this.renderer.ratio;
        this.panoramaViewController.update()
        this.camera.update();

        if (this.mouseListener.isDownThisFrame) {

            this.ray.setFromCamera(this.camera, this.mouseListener.getMouseNorm())

            console.log(this.ray.rayDir)

        }



        this.mouseListener.reset();

    }


}

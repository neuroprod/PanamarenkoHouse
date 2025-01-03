import Camera from "./lib/Camera.ts";
import MouseListener from "./lib/MouseListener.ts";
import {Vector2} from "@math.gl/core";

export default class PanoramaViewController {
    private camera: Camera;
    private mouseListener: MouseListener;
    private mousePosPerv = new Vector2()
    private mouseSpeed = new Vector2()
    private eulerSpeed = new Vector2()
    private mouseSpeedScale = 0.5
    private theta = Math.PI / 2
    private gamma = 0

    constructor(camera: Camera, mouseListener: MouseListener) {
        this.camera = camera;
        this.mouseListener = mouseListener

    }

    update() {
        const fov = this.camera.fovy;
        const z = 0.5 / Math.tan(fov * 0.5);
        const fovH = Math.atan2(this.camera.ratio * 0.5, z) * 2;
        let mp = this.mouseListener.getMouseNorm();
        if (this.mouseListener.isDownThisFrame) {
            this.mousePosPerv.from(mp);
            this.eulerSpeed.set(0, 0)

        }
        if (this.mouseListener.isDown && !this.mouseListener.isDownThisFrame) {
            this.mouseSpeed.from(mp).subtract(this.mousePosPerv)

            this.mousePosPerv.from(mp)


            this.eulerSpeed.set(this.mouseSpeed.y * fov * this.mouseSpeedScale, this.mouseSpeed.x * fovH * -1 * this.mouseSpeedScale);


        }
        if (!this.mouseListener.isDown) {
            this.eulerSpeed.scale(0.92)
        }
        this.gamma += this.eulerSpeed.y;


        this.theta += this.eulerSpeed.x;
        this.theta = Math.max(this.theta, 0.6)
        this.theta = Math.min(this.theta, 2.6)
        let xP = Math.sin(this.theta) * Math.cos(this.gamma)
        let zP = Math.sin(this.theta) * Math.sin(this.gamma)
        let yP = Math.cos(this.theta)


        this.camera.cameraLookAt.set(xP, yP, zP)


    }
}

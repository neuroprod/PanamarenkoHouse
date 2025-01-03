import Texture, {TextureOptions} from "./Texture";
import Renderer from "../Renderer";
import {TextureFormat} from "../WebGPUConstants";

export default class CubeTextureLoader extends Texture {
    public loaded: boolean=false;

    onComplete=()=>{}
    constructor(renderer: Renderer,label:string ,urls:Array<string>, options: Partial<TextureOptions>={}) {
        super(renderer, label, options)

        this.options.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;

        this.options.depthOrArrayLayers =6;

this.make()

        this.loadURLS(urls).then(() => {

            this.onComplete();
        });


    }

    async loadURLS(urls:Array<string>) {

        const promises = urls.map(async (src) => {
            const response = await fetch(src);
            return createImageBitmap(await response.blob());
        });
        const imageBitmaps = await Promise.all(promises);

        this.options.width = imageBitmaps[0].width;
        this.options.height = imageBitmaps[0].height;
        this.options.depthOrArrayLayers =6;









        //this.options.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        this.isDirty = true;
        this.make();


        for (let i = 0; i < imageBitmaps.length; i++) {
            const imageBitmap = imageBitmaps[i];
            this.device.queue.copyExternalImageToTexture(
                { source: imageBitmap },
                { texture: this.textureGPU, origin: [0, 0, i] },
                [imageBitmap.width, imageBitmap.height]
            );
        }
        this.loaded=true;
    }

}

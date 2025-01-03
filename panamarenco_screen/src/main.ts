import './style.css'
import Main from "./webgpu/Main.ts";



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id ="content">Content</div>
  <canvas id="webGPUCanvas1"></canvas>
  <canvas id="webGPUCanvas2"></canvas>
`

// @ts-ignore
const main  =new Main()

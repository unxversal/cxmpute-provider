/* eslint-disable import/no-extraneous-dependencies */
import { Router, Request, Response } from 'express';
import { DiffusionPipeline } from '@aislamov/diffusers.js';
import { PNG } from 'pngjs';

const router = Router();
const model = 'aislamov/stable-diffusion-2-1-base-onnx';

/**
 * POST /api/v1/image
 *
 * Example JSON Body:
 * {
 *   "prompt": "an astronaut riding a horse",
 *   "model": "aislamov/stable-diffusion-2-1-base-onnx",
 *   "numInferenceSteps": 30,
 *   "width": 512,
 *   "height": 512
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      prompt,            // A default prompt if none provided
      numInferenceSteps = 30,                            // Inference steps
      width = 512,
      height = 512,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 1) Create or Load the pipeline.
    //    - This can be expensive, so in production you may want to:
    //      (a) do it once globally, OR
    //      (b) cache pipelines by model name, etc.
    const pipe = await DiffusionPipeline.fromPretrained(model);
    // If you want to ensure GPU usage, do something like:
    //    pipe.to('gpu'); // or pipe.to('webgpu'), depending on the environment

    // 2) Generate the image(s) by calling .run().
    //    - We can pass various options (width, height, etc.).
    //    - Note: diffusers.js may not allow resizing easily. Some models expect 512x512.
    //      If your pipeline or model requires 512x512, you can skip dynamic resizing,
    //      or check the library for how to pass custom sizes.
    const images = await pipe.run({
      prompt,
      numInferenceSteps,
      // diffusers.js might not accept arbitrary width/height. 
      // If your model does, you might pass something like:
      // width, height
    });

    // images is an array of Tensors in shape [N, C, W, H].
    // We’ll assume 1 image was generated => images[0].
    const tensor = images[0]
      .mul(255)
      .round()
      .clipByValue(0, 255)
      .transpose(0, 2, 3, 1); // shape => [width, height, channels=3] after transpose

    // 3) Convert the tensor into a PNG and stream it back to the client.
    const p = new PNG({
      width: width,
      height: height,
      inputColorType: 2, // color type 2 = truecolor
    });

    // The typed data from the tensor. (the underlying float32 data)
    // We must cast it to a Buffer.
    p.data = Buffer.from(tensor.data);

    // We can stream this PNG to the response:
    res.setHeader('Content-Type', 'image/png');
    p.pack().pipe(res);
  } catch (error) {
    console.error('Error in /image route:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

/* eslint-disable import/no-extraneous-dependencies */
import { Router, Request, Response } from 'express';
import { DiffusionPipeline, StableDiffusionPipeline } from '@aislamov/diffusers.js';
import { PNG } from 'pngjs';

const router = Router();
const model = 'aislamov/stable-diffusion-2-1-base-onnx';
// 1) Create or Load the pipeline.
let pipe: StableDiffusionPipeline;

(async () => {
  // create or load the pipeline
  pipe = await DiffusionPipeline.fromPretrained(model);
})().catch((err) => {
  console.error('Error initializing pipeline:', err);
});

/**
 * POST /api/v1/image
 *
 * Example JSON Body:
 * {
 *   "prompt": "an astronaut riding a horse",
 *   "numInferenceSteps": 30,
 *   "width": 512,
 *   "height": 512
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      prompt,            // A default prompt if none provided
      negativePrompt,    // Optional negative prompt
      numInferenceSteps = 30,                            // Inference steps
      width = 512,
      height = 512,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 2) Generate the image(s) by calling .run().
    const images = await pipe.run({
      prompt,
      negativePrompt,
      numInferenceSteps,
      height,
      width,
      progressCallback: async (progress: any): Promise<void> => {
        console.log(progress);
      },
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

/* eslint-disable @typescript-eslint/naming-convention */
// src/api/video.ts
import { Router, Request, Response } from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface VideoRouterOptions {
  generatePyFileRoute: string; // e.g. "/path/to/generate.py"
  wanModelRoute: string;       // e.g. "/path/to/Wan2.1-T2V-1.3B"
}

export function createVideoRouter(options: VideoRouterOptions) {
  const router = Router();

  /**
   * POST /api/v1/video
   * 
   * Request Body Example:
   * {
   *   "prompt": "Two cats boxing on a stage",
   *   "size": "832*480",     // e.g. "832*480"
   *   "ckpt_dir": "./Wan2.1-T2V-1.3B",
   *   "sample_shift": 8,
   *   "sample_guide_scale": 6,
   *   "offload_model": true,
   *   "t5_cpu": true
   * }
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      // Extract user input from request
      const {
        prompt,
        size,
        // The user might pass in their own ckpt_dir,
        // but if they don't, we can default to options.wanModelRoute
        ckpt_dir,
        sample_shift,
        sample_guide_scale,
        offload_model,
        t5_cpu,
      } = req.body;

      // Fallback to the CLI param (wanModelRoute) if user didn't pass ckpt_dir:
      const effectiveCkptDir = ckpt_dir || options.wanModelRoute;

      if (!prompt || !size || !effectiveCkptDir) {
        return res.status(400).json({
          error:
            'Missing required fields: "prompt", "size", or "ckpt_dir"/wanModelRoute',
        });
      }

      // Build a random output filename
      const outputFilename = `wan_output_${Date.now()}.mp4`;
      const outputPath = path.join(__dirname, outputFilename);

      // Build the arguments array for generate.py
      // We'll use options.generatePyFileRoute, so we can spawn
      // e.g. "python /some/absolute/path/to/generate.py"
      const args: string[] = [
        options.generatePyFileRoute, // e.g. "/path/to/generate.py"
        '--task',
        't2v-1.3B',                 // or t2v-14B
        '--size',
        size,                       // e.g. "832*480"
        '--ckpt_dir',
        effectiveCkptDir,           // final path to model
        '--prompt',
        prompt,
        '--output',
        outputPath,                 // your custom param in generate.py
      ];

      if (sample_shift !== undefined) {
        args.push('--sample_shift', sample_shift.toString());
      }
      if (sample_guide_scale !== undefined) {
        args.push('--sample_guide_scale', sample_guide_scale.toString());
      }
      if (offload_model) {
        args.push('--offload_model', 'True');
      }
      if (t5_cpu) {
        args.push('--t5_cpu');
      }

      // Spawn the Python process
      //   e.g. python /path/to/generate.py --task ...
      const pythonProcess = spawn('python', args, {
        cwd: process.cwd(),
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
        console.log(`[Wan2.1 stdout] ${data}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(`[Wan2.1 stderr] ${data}`);
      });

      pythonProcess.on('error', (err) => {
        console.error('Error spawning Python process', err);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`generate.py exited with code ${code}`);
          console.error(stderrData);
          return res.status(500).json({
            error: 'Wan2.1 generation failed',
            stderr: stderrData,
          });
        }

        // If the script finishes successfully, stream or return the mp4.
        res.setHeader('Content-Type', 'video/mp4');
        fs.createReadStream(outputPath)
          .on('error', (err) => {
            console.error('Error reading output file:', err);
            return res.status(500).json({
              error: 'Failed to read output video file',
            });
          })
          .pipe(res)
          .on('finish', () => {
            // Optionally delete the file after streaming
            fs.unlink(outputPath, () => null);
          });
      });
    } catch (error) {
      console.error('Error in /video route:', error);
      return res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}
import { Jimp } from 'jimp';

async function resizePlant() {
  try {
    // Create transparent 512x512 canvas
    const canvas = new Jimp({ width: 512, height: 512, color: 0x00000000 });
    
    // Load and resize plant to 20x20 (smaller)
    const plant = await Jimp.read("/Users/Mohak/Downloads/—Pngtree—plant in pot pixel art_9066899.png");
    plant.resize({ w: 20, h: 20 });
    
    // Position further right: x=290, y=35 (centered in that area)
    const x = 290 - 10;  // center the 20x20 icon
    const y = 35 - 10;
    
    // Copy pixels from plant to canvas
    for (let py = 0; py < 20; py++) {
      for (let px = 0; px < 20; px++) {
        const pixelColor = plant.getPixelColor(px, py);
        canvas.setPixelColor(pixelColor, x + px, y + py);
      }
    }
    
    // Write to both theme folders
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/pink/search_button.png");
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/blue/search_button.png");
    
    console.log("✓ Resized plant to 20x20 and positioned at (" + x + ", " + y + ")");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

resizePlant();

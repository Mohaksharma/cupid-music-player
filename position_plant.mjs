import { Jimp } from 'jimp';

async function positionPlant() {
  try {
    // Create transparent 512x512 canvas
    const canvas = new Jimp({ width: 512, height: 512, color: 0x00000000 });
    
    // Load and resize plant to 20x20
    const plant = await Jimp.read("/Users/Mohak/Downloads/—Pngtree—plant in pot pixel art_9066899.png");
    plant.resize({ w: 20, h: 20 });
    
    // Settings icon is at approximately (310, 57) on canvas
    // Position plant icon to the LEFT of settings, at similar vertical level
    // x = 310 - 30 = 280 (30 pixels to the left), y = 50
    const x = 280;
    const y = 50;
    
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
    
    console.log("✓ Positioned plant icon next to settings at (" + x + ", " + y + ")");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

positionPlant();

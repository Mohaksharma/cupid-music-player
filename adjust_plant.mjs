import { Jimp } from 'jimp';

async function adjustPlant() {
  try {
    const canvas = new Jimp({ width: 512, height: 512, color: 0x00000000 });
    
    const plant = await Jimp.read("/Users/Mohak/Downloads/—Pngtree—plant in pot pixel art_9066899.png");
    plant.resize({ w: 20, h: 20 });
    
    // Move 2 pixels up: y = 50 - 2 = 48
    const x = 274;
    const y = 48;
    
    for (let py = 0; py < 20; py++) {
      for (let px = 0; px < 20; px++) {
        const pixelColor = plant.getPixelColor(px, py);
        canvas.setPixelColor(pixelColor, x + px, y + py);
      }
    }
    
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/pink/search_button.png");
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/blue/search_button.png");
    
    console.log("✓ Moved plant 2 pixels up to y=" + y);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

adjustPlant();

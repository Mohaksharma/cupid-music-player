import { Jimp } from 'jimp';

async function createSearchIcon() {
  try {
    // Create transparent 512x512 canvas
    const canvas = new Jimp({ width: 512, height: 512, color: 0x00000000 });
    
    // Load and resize plant
    const plant = await Jimp.read("/Users/Mohak/Downloads/—Pngtree—plant in pot pixel art_9066899.png");
    plant.resize({ w: 56, h: 56 });
    
    // Use the composite method with the correct syntax
    for (let y = 0; y < 56; y++) {
      for (let x = 0; x < 56; x++) {
        const pixelColor = plant.getPixelColor(x, y);
        canvas.setPixelColor(pixelColor, x + 232, y + 29);
      }
    }
    
    // Write to both theme folders
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/pink/search_button.png");
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/blue/search_button.png");
    
    console.log("✓ Created search_button.png");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createSearchIcon();

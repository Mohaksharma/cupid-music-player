import { Jimp } from 'jimp';

async function replaceIcon() {
  try {
    const canvas = new Jimp({ width: 512, height: 512, color: 0x00000000 });
    
    // Load and resize planning icon to 20x20
    const icon = await Jimp.read("/Users/Mohak/Downloads/planning.png");
    icon.resize({ w: 20, h: 20 });
    
    // Position at x=274, y=48 (same as plant)
    const x = 274;
    const y = 48;
    
    for (let py = 0; py < 20; py++) {
      for (let px = 0; px < 20; px++) {
        const pixelColor = icon.getPixelColor(px, py);
        canvas.setPixelColor(pixelColor, x + px, y + py);
      }
    }
    
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/pink/search_button.png");
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/blue/search_button.png");
    
    console.log("✓ Replaced plant with planning icon at (" + x + ", " + y + ")");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

replaceIcon();

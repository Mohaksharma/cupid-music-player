const { Jimp } = require('jimp');

async function createSearchButton() {
  try {
    const plant = await Jimp.read("/Users/Mohak/Downloads/—Pngtree—plant in pot pixel art_9066899.png");
    plant.resize({ w: 56, h: 56 });
    
    const canvas = new Jimp({ width: 512, height: 512 });
    canvas.composite({ src: plant, x: 232, y: 29 });
    
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/pink/search_button.png");
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/blue/search_button.png");
    
    console.log("✓ Created 512x512 search_button.png with 56x56 plant icon");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

createSearchButton();

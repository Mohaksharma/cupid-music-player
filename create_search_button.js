const Jimp = require('jimp');
const path = require('path');

async function createSearchButton() {
  try {
    // Load the plant PNG
    const plant = await Jimp.read("/Users/Mohak/Downloads/—Pngtree—plant in pot pixel art_9066899.png");
    
    // Resize to 56 pixels (small button icon)
    plant.resize(56, 56);
    
    // Create 512x512 transparent canvas
    const canvas = new Jimp({ width: 512, height: 512, color: 0x00000000 });
    
    // Position: search button is at (305-140)/306 vw = 0.637 of visible frame
    // On 512px canvas: 0.637 * 512/306 * 306 = 0.637 * 512 ≈ 326 pixels from left
    // But we need it based on the visible area offset
    // Visible frame left offset: 110/306 * 512 ≈ 185 pixels
    // Button position in visible frame: 195/306 * 306 = 195 pixels (from visible area start)
    // So absolute position: 185 + 195 = 380? No wait...
    
    // The button click zone is at: calc((305 - 140) / 306 * 100vw)
    // Let me recalculate:
    // On canvas: position for search button should mirror the settings button
    // Settings is at: (305 - 110) / 306 = 0.637vw
    // Search is at: (305 - 140) / 306 = 0.539vw
    // That's about 30 pixels to the left of settings (64 pixels visible difference / 306 * 512 ≈ 107 pixels canvas difference)
    
    // Settings icon is at approximately (310, 57) on canvas
    // Search button should be 30*512/306 ≈ 50 pixels to the left
    // So search position: approximately (260, 57)
    
    const x = 260 - 28;  // center the 56x56 icon
    const y = 57 - 28;
    
    canvas.composite(plant, x, y);
    
    // Save to both theme folders
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/pink/search_button.png");
    await canvas.write("/Users/Mohak/Desktop/projects/electron/Project1/assets/blue/search_button.png");
    
    console.log("✓ Created 512x512 search_button.png with 56x56 plant icon at position (" + x + ", " + y + ")");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

createSearchButton();

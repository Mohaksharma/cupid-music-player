// Window control utilities for Electron
// These functions communicate with the main process via IPC

export async function minimizeWindow() {
  try {
    if (window.electron && window.electron.ipcRenderer) {
      return await window.electron.ipcRenderer.invoke('window-minimize')
    }
  } catch (error) {
    console.error('Error minimizing window:', error)
  }
}

export async function toggleMaximizeWindow() {
  try {
    if (window.electron && window.electron.ipcRenderer) {
      return await window.electron.ipcRenderer.invoke('window-toggle-maximize')
    }
  } catch (error) {
    console.error('Error toggling maximize:', error)
  }
}

export async function closeWindow() {
  try {
    if (window.electron && window.electron.ipcRenderer) {
      return await window.electron.ipcRenderer.invoke('window-close')
    }
  } catch (error) {
    console.error('Error closing window:', error)
  }
}

// Fallback for non-Electron environment (development)
// Make IPC available on window object
if (typeof window !== 'undefined' && typeof require !== 'undefined') {
  try {
    const { ipcRenderer } = require('electron')
    window.electron = { ipcRenderer }
  } catch (e) {
    // Not in Electron context, skip
  }
}

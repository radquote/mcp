import { homedir, platform } from 'node:os';
import { join } from 'node:path';

const home = homedir();

export const HOME = home;

export function claudeDesktopConfigPath(): string {
  switch (platform()) {
    case 'darwin':
      return join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    case 'win32':
      return join(process.env.APPDATA ?? join(home, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
    default:
      return join(process.env.XDG_CONFIG_HOME ?? join(home, '.config'), 'Claude', 'claude_desktop_config.json');
  }
}

export function claudeDesktopAppDir(): string {
  switch (platform()) {
    case 'darwin':
      return join(home, 'Library', 'Application Support', 'Claude');
    case 'win32':
      return join(process.env.APPDATA ?? join(home, 'AppData', 'Roaming'), 'Claude');
    default:
      return join(process.env.XDG_CONFIG_HOME ?? join(home, '.config'), 'Claude');
  }
}

export function claudeCodeUserConfigPath(): string {
  return join(home, '.claude.json');
}

export function cursorConfigPath(): string {
  return join(home, '.cursor', 'mcp.json');
}

export function windsurfConfigPath(): string {
  switch (platform()) {
    case 'win32':
      return join(process.env.USERPROFILE ?? home, '.codeium', 'windsurf', 'mcp_config.json');
    default:
      return join(home, '.codeium', 'windsurf', 'mcp_config.json');
  }
}

export function codexConfigPath(): string {
  return join(home, '.codex', 'config.toml');
}

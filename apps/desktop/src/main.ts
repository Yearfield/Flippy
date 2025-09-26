export interface DesktopAppConfig {
  readonly autoUpdateEnabled: boolean;
  readonly featureFlags: Record<string, boolean>;
}

export const defaultConfig: DesktopAppConfig = {
  autoUpdateEnabled: false,
  featureFlags: {
    updates: false,
  },
};

export function createWindow(config: DesktopAppConfig = defaultConfig): string {
  const updateStatus = config.featureFlags.updates ? 'updates enabled' : 'updates disabled';
  return `Solicitor desktop shell bootstrapped with ${updateStatus}.`;
}

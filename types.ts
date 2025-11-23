export interface LocationData {
  name: string;
  shortDescription: string;
  visualAtmosphere: string;
  lore: string;
  sensoryDetails: {
    sound: string;
    smell: string;
    lighting: string;
  };
  hiddenSecrets: string[];
  potentialLoot: string[];
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  visualPrompt: string; // Internal use for image generation
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_TEXT = 'GENERATING_TEXT',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}
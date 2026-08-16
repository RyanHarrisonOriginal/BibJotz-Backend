/**
 * Port for future AI topic detection on notes.
 * No adapter is wired yet — keep the port so the domain does not depend on an AI vendor.
 */
export interface IDetectedTopic {
  label: string;
  confidence: number;
}

export interface ITopicDetector {
  detect(content: string): Promise<IDetectedTopic[]>;
}

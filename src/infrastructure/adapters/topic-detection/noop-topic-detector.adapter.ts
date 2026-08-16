/**
 * No-op adapter for ITopicDetector.
 * Replace with an LLM/vendor adapter when topic detection ships.
 * Domain code depends only on the port, never on this file.
 */
import { IDetectedTopic, ITopicDetector } from '@/domain/Note/ports/topic-detector.port';

export class NoopTopicDetectorAdapter implements ITopicDetector {
  async detect(_content: string): Promise<IDetectedTopic[]> {
    return [];
  }
}

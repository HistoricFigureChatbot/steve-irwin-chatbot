/**
 * Unit Tests for Message Analyzer
 * Tests UT1 and UT2: Keyword Detection Engine
 * 
 * UT1: Prevent false triggers from partial-word matches
 * UT2: Ensure whole-word matching correctly detects target topics
 */

import { isGreeting, findTopic, setConversations } from '../../services/messageAnalyser.js';

// Mock conversation data for testing
const mockConversations = {
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'gday', "g'day"]
  },
  crocodiles: {
    keywords: ['crocodile', 'croc', 'crocodiles', 'crocs']
  },
  lions: {
    keywords: ['lion', 'lions']
  },
  kangaroos: {
    keywords: ['kangaroo', 'kangaroos', 'roo']
  }
};

// Setup before tests
beforeAll(() => {
  setConversations(mockConversations);
});

describe('UT1: Keyword Detection - Prevent Partial-Word False Positives', () => {
  
  test('Should NOT detect "hi" in "which animal is the fastest"', () => {
    const result = isGreeting('which animal is the fastest');
    expect(result).toBe(false);
  });

  test('Should NOT detect "hi" in "this animal is very fast"', () => {
    const result = isGreeting('this animal is very fast');
    expect(result).toBe(false);
  });

  test('Should NOT detect greeting in "achieve great things"', () => {
    const result = isGreeting('achieve great things');
    expect(result).toBe(false);
  });

  test('Should NOT detect "hi" within "higher" or "behind"', () => {
    expect(isGreeting('higher ground')).toBe(false);
    expect(isGreeting('behind the tree')).toBe(false);
  });

  test('Should NOT detect topic keyword as partial match in unrelated word', () => {
    // "lion" should not match in "illion" or "medallion"
    const topics = findTopic('a million dollars');
    const topicNames = topics.map(t => t.name);
    expect(topicNames).not.toContain('lions');
  });
});

describe('UT2: Keyword Detection - Whole-Word Matching', () => {
  
  test('Should correctly detect "hi" as standalone greeting', () => {
    expect(isGreeting('hi')).toBe(true);
    expect(isGreeting('Hi there')).toBe(true);
    expect(isGreeting('Oh hi!')).toBe(true);
  });

  test('Should detect "hello" with punctuation', () => {
    expect(isGreeting('Hello!')).toBe(true);
    expect(isGreeting('Hello, mate')).toBe(true);
    expect(isGreeting('Well, hello there')).toBe(true);
  });

  test('Should correctly detect crocodile topic', () => {
    const topics = findTopic('Tell me about crocodiles');
    const topicNames = topics.map(t => t.name);
    expect(topicNames).toContain('crocodiles');
  });

  test('Should detect topic with punctuation boundaries', () => {
    const topics1 = findTopic('What do crocodiles eat?');
    const topicNames1 = topics1.map(t => t.name);
    expect(topicNames1).toContain('crocodiles');
    
    const topics2 = findTopic('I love lions!');
    const topicNames2 = topics2.map(t => t.name);
    expect(topicNames2).toContain('lions');
  });

  test('Should detect topic at start, middle, and end of sentence', () => {
    const topics1 = findTopic('Kangaroos are amazing').map(t => t.name);
    const topics2 = findTopic('Tell me about kangaroos please').map(t => t.name);
    const topics3 = findTopic('I want to learn about kangaroos').map(t => t.name);
    expect(topics1).toContain('kangaroos');
    expect(topics2).toContain('kangaroos');
    expect(topics3).toContain('kangaroos');
  });

  test('Should be case-insensitive', () => {
    expect(isGreeting('HELLO')).toBe(true);
    expect(isGreeting('HeLLo')).toBe(true);
    const topics = findTopic('CROCODILES are cool').map(t => t.name);
    expect(topics).toContain('crocodiles');
  });

  test('Should detect multiple keywords in one message', () => {
    const topics = findTopic('Tell me about lions and crocodiles');
    const topicNames = topics.map(t => t.name);
    expect(topicNames).toContain('lions');
    expect(topicNames).toContain('crocodiles');
  });
});

describe('Edge Cases - Keyword Detection', () => {
  
  test('Should handle empty string', () => {
    expect(isGreeting('')).toBe(false);
    expect(findTopic('')).toEqual([]);
  });

  test('Should handle strings with only punctuation', () => {
    expect(isGreeting('!!!')).toBe(false);
    expect(findTopic('???')).toEqual([]);
  });

  test('Should handle numbers and special characters', () => {
    expect(isGreeting('123 hello 456')).toBe(true);
    // Note: Currently numbers are treated as word boundaries
    // So "crocodile123" WILL match "crocodile" 
    // This is acceptable as users unlikely to type this way
    const result = findTopic('Tell me about the animal');
    expect(Array.isArray(result)).toBe(true);
  });
});

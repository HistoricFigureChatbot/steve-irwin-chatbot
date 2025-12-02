/**
 * Test whole-word matching to prevent false positives
 * Run: node test-word-matching.js
 */

const testWordMatching = async () => {
  const API_URL = 'http://localhost:3001/api';
  
  console.log('🧪 Testing Whole-Word Matching\n');
  console.log('='.repeat(60));
  
  const testCases = [
    { 
      msg: 'which crocodile is the biggest?', 
      expectedBehavior: 'Should detect as question (which) and route to LLM, NOT greeting',
      shouldBeQuestion: true,
      shouldBeGreeting: false
    },
    { 
      msg: 'hi Steve!', 
      expectedBehavior: 'Should detect as greeting',
      shouldBeQuestion: false,
      shouldBeGreeting: true
    },
    { 
      msg: 'what is the difference between pythons and vipers?', 
      expectedBehavior: 'Should detect as question about snakes',
      shouldBeQuestion: true,
      shouldBeGreeting: false
    },
    { 
      msg: 'I think crocodiles are amazing', 
      expectedBehavior: 'Should be statement (not question, not greeting)',
      shouldBeQuestion: false,
      shouldBeGreeting: false
    },
    {
      msg: 'hello there',
      expectedBehavior: 'Should detect as greeting',
      shouldBeQuestion: false,
      shouldBeGreeting: true
    },
    {
      msg: 'which animals do you like?',
      expectedBehavior: 'Should detect as question with "which"',
      shouldBeQuestion: true,
      shouldBeGreeting: false
    },
    {
      msg: 'this is fascinating',
      expectedBehavior: 'Should NOT detect "hi" inside "this" as greeting',
      shouldBeQuestion: false,
      shouldBeGreeting: false
    }
  ];
  
  for (const test of testCases) {
    console.log(`\n📝 Testing: "${test.msg}"`);
    console.log(`   Expected: ${test.expectedBehavior}`);
    console.log('-'.repeat(60));
    
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: test.msg, userId: 'test-user' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const isGreeting = data.data.topics?.includes('greetings');
        const usedLLM = data.data.isLLM;
        
        console.log(`✅ Response received`);
        console.log(`   Topics: ${data.data.topics?.join(', ') || 'N/A'}`);
        console.log(`   Is Greeting: ${isGreeting ? 'YES' : 'NO'}`);
        console.log(`   Used LLM: ${usedLLM ? 'YES (question)' : 'NO (scripted)'}`);
        
        // Validation
        let passed = true;
        if (test.shouldBeGreeting && !isGreeting) {
          console.log(`   ❌ FAIL: Expected greeting but wasn't detected`);
          passed = false;
        } else if (!test.shouldBeGreeting && isGreeting) {
          console.log(`   ❌ FAIL: False positive - incorrectly detected as greeting`);
          passed = false;
        }
        
        if (test.shouldBeQuestion && !usedLLM) {
          console.log(`   ⚠️  Note: Expected question to use LLM but used scripted response`);
        }
        
        if (passed) {
          console.log(`   ✅ PASS!`);
        }
      } else {
        console.error('❌ Error:', data.error);
      }
    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Word Matching Test Complete!\n');
};

testWordMatching().catch(console.error);

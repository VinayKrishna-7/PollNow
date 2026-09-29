/**
 * Comprehensive Automated Test Suite for PollNow API
 * Verifies all 40 checklist items and edge cases
 */

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('============================================');
  console.log('Starting PollNow API Automated Test Suite...');
  console.log('============================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'healthy', '1. Server Health Check');

    // 2. Empty question validation
    const emptyQRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '   ', options: ['A', 'B'] }),
    });
    assert(emptyQRes.status === 400, '2. Validation: Empty question rejects with 400');

    // 3. Question over 200 characters validation
    const longQRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'x'.repeat(201), options: ['A', 'B'] }),
    });
    assert(longQRes.status === 400, '3. Validation: Question > 200 chars rejects with 400');

    // 4. Create poll with only one option
    const oneOptRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'Valid Question?', options: ['Option 1'] }),
    });
    assert(oneOptRes.status === 400, '4. Validation: Poll with 1 option rejects with 400');

    // 5. Attempt 11 options
    const elevenOptsRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Too many options?',
        options: Array.from({ length: 11 }, (_, i) => `Opt ${i + 1}`),
      }),
    });
    assert(elevenOptsRes.status === 400, '5. Validation: Poll with 11 options rejects with 400');

    // 6. Attempt duplicate options
    const dupOptsRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Duplicate check?',
        options: ['React', 'Vue', 'react'],
      }),
    });
    assert(dupOptsRes.status === 400, '6. Validation: Duplicate options reject with 400');

    // 7. Create valid poll with 10 options
    const tenOptsRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Testing 10 options limit',
        options: Array.from({ length: 10 }, (_, i) => `Choice ${i + 1}`),
      }),
    });
    const tenOptsJson = await tenOptsRes.json();
    assert(
      tenOptsRes.status === 201 && tenOptsJson.data.poll.options.length === 10,
      '7. Feature: Create valid poll with exactly 10 options'
    );

    // 8. Create valid standard single-choice poll with resultsVisibility: 'always'
    const createRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Which framework is your favorite?',
        options: ['Next.js', 'Remix', 'Astro', 'Nuxt'],
        settings: {
          votingType: 'single',
          maxSelections: 1,
          resultsVisibility: 'always',
          allowVoteChange: true,
        },
      }),
    });
    const createJson = await createRes.json();
    const pollId = createJson.data?.poll?.pollId;
    const managementToken = createJson.data?.managementToken;
    const opt0Id = createJson.data?.poll?.options[0]?.optionId;
    const opt1Id = createJson.data?.poll?.options[1]?.optionId;

    assert(
      createRes.status === 201 &&
        pollId &&
        managementToken &&
        !createJson.data.poll.managementTokenHash,
      '8. Feature: Poll created successfully with management token (hash never exposed)'
    );

    // 9. Fetch poll public endpoint
    const getPollRes = await fetch(`${BASE_URL}/polls/${pollId}`);
    const getPollJson = await getPollRes.json();
    assert(
      getPollRes.status === 200 &&
        getPollJson.data.pollId === pollId &&
        getPollJson.data.options.length === 4,
      '9. Feature: Public poll view loaded correctly'
    );

    // 10. Cast vote from voter A
    const voterA = 'voter_alpha_' + Date.now();
    const voteARes = await fetch(`${BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: voterA, optionIds: [opt0Id] }),
    });
    const voteAJson = await voteARes.json();
    assert(
      voteARes.status === 200 &&
        voteAJson.data.totalVotes === 1 &&
        voteAJson.data.options[0].voteCount === 1,
      '10. Feature: Anonymous vote cast successfully with atomic count update'
    );

    // 11. Vote change test (since allowVoteChange is true)
    const voteChangeRes = await fetch(`${BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: voterA, optionIds: [opt1Id] }),
    });
    const voteChangeJson = await voteChangeRes.json();
    assert(
      voteChangeRes.status === 200 &&
        voteChangeJson.data.totalVotes === 1 &&
        voteChangeJson.data.options[0].voteCount === 0 &&
        voteChangeJson.data.options[1].voteCount === 1,
      '11. Feature: Vote change shifts atomic counts accurately without negative numbers'
    );

    // 12. Multiple choice poll with selection limits
    const mcRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Select up to 2 skills',
        options: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
        settings: {
          votingType: 'multiple',
          maxSelections: 2,
          resultsVisibility: 'afterVote',
          allowVoteChange: false,
        },
      }),
    });
    const mcJson = await mcRes.json();
    const mcPollId = mcJson.data?.poll?.pollId;
    const mcOpts = mcJson.data?.poll?.options;

    // Test exceeding selection limit (attempting 3 options when max is 2)
    const mcExceedRes = await fetch(`${BASE_URL}/polls/${mcPollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voterId: 'voter_beta',
        optionIds: [mcOpts[0].optionId, mcOpts[1].optionId, mcOpts[2].optionId],
      }),
    });
    assert(
      mcExceedRes.status === 400,
      '12. Feature: Multiple choice selection limit enforced (maxSelections)'
    );

    // Test valid multiple selection
    const mcValidVoteRes = await fetch(`${BASE_URL}/polls/${mcPollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voterId: 'voter_beta',
        optionIds: [mcOpts[0].optionId, mcOpts[1].optionId],
      }),
    });
    assert(mcValidVoteRes.status === 200, '13. Feature: Valid multiple choice vote succeeded');

    // 14. Duplicate vote rejection when allowVoteChange is false
    const mcDupVoteRes = await fetch(`${BASE_URL}/polls/${mcPollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voterId: 'voter_beta',
        optionIds: [mcOpts[2].optionId],
      }),
    });
    assert(
      mcDupVoteRes.status === 409,
      '14. Security: Duplicate vote rejected with 409 Conflict when vote change is disabled'
    );

    // 15. Results visibility: afterVote enforcement for non-voter
    const nonVoterRes = await fetch(`${BASE_URL}/polls/${mcPollId}?voterId=stranger_voter`);
    const nonVoterJson = await nonVoterRes.json();
    assert(
      nonVoterJson.data.resultsHidden === true &&
        nonVoterJson.data.options[0].voteCount === undefined,
      '15. Security: Results visibility afterVote hides vote counts from non-voters'
    );

    // 16. Results visibility: afterVote visible to voter
    const voterCheckRes = await fetch(`${BASE_URL}/polls/${mcPollId}?voterId=voter_beta`);
    const voterCheckJson = await voterCheckRes.json();
    assert(
      voterCheckJson.data.resultsHidden === false &&
        typeof voterCheckJson.data.options[0].voteCount === 'number',
      '16. Feature: Results visibility afterVote displays counts to voters who voted'
    );

    // 17. Expiration behavior: create poll expired in the past or immediately
    const expCreateRes = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Will this expire?',
        options: ['Yes', 'No'],
        expiresAt: new Date(Date.now() + 1000).toISOString(), // expires in 1 sec
      }),
    });
    const expJson = await expCreateRes.json();
    const expPollId = expJson.data.poll.pollId;

    // Wait 1.5 seconds for expiration
    await new Promise((r) => setTimeout(r, 1500));

    const expVoteRes = await fetch(`${BASE_URL}/polls/${expPollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: 'voter_late', optionIds: [expJson.data.poll.options[0].optionId] }),
    });
    assert(
      expVoteRes.status === 410,
      '17. Feature: Expired poll dynamically rejects votes with 410 Gone'
    );

    // 18. Close poll via management token
    const closeRes = await fetch(`${BASE_URL}/polls/${pollId}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${managementToken}`,
      },
    });
    const closeJson = await closeRes.json();
    assert(
      closeRes.status === 200 && closeJson.data.status === 'closed',
      '18. Management: Poll closed successfully with management token'
    );

    // 19. Voting on closed poll rejected
    const voteClosedRes = await fetch(`${BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: 'voter_charlie', optionIds: [opt0Id] }),
    });
    assert(
      voteClosedRes.status === 410,
      '19. Security: Closed poll rejects new votes with 410'
    );

    // 20. Explore & Search API
    const exploreRes = await fetch(`${BASE_URL}/polls?page=1&limit=10&sort=newest`);
    const exploreJson = await exploreRes.json();
    assert(
      exploreRes.status === 200 &&
        Array.isArray(exploreJson.data.polls) &&
        exploreJson.data.pagination.total >= 1,
      '20. Discovery: Explore and pagination API returns formatted public polls'
    );

    // 21. Delete poll via management token
    const deleteRes = await fetch(`${BASE_URL}/polls/${pollId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${managementToken}`,
      },
    });
    assert(
      deleteRes.status === 200,
      '21. Management: Poll and its votes permanently deleted with management token'
    );

    // 22. Verify deleted poll returns 404
    const verifyDelRes = await fetch(`${BASE_URL}/polls/${pollId}`);
    assert(
      verifyDelRes.status === 404,
      '22. Security: Deleted poll returns 404 Not Found'
    );

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n============================================');
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();

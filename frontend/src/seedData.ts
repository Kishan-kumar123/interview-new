/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CodingQuestion, AptitudeQuestion, InterviewQuestion } from './types';

export const SEED_CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "Easy",
    category: "Arrays",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs which takes O(N^2) time.",
      "Can we use a hash map to look up the complement in O(1) time?"
    ],
    testCases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]" },
      { input: "[3,2,4]\n6", output: "[1,2]" },
      { input: "[3,3]\n6", output: "[0,1]" }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Write your code here\n    const map = {};\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map[complement] !== undefined) {\n            return [map[complement], i];\n        }\n        map[nums[i]] = i;\n    }\n    return [];\n}`,
      python: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};`
    },
    editorial: "To solve this in O(N) time, use a Hash Map. For each element, look up if target - element is in the hash map. If yes, we found our pair and can return their indices. Else, insert the elements inside the map.",
    companies: ["Google", "Amazon", "Microsoft", "Adobe", "Flipkart"]
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list input as an array, reverse the list, and return the reversed list as an array representation.",
    difficulty: "Easy",
    category: "Linked List",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    hints: [
      "Iterate through the list. Keep track of previous node.",
      "Update next pointer of current node to previous, and advance pointers."
    ],
    testCases: [
      { input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "[1,2]", output: "[2,1]" },
      { input: "[]", output: "[]" }
    ],
    starterCode: {
      javascript: `function reverseList(arr) {\n    // Write your code here\n    return arr.slice().reverse();\n}`,
      python: `def reverseList(arr):\n    # Write your code here\n    return arr[::-1]`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> reverseList(vector<int>& arr) {\n        return {};\n    }\n};`
    },
    editorial: "Iterate through the array and reverse it, or reverse the node links by swapping next pointers while tracking current, next, and previous.",
    companies: ["Microsoft", "Adobe", "Infosys", "TCS", "Accenture"]
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "Easy",
    category: "Stack",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses characters only '()[]{}'."
    ],
    hints: [
      "Use a Stack.",
      "Push opening brackets on top of Stack, pop and match when closing bracket is met."
    ],
    testCases: [
      { input: "\"()\"", output: "true" },
      { input: "\"()[]{}\"", output: "true" },
      { input: "\"(]\"", output: "false" },
      { input: "\"([)]\"", output: "false" }
    ],
    starterCode: {
      javascript: `function isValid(s) {\n    // Write your code here\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}`,
      python: `def isValid(s):\n    # Write your code here\n    pass`
    },
    editorial: "The stack is the perfect data structure here because parentheses are self-nesting. A closing parenthesis matches the most recently opened parenthesis.",
    companies: ["Google", "Microsoft", "Amazon", "Walmart"]
  },
  {
    id: "coin-change",
    title: "Coin Change",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\nYou may assume that you have an infinite number of each kind of coin.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    hints: [
      "Let dp[i] represent the minimum coins required to make amount i.",
      "dp[i] = min(dp[i - coin] + 1) for coin in coins."
    ],
    testCases: [
      { input: "[1,2,5]\n11", output: "3" },
      { input: "[2]\n3", output: "-1" },
      { input: "[1]\n0", output: "0" }
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n    const dp = Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (let coin of coins) {\n            if (i - coin >= 0) {\n                dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      python: `def coinChange(coins, amount):\n    # Write Dynamic Programming solution here\n    pass`
    },
    editorial: "This is the classic knapsack/unbounded coin change. The state space size is amount+1, updated in O(N * amount) total time.",
    companies: ["Amazon", "Google", "Flipkart", "Walmart"]
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    difficulty: "Easy",
    category: "Arrays",
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    hints: [
      "We want to find the largest difference between two elements where the smaller element comes before the larger one.",
      "Can you maintain a running minimum as you iterate, and check potential profit at each day?"
    ],
    testCases: [
      { input: "[7,1,5,3,6,4]", output: "5" },
      { input: "[7,6,4,3,1]", output: "0" }
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxVal = 0;\n    for (let i = 0; i < prices.length; i++) {\n        if (prices[i] < minPrice) {\n            minPrice = prices[i];\n        } else if (prices[i] - minPrice > maxVal) {\n            maxVal = prices[i] - minPrice;\n        }\n    }\n    return maxVal;\n}`,
      python: `def maxProfit(prices):\n    # Write your code here\n    pass`
    },
    editorial: "Iterate through the array while maintaining the minimum price seen so far. At each step, calculate the difference between the current price and minimum price. If this difference is greater than maximum profit, update maximum profit.",
    companies: ["Amazon", "Google", "Microsoft", "Adobe"]
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    category: "Strings",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    hints: [
      "Maintain a sliding window representing the unique substring.",
      "Use details of index occurrences mapping to move the left boundary of window efficiently."
    ],
    testCases: [
      { input: "\"abcabcbb\"", output: "3" },
      { input: "\"bbbbb\"", output: "1" },
      { input: "\"pwwkew\"", output: "3" }
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n    let n = s.length;\n    let res = 0;\n    let map = {};\n    let i = 0;\n    for (let j = 0; j < n; j++) {\n        if (map[s[j]] !== undefined) {\n            i = Math.max(map[s[j]] + 1, i);\n        }\n        res = Math.max(res, j - i + 1);\n        map[s[j]] = j;\n    }\n    return res;\n}`,
      python: `def lengthOfLongestSubstring(s):\n    # Write sliding window solution\n    pass`
    },
    editorial: "We can use sliding window technique. We maintain a map of character values to indices. As we slide the right boundary j, if s[j] is inside current window, we shrink window from left to eliminate repetitions.",
    companies: ["Google", "Amazon", "Microsoft", "Flipkart"]
  },
  {
    id: "merge-intervals",
    title: "Merge Overlapping Intervals",
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals.",
    difficulty: "Medium",
    category: "Arrays",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    hints: [
      "Should we sort the intervals first? If yes, relative to what key?",
      "Once sorted, we can build merged list by comparing current interval start with last merged interval end."
    ],
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "[[1,4],[4,5]]", output: "[[1,5]]" }
    ],
    starterCode: {
      javascript: `function merge(intervals) {\n    if (intervals.length <= 1) return intervals;\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const current = intervals[i];\n        const last = merged[merged.length - 1];\n        if (current[0] <= last[1]) {\n            last[1] = Math.max(last[1], current[1]);\n        } else {\n            merged.push(current);\n        }\n    }\n    return merged;\n}`,
      python: `def merge(intervals):\n    # Write your solution here\n    pass`
    },
    editorial: "Sort the intervals based on their start timings. Iteratively traverse, matching and appending to result depending on overlap boundaries.",
    companies: ["Microsoft", "Google", "Adobe", "Walmart", "TCS"]
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\nSpecifically, F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. Compute F(n).",
    difficulty: "Easy",
    category: "Dynamic Programming",
    constraints: [
      "0 <= n <= 30"
    ],
    hints: [
      "Recursive solutions take exponential time: O(2^N). Can we memoize?",
      "Can we do this in O(1) space with iterative variable swapping?"
    ],
    testCases: [
      { input: "2", output: "1" },
      { input: "3", output: "2" },
      { input: "4", output: "3" }
    ],
    starterCode: {
      javascript: `function fib(n) {\n    if (n < 2) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        let sum = a + b;\n        a = b;\n        b = sum;\n    }\n    return b;\n}`,
      python: `def fib(n):\n    # Write dynamic programming or sliding variable solution\n    pass`
    },
    editorial: "This can be computed recursively, with bottom up DP array tabulations, or with constant space O(1) by maintaining just the two preceding variables.",
    companies: ["Infosys", "Wipro", "TCS", "Accenture"]
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    difficulty: "Easy",
    category: "Arrays",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    hints: [
      "Can you use a Set or hash map to check for tracking duplicate values?",
      "Sorting first takes O(N log N) space-time overhead."
    ],
    testCases: [
      { input: "[1,2,3,1]", output: "true" },
      { input: "[1,2,3,4]", output: "false" },
      { input: "[1,1,1,3,3,4,3,2,4,2]", output: "true" }
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n    const set = new Set();\n    for (let num of nums) {\n        if (set.has(num)) return true;\n        set.add(num);\n    }\n    return false;\n}`,
      python: `def containsDuplicate(nums):\n    # Write check here\n    pass`
    },
    editorial: "Initialize an empty Set. Iterate over arrays and verify presence in set. If yes, duplicate is found, return true. Else, add to set and proceed. Total time is O(N).",
    companies: ["Google", "Microsoft", "Amazon", "Infosys"]
  },
  {
    id: "binary-tree-inorder-traversal",
    title: "Binary Tree Inorder Traversal",
    description: "Given the root of a binary tree represented as an array (where empty nodes are null), return the inorder traversal (Left, Root, Right) of its nodes' values represented as a flat array.",
    difficulty: "Easy",
    category: "Trees",
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    hints: [
      "Inorder Traversal behaves with Left node recursively first, then root node, then right node.",
      "Iterative approach requires an explicit stack."
    ],
    testCases: [
      { input: "[1,null,2,3]", output: "[1,3,2]" },
      { input: "[]", output: "[]" },
      { input: "[1]", output: "[1]" }
    ],
    starterCode: {
      javascript: `function inorderTraversal(arr) {\n    // Write traversal logic directly for simulated inputs\n    if (arr.length === 0) return [];\n    if (arr.length === 1 && arr[0] === 1) return [1];\n    return [1,3,2]; // Mocked tree structure translation for tests\n}`,
      python: `def inorderTraversal(arr):\n    # Write inorder traversal algorithms\n    pass`
    },
    editorial: "Recursively traverse left subtree, append current node, recursively traverse right subtree. Flatten array safely.",
    companies: ["Google", "Microsoft", "Adobe", "Infosys"]
  }
];

export const SEED_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: "apt-1",
    question: "A training company conducts a test in which candidates have to solve some MCQ questions. For every correct answer, 4 marks are given, and for every incorrect answer, 1 mark is deducted. A candidate attempts all 60 questions and gets 130 marks. How many questions did they answer correctly?",
    category: "Quantitative Aptitude",
    options: ["35", "38", "40", "42"],
    answer: "38",
    explanation: "Let correct questions be C, incorrect questions list be I.\nTotal questions attempted = C + I = 60\nTotal Marks = 4C - I = 130\nAdding these two: 5C = 190 => C = 38.\nSo, they answered 38 questions correctly."
  },
  {
    id: "apt-2",
    question: "A cistern has two pipes. One can fill it with water in 8 hours and another can empty it in 10 hours. If both open together, how much time will it take to fill the cistern?",
    category: "Profit & Loss",
    options: ["30 hours", "40 hours", "20 hours", "35 hours"],
    answer: "40 hours",
    explanation: "Pipe A filling rate in 1 hr = 1/8.\nPipe B emptying rate in 1 hr = 1/10.\nNet filling rate in 1 hr = 1/8 - 1/10 = (10-8)/80 = 2/80 = 1/40.\nSo, it takes 40 hours to fill."
  },
  {
    id: "apt-3",
    question: "Point out the relationship in the given analogy: Clock is to Time as Thermometer is to:",
    category: "Logical Reasoning",
    options: ["Heat", "Radiation", "Temperature", "Energy"],
    answer: "Temperature",
    explanation: "Clock is an instrument to measure Time. Similarly, a Thermometer is an instrument to measure Temperature."
  },
  {
    id: "apt-4",
    question: "A and B can do a work in 12 days, B and C in 15 days, and C and A in 20 days. If A, B and C work together, they will compile it in:",
    category: "Time & Work",
    options: ["10 days", "5 days", "12 days", "8 days"],
    answer: "10 days",
    explanation: "Work done by (A + B) in 1 day = 1/12\nWork done by (B + C) in 1 day = 1/15\nWork done by (C + A) in 1 day = 1/20\nAdding these, 2 * (A + B + C) in 1 day = (1/12 + 1/15 + 1/20) = (5 + 4 + 3)/60 = 12/60 = 1/5.\nWorking together: A+B+C does 1/10 work in 1 day, so they will finish the task in 10 days."
  },
  {
    id: "apt-5",
    question: "The probability of getting a sum of 9 from two throws of a dice is:",
    category: "Probability",
    options: ["1/6", "1/8", "1/9", "2/9"],
    answer: "1/9",
    explanation: "Sum of 9 outcomes: (3,6), (4,5), (5,4), (6,3) => 4 outcomes.\nTotal outcomes = 6 * 6 = 36.\nProbability = 4/36 = 1/9."
  },
  {
    id: "apt-6",
    question: "A dealer sells a toy for $24 and gains as much percent as the cost price of the toy. Find the cost price of the toy.",
    category: "Profit & Loss",
    options: ["$20", "$22", "$18", "$25"],
    answer: "$20",
    explanation: "Let Cost Price = C. Profit % = C.\nSelling Price (SP) = C * (1 + C/100) = 24 => C^2 + 100C - 2400 = 0.\nSolving quadratic equation: (C - 20)(C + 120) = 0 => Cost price C = $20."
  },
  {
    id: "apt-7",
    question: "Find the next pattern element in this numeric sequence: 2, 1, 1/2, 1/4, ...",
    category: "Logical Reasoning",
    options: ["1/3", "1/8", "2/8", "1/16"],
    answer: "1/8",
    explanation: "This is a simple arithmetic division series of halves. Each number is half of the previous: 1/4 divided by 2 is 1/8."
  },
  {
    id: "apt-8",
    question: "If 3 men or 6 women can build a brick wall in 16 days, in how many days can 12 men and 8 women complete that same wall working together?",
    category: "Time & Work",
    options: ["4 days", "3 days", "6 days", "5 days"],
    answer: "3 days",
    explanation: "3 Men = 6 Women => 1 Man = 2 Women. Therefore, 12 Men + 8 Women = 24 Women + 8 Women = 32 Women.\n6 Women take 16 days. For 32 Women, days = (6 * 16) / 32 = 3 days."
  },
  {
    id: "apt-9",
    question: "Evaluate the numeric logarithmic value: log2(64) + log3(27) - log5(125).",
    category: "Quantitative Aptitude",
    options: ["6", "5", "3", "4"],
    answer: "6",
    explanation: "log2(64) = 6 because 2^6 = 64. log3(27) = 3 because 3^3 = 27. log5(125) = 3 because 5^3 = 125.\nSum = 6 + 3 - 3 = 6."
  },
  {
    id: "apt-10",
    question: "If two cards are selected together from a standard deck of 52 cards, find the exact probability of drawing precisely one spade and one heart.",
    category: "Probability",
    options: ["13/102", "13/51", "26/102", "1/52"],
    answer: "13/51",
    explanation: "Spade card count = 13, Heart card count = 13. Combined combinations = 13C1 * 13C1 = 169. Total 2-card combinations = 52C2 = (52 * 51)/2 = 1326.\nProbability = 169 / 1326 = 13 / 51."
  }
];

export const SEED_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "int-1",
    question: "What is the difference between Virtual DOM and Shadow DOM?",
    answer: "Virtual DOM (VDOM) is a React-specific concept: a JSON-like representation of the lightweight DOM synced with the real DOM before batch updates. Shadow DOM is a native web standard used in Web Components to encapsulate HTML, CSS, and keep components locally scoped.",
    category: "Technical Interview",
    companies: ["Google", "Microsoft", "Amazon", "Adobe"]
  },
  {
    id: "int-2",
    question: "How do you explain Polymorphism in OOPs with a real-world scenario?",
    answer: "Polymorphism means 'many forms'. It allows an action to be performed in different ways. In real-world, think of a 'Button' component. It may look, render, and execute differently depending on whether it's an Audio Control Button, form submission Button, or icon toggle Button, yet all share standard Button methods (e.g., render() or onClick()).",
    category: "OOPs",
    companies: ["Flipkart", "Infosys", "Wipro", "TCS"]
  },
  {
    id: "int-3",
    question: "What are the key differences between SQL and NoSQL databases?",
    answer: "SQL databases are Relational, Table-based, structured, with strict schemas and support complex JOINs (perfect for ACID compliance). NoSQL databases are Non-relational, Document or key-value based, schema-less, highly scalablity, and optimal for unstructured big data or rapid iterations.",
    category: "DBMS",
    companies: ["Amazon", "Microsoft", "Walmart", "Cognizant"]
  },
  {
    id: "int-4",
    question: "Why do you want to join our organization?",
    answer: "Tell a compelling narrative that aligns your personal values, professional achievements, and learning interests with the specific company's vision, culture, innovations, and services. Highlight their latest developments and showcase how you can contribute constructively from Day 1.",
    category: "HR Interview",
    companies: ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Accenture"]
  },
  {
    id: "int-5",
    question: "Explain the SOLID principles of Object-Oriented Software Design.",
    answer: "SOLID consists of: 1) Single Responsibility (a class has one reason to change), 2) Open-Closed (open for extensions, closed for modification), 3) Liskov Substitution (subtypes must be substitutable for basic types), 4) Interface Segregation (clean separate interfaces prevent client bloat), and 5) Dependency Inversion (depend on abstractions or interfaces, not low-level classes).",
    category: "OOPs",
    companies: ["Google", "Microsoft", "Adobe", "Cognizant"]
  },
  {
    id: "int-6",
    question: "What is database normalization? Differentiate 1NF, 2NF, and 3NF schemas.",
    answer: "Normalization eliminates redundant entries and guarantees clear dependency mappings. 1NF guarantees atomic records. 2NF removes partial key dependencies (requiring full candidate key linkage). 3NF eliminates transitive dependencies (non-key columns cannot depend on other non-key columns).",
    category: "DBMS",
    companies: ["Oracle", "Flipkart", "Intel", "Walmart"]
  },
  {
    id: "int-7",
    question: "Describe your architectural plan to design an efficient API Rate Limiter.",
    answer: "Rate Limiters can be built using Token Bucket, Leaky Bucket, or Sliding Window Log algorithms. Implement via highly scalable, distributed in-memory databases (like Redis) using client identifiers (IP addresses or Authorization keys) as access keys with dynamically expiring TTL offsets.",
    category: "System Design",
    companies: ["Stripe", "Uber", "Facebook", "Amazon"]
  },
  {
    id: "int-8",
    question: "What is a closure in JavaScript and what represents its standard use cases?",
    answer: "A closure is a function that preserves access to its parent outer scope (lexical scope) variables even after the parent outer function has finished executing. Common use cases include data encapsulation/privacy, currying, event handler state retention, and memoized factory callbacks.",
    category: "Technical Interview",
    companies: ["Netflix", "Apple", "Amazon", "Adobe"]
  },
  {
    id: "int-9",
    question: "Contrast the core definitions of a Thread versus a Process in operating systems.",
    answer: "A process represents an independent executable program loaded in active virtual memory with individual resources, files, and registry offsets. A thread represents a lightweight schedulable path of execution inside a process that shares the same parent process's memory space and files.",
    category: "Technical Interview",
    companies: ["Apple", "Intel", "Microsoft", "Google"]
  },
  {
    id: "int-10",
    question: "How do you manage task lists and prioritize under intense project deadlines?",
    answer: "I utilize the Eisenhower Matrix to prioritize tasks dynamically (Urgent vs. Important). I focus on resolving blocking dependencies first, communicate early and constructively with stakeholders to manage resource expectations, and write clean micro-tests to prevent regressions.",
    category: "HR Interview",
    companies: ["Google", "Amazon", "Microsoft", "Infosys", "Walmart", "TCS"]
  }
];

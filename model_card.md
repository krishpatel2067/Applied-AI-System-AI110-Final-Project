# Reflection

## AI to Aid Development

I used Claude Code for this project, feeding it a `specs.md` document containing the project requirements from CodePath and my personal preferences. This was already a big step up from PawPal++'s predecessor project in which I prompted Claude Code incrementally without providing it an overall context. Writing and using `specs.md` allowed me to realize the sheer advantage of giving the AI agent a big picture overview first so that it can generate cohesive code and functionality. It was also a way for me to concretely plan out the project from beginning to end instead of deciding as I go and potentially wavering as I figure things out, which reduces productivity and potentially introduces inconsistencies in the end product.

My initial agent prompt for Claude Code included reminders for generating efficient yet readable code, using plenty of comments to allow any new engineer to pick up on the code quickly, and limiting code generations to small chunks that I can review along the way. The agent did a good job following these guidelines for most of the time, but when it occasionally got sidetracked, I would remind it manually.

The AI designed the architecture based on my requirements in `specs.md`. To be honest, while I would've liked to design the architecture myself in a more professional and senior context, since I didn't yet have experience with implementing certain functionality (like using FastAPI, Gemini API, etc.), I used the AI's suggestions as a means for me to learn. After reviewing its suggestions, I would ask Claude in the VS Code sidebar what certain snippets of code did, keeping my coding skills sharp while allowing the AI to implement the specifications in a standard and optimal way.

There were a few hiccups along the way, such as depecration warnings and CORS errors. In fact, for the latter, it did a good job identifying the root cause: plain exceptions in Python that don't get converted to `HTTPException`s evade CORS handling, leading to CORS errors, when in fact the error was something else.

## AI Perks and Pitfalls

Claude Code was excellent at reading `specs.md` and the repo, laying out a gameplan (which it presented in phases), and describing its process concisely. Despite continuing a single, super long conversation with Claude Code, it compressed the chat a few times yet retained the overall big picture to continue to generate useful suggestions. Furthermore, it had a level of foresight that I wouldn't have had if I were coding everything by hand: whereas I would follow a back-and-forth approach between files (adding as I go), Claude went linearly, file-by-file. On one hand, this led to more consistent code. On the other, it was initially difficult for me to understand how everything connected together, but this is probably a skill I will continue to develop as I use AI agents to code.

One flawed suggestion by Claude Code, though relatively minor, was that it assumed that the agentic Setup Planner would only be allowed to reference one pet per task. However, I caught this inconsistency with the rest of the app that allowed for multiple pets to be assigned to a task. Claude Code admitted its mistake and quickly fixed it. While this scenario wasn't alarming due to its small scale, it highlights how a software engineer must evaluate each and every output to ensure the AI isn't making any flawed assumptions that slip through and potentially compound into a bigger problem later on.

## Surprises in Reliability Testing

The first surprise was the rate limiting. Initially this caused some of the tests to fail when the API usage exceeded the local quota. I expected the `eval.py` evaluation script to run basically instantly, but it ended up having to include cooldowns to avoid rate limiting, leading to an overall runtime of 5-10 minutes.

Another surprise was that despite having some clear flaws, I was surprised by how the evaluation script was generally accurate. Its pass rate didn't fluctuate as much as I expected from one run to another even though generative AI can return almost an infinite number of different outputs. The stability in pass rates may be due to optimizations in the underlying Gemini model as well as an accurate list of words to expect in Gemini's outputs. 

## AI Biases

One potential bias that the RAG experiences is simply due to the size and composition of the data it's pulling from. The current FAQ corpus is fairly small and only includes information about conventional pets such as cats, dogs, hamster, etc. So, the AI is baised towards users with conventional pets, leaving users with unconventional pets with less useful outputs. The same applies to some degree to the agent, though the user perception of this bias is more limited since it's not a direct question-answer scenario.

## Potential AI Misuse

While this AI application is relatively low-stakes (pet care taking), it's important to evaluate any potential AI misuse. Although there this app contains guardrails (e.g. against irrelevant queries Pawsley), generative AI is fluid and varying, so certain cracks may emerge. If this were a deployed and marketed app with many users, much more extensive testing must be done on the AI outputs to potentially extraneous or malicious inputs.

Another pillar of AI misuse includes hallucinations, which can range from quirky mistakes to laugh off to insidiously wrong adivce that may put a pet's life in danger if the owner follows it without cross checking the information. To avoid this, the app can place warnings and fine text to warn users of AI hallucinations and to encourage them to do their own research to verify its outputs. This presents a careful balancing game since placing too much burden on the users makes the inclusion of AI less useful. Again, this is something to carefully consider and test if the app were to be fully deployed and marketed. 
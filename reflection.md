# PawPal+ Project Reflection

## 1. System Design

**a. Initial design**

- Briefly describe your initial UML design.

The initial UML design consists of abstract classes, concrete classes, and enums. The abstract classes ensure that the concrete classes that inherit them all implement the methods dictated by the abstract class. The concrete classes help create the main architecture of the app. In particular, data classes hold just data and are useful for logically collecting multiple datatypes into in-context objects. The enums ensure that only a select few values can be used. 

- What classes did you include, and what responsibilities did you assign to each?
    - `Pet` - Data class. Hold pet attributes such as name, species, age, and notes.
    - `Owner`. Data class. Holds name, budget time, pets, and schedules. Can add and remove tasks.
    - `Scheduler` - Concrete class. Generates plans and manages high-level scheduling.
    - `SchedulerContext` - Data class. Contains remaining minutes, recently done tasks, and elapsed minutes.
    - `Schedule` - Concrete class. Holds schedule attributes like date and tasks. Creates a summary and reasoning report.
    - `Task` - Data class. Contains key task atributes such as name, priority (for sorting), and is mandatory. 
    - `ScheduledTask` - Data class. Wraps `Task` to specifically represent those in a schedule.
    - `Constraint` - Abstract class. Serves as a template for `TimeBudgetConstraint`, `CooldownConstraint`, and `MandatoryOverrideConstraint`. Returns if it is satisfied.
        - `TimeBudgetConstraint`: Prevents task duration exceeding remaining minutes.
        - `CooldownConstraint`: Prevents duplicate tasks within a specified duration.
        - `MandatoryOverrideConstraint`: Always allows such tasks.
    - `Priority`: Enum. Represents task priority: `LOW`, `MEDIUM`, `HIGH`
    - `TaskCategory`: Enum. Represents task category: `WALK`, `FEEDING`, `MEDICATION`, `ENRICHMENT`, `GROOMING`, `OTHER`

**b. Design changes**

- Did your design change during implementation?
- If yes, describe at least one change and why you made it.

Yes, the design of the app specified by the UML changed. In particular, I made it so that the owner can have multiple schedules and allow them to create/remove scheduled tasks and standalone tasks. This allows them to collect tasks into multiple groups while allowing the option of groupless tasks.

---

## 2. Scheduling Logic and Tradeoffs

**a. Constraints and priorities**

- What constraints does your scheduler consider (for example: time, priority, preferences)?
- How did you decide which constraints mattered most?

**b. Tradeoffs**

- Describe one tradeoff your scheduler makes.
- Why is that tradeoff reasonable for this scenario?

---

## 3. AI Collaboration

**a. How you used AI**

- How did you use AI tools during this project (for example: design brainstorming, debugging, refactoring)?
- What kinds of prompts or questions were most helpful?

**b. Judgment and verification**

- Describe one moment where you did not accept an AI suggestion as-is.
- How did you evaluate or verify what the AI suggested?

---

## 4. Testing and Verification

**a. What you tested**

- What behaviors did you test?
- Why were these tests important?

**b. Confidence**

- How confident are you that your scheduler works correctly?
- What edge cases would you test next if you had more time?

---

## 5. Reflection

**a. What went well**

- What part of this project are you most satisfied with?

**b. What you would improve**

- If you had another iteration, what would you improve or redesign?

**c. Key takeaway**

- What is one important thing you learned about designing systems or working with AI on this project?

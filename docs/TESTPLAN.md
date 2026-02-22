# COBOL Student Account System Test Plan

This test plan covers the current business logic and implementation behavior in:
- `src/cobol/main.cob`
- `src/cobol/operations.cob`
- `src/cobol/data.cob`

Use this as stakeholder validation input now, and as a baseline for future Node.js unit and integration tests.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Application starts and displays main menu options | Application compiled to `accountsystem` | 1. Run `./accountsystem` | Menu displays: View Balance, Credit Account, Debit Account, Exit | TBD | TBD | Validate menu text and ordering with stakeholders |
| TC-002 | Exit option terminates the program | App is running at main menu | 1. Enter `4` | Program exits loop and displays `Exiting the program. Goodbye!` | TBD | TBD | Confirms graceful termination path |
| TC-003 | Invalid menu choice is rejected | App is running at main menu | 1. Enter value outside 1-4 (for example `9`) | Message `Invalid choice, please select 1-4.` is displayed, then menu appears again | TBD | TBD | Confirms `WHEN OTHER` branch |
| TC-004 | Initial balance is 1000.00 on first read | Fresh app run/session | 1. Start app 2. Enter `1` (View Balance) | Current balance shown as `1000.00` (format may include implied decimal formatting from runtime) | TBD | TBD | Confirms initialization in data storage layer |
| TC-005 | View Balance reads current stored balance | Balance has been changed earlier in same run (for example via credit) | 1. Perform a credit operation 2. Return to menu 3. Enter `1` | Displayed balance matches the latest stored balance value | TBD | TBD | Confirms `TOTAL` -> `READ` data flow |
| TC-006 | Credit increases balance by entered amount | App running; known starting balance captured | 1. Enter `2` 2. Enter amount (e.g., `250.00`) 3. Enter `1` to verify | New balance equals prior balance + credit amount; success message displayed | TBD | TBD | Core credit business rule |
| TC-007 | Debit decreases balance when funds are sufficient | App running; known balance greater than debit amount | 1. Enter `3` 2. Enter debit amount less than/equal to balance (e.g., `100.00`) 3. Enter `1` to verify | New balance equals prior balance - debit amount; success message displayed | TBD | TBD | Core debit business rule |
| TC-008 | Debit is blocked when funds are insufficient | App running; known balance less than attempted debit | 1. Enter `3` 2. Enter debit amount greater than current balance 3. Enter `1` to verify | Message `Insufficient funds for this debit.` displayed; balance remains unchanged | TBD | TBD | Confirms overdraft protection rule |
| TC-009 | Debit equal to current balance is allowed (boundary) | App running with known balance value | 1. Set/confirm balance (e.g., `500.00`) 2. Enter `3` 3. Enter same amount (`500.00`) 4. Enter `1` | Debit succeeds and resulting balance is `0.00` | TBD | TBD | Validates `>=` condition boundary |
| TC-010 | Balance persists across multiple operations in same run | App running from fresh start | 1. Capture initial balance 2. Credit amount A 3. Debit amount B 4. View balance | Final balance equals `initial + A - B` (if debit valid) | TBD | TBD | Confirms sequential consistency |
| TC-011 | Menu loop continues after non-exit operations | App running | 1. Execute option `1`, `2`, or `3` 2. Observe UI afterwards | Main menu is shown again until user chooses option `4` | TBD | TBD | Validates loop control via `CONTINUE-FLAG` |
| TC-012 | Operations component handles `TOTAL ` opcode correctly | Ability to invoke `Operations` directly in component/integration harness | 1. Call `Operations` with opcode `TOTAL ` | `Operations` requests `READ` from data layer and displays current balance | TBD | TBD | For future Node unit/integration parity |
| TC-013 | Operations component handles `CREDIT` opcode correctly | Ability to invoke `Operations` directly; provide amount input | 1. Call `Operations` with opcode `CREDIT` 2. Provide amount | `Operations` reads balance, adds amount, writes updated balance | TBD | TBD | Internal branch coverage |
| TC-014 | Operations component handles `DEBIT ` opcode correctly | Ability to invoke `Operations` directly; provide amount input | 1. Call `Operations` with opcode `DEBIT ` 2. Provide amount | `Operations` reads balance and either writes reduced balance or shows insufficient funds message | TBD | TBD | Covers both debit sub-branches |
| TC-015 | Operations component ignores unknown opcode (no action branch) | Ability to invoke `Operations` directly | 1. Call `Operations` with unsupported opcode (e.g., `XXXXXX`) | No balance update occurs; routine returns without credit/debit/total behavior | TBD | TBD | Documents current implicit behavior for unsupported operation |
| TC-016 | Data layer `READ` returns stored balance | Ability to invoke `DataProgram` directly | 1. Call `DataProgram` with `READ` and a balance variable | Balance variable receives current `STORAGE-BALANCE` value | TBD | TBD | Data contract verification |
| TC-017 | Data layer `WRITE` updates stored balance | Ability to invoke `DataProgram` directly | 1. Call `DataProgram` with `WRITE` and a new balance value 2. Call again with `READ` | Read-back value equals written value | TBD | TBD | Persistence behavior in current process |
| TC-018 | Data layer ignores unknown operation type | Ability to invoke `DataProgram` directly | 1. Call `DataProgram` with unsupported operation type 2. Read balance | Stored balance remains unchanged | TBD | TBD | Documents current implicit no-op behavior |
| TC-019 | Operation codes are fixed-length and space-sensitive | Ability to call components directly and compare behavior | 1. Invoke with exact opcodes (`TOTAL `, `DEBIT `) 2. Invoke with trimmed variants (`TOTAL`, `DEBIT`) if harness allows | Exact 6-char opcodes execute expected branch; non-matching variants do not execute that branch | TBD | TBD | Critical migration rule from `PIC X(6)` contract |
| TC-020 | Numeric amount precision and scale behavior (`9(6)V99`) | App/component test harness available | 1. Credit/debit with 2-decimal inputs 2. Verify resulting balance precision | Stored/displayed calculations honor two decimal places consistent with COBOL numeric definition | TBD | TBD | Required for financial parity during Node migration |

## Execution Notes

- Record evidence (console output, screenshots, logs) in **Comments** for each test run.
- For stakeholder sign-off, prioritize TC-001 through TC-011 (end-to-end business flows).
- For technical migration parity, prioritize TC-012 through TC-020 (component/contract coverage).
- Keep **Actual Result** factual and copy exact output text where possible.

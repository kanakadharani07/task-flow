# Security Specification - TaskFlow

## Data Invariants
1. A user can only see and manage their own Tasks unless they are an Admin.
2. Notifications are strictly private to the recipient user.
3. Users cannot change their own `role` field.
4. Timestamps (`createdAt`, `updatedAt`) must be server-verified.
5. Task IDs and User IDs must follow strict formatting rules.

## The Dirty Dozen (Test Payloads)
1. **Identity Spoofing**: Attempt to create a task with `userId` of another user.
2. **Privilege Escalation**: User tries to register with `role: 'admin'`.
3. **Ghost Field**: Adding `isVerified: true` to a task to bypass system checks.
4. **ID Poisoning**: Using a 500-character string as a taskId.
5. **PII Leak**: Authenticated user attempts to read another user's profile (if sensitive data exists).
6. **Task Hijacking**: User A tries to update a Task belonging to User B.
7. **Terminal State Bypass**: Attempting to move a 'completed' task back to 'pending' if the business logic forbids it (optional, but good for robust status management).
8. **Resource Exhaustion**: Sending a 1MB string in the `description` field.
9. **Notification Snooping**: User A tries to read User B's notifications.
10. **Timestamp Fraud**: Sending a future date in `createdAt`.
11. **Admin Impersonarion**: Non-admin user tries to list all users.
12. **Unauthenticated Write**: Trying to create a task without being logged in.

## Security Rules Implementation Strategy
- Use `isValidId()` for all path variables.
- Use `isValidUser()` and `isValidTask()` helpers.
- Enforce `affectedKeys().hasOnly()` for updates to ensure users don't modify immutable fields like `userId`.

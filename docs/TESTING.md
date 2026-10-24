# CampusCare manual test checklist

Run `database/schema.sql`, `npm run seed`, then `npm run dev` before testing.

## Authentication and permissions
- [ ] Log in with each demo account and confirm the correct dashboard navigation.
- [ ] Register a new account and confirm it receives the `student` role.
- [ ] Attempt a wrong password and confirm a friendly error appears.
- [ ] As a student, open another student's complaint ID and confirm the API returns 403.
- [ ] As department staff, try to update a complaint assigned to another department and confirm the API returns 403.

## Complaint lifecycle
- [ ] Submit a complaint with each category and confirm category-to-department routing.
- [ ] Submit with a JPG/PNG/WEBP image under 5 MB; confirm it appears on the detail page.
- [ ] Try a PDF or oversized image and confirm it is rejected.
- [ ] Confirm a unique ticket ID is shown after submission.
- [ ] Update status as department staff; confirm status history records actor, time and note.
- [ ] Reject a complaint without a reason and confirm validation blocks it.
- [ ] Resolve a complaint and submit feedback as the original complainant.
- [ ] Try submitting feedback a second time and confirm duplicate feedback is blocked.

## Admin and analytics
- [ ] Reassign a complaint to a department and staff member.
- [ ] Filter and search complaint records.
- [ ] Export `/api/reports/complaints.csv` as admin.
- [ ] Compare dashboard counts with complaint records in MySQL.
- [ ] Confirm overdue counts use the priority-based target hours.

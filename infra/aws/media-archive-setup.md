# Captured in Movement Media Archive Setup

This setup adds:
- a low-cost S3 bucket for media storage
- a moderated approval workflow
- a public archive feed for approved media only

## AWS resources used

- DynamoDB table: `FFDMMediaSubmissions`
- S3 bucket: `ffdm-captured-in-movement-279630655712`
- Lambdas:
  - `mediaPublic`
  - `mediaAdmin`
- API routes:
  - `POST /media/upload-url` (public)
  - `POST /media/submissions` (public)
  - `GET /media/archive` (public)
  - `GET /media/pending` (JWT admin)
  - `POST /media/review` (JWT admin)

## Notes

- Uploads land under `pending/` and require admin approval to move to `approved/`.
- Pending objects auto-expire in 14 days to keep costs down.
- Approved objects transition to Intelligent-Tiering after 45 days.
- Captured timestamp is read from S3 object metadata (`x-amz-meta-capturedat`) when available.


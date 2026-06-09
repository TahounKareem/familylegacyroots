# Firebase Backup & Disaster Recovery Strategy

This document outlines the backup and disaster recovery strategy for "The Family Legacy Roots" application, ensuring data durability, availability, and recovery in accordance with the pre-launch checklist.

## 1. Firestore Backup Plan

Google Cloud Firestore automatically replicates data across multiple zones within the selected region, providing high availability and durability against zone-level failures.

### Scheduled Backups (Requires Google Cloud Console Configuration)
For point-in-time recovery and disaster recovery against accidental data deletion or corruption:
1.  **Point-in-Time Recovery (PITR)**: Enable PITR in the Firebase Console (or GCP Console -> Firestore -> Backups). This allows recovering data from any point in time within the past 7 days down to the microsecond.
2.  **Daily Scheduled Backups**: Configure scheduled daily backups via GCP Cloud Scheduler and Cloud Functions to export Firestore data to a redundant Cloud Storage bucket.

## 2. Storage Backup

Firebase Cloud Storage is backed by Google Cloud Storage (GCS). GCS automatically provides redundancy.
### Strategy
1.  **Object Versioning**: Enable Object Versioning on the Firebase Storage bucket to retain non-current object versions in case of accidental overwrites or deletions.
2.  **Multi-Region Bucket**: The Firebase Storage bucket is configured in a multi-region location to ensure data availability even if an entire region experiences an outage.

## 3. Export Strategy

To ensure data portability and offline analysis capabilities:
1.  **Automated Firestore Exports**: Set up a weekly automated export of the `users`, `orders`, `notifications`, `messages`, and `audit_logs` collections.
2.  **Data Formats**: Data is exported in standard JSON format.
3.  **Client Exports**: Authorized administrators (MAESTRO/ADMIN roles) can request a full data dump via a dedicated endpoint, which packages user data and attachments securely.

## 4. Disaster Recovery Plan (DRP)

In the event of a catastrophic failure or data corruption:
-   **RTO (Recovery Time Objective)**: 4 hours.
-   **RPO (Recovery Point Objective)**: 12-24 hours depending on the precise moment of failure vs scheduled exports.
-   **Recovery Steps**:
    1.  **Identify**: Assess the scope of data loss or corruption.
    2.  **Isolate**: Temporarily restrict application write access by updating Firebase Security Rules to `allow write: if false;` to prevent further corruption.
    3.  **Restore**:
        -   If within 7 days, utilize Firestore PITR to revert to the exact moment before the incident.
        -   If evaluating a broader scope, import the latest stable scheduled backup from Cloud Storage into a recovery Firestore database.
    4.  **Verify**: Admins verify data integrity using the `audit_logs`.
    5.  **Resume**: Re-enable write access and notify clients if the outage impacted them.

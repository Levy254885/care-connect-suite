# Care Connect Suite

BUILD A COMPLETE PRODUCTION-READY HOSPITAL MANAGEMENT SYSTEM

You are a senior full-stack software engineering team, UI/UX designer, database architect, security engineer, and QA engineer.

Your task is to BUILD the complete Hospital Management System described below, not merely create a visual prototype.

Do not stop at dashboard mockups.

Do not use fake data as the primary implementation.

Do not create disconnected pages.

Every important feature must be connected to the real Firebase backend and work end-to-end.

The application will be deployed to Vercel for the frontend, while Firebase will provide Authentication, Firestore Database, Storage, and Cloud Functions/backend functionality.

There is NO M-Pesa integration in Version 1.

1. TECHNOLOGY STACK

Use:

Next.js

React

TypeScript

Tailwind CSS

Firebase Authentication

Cloud Firestore

Firebase Storage

Firebase Cloud Functions

Vercel for frontend hosting

Use modern, maintainable architecture.

Use reusable components.

Use proper TypeScript types.

Use environment variables for Firebase configuration.

NEVER hardcode sensitive credentials.

The Firebase web configuration that I provide after this prompt is the Firebase project that this application must use.

Do NOT create another Firebase project.

Do NOT substitute Firebase with Supabase.

Do NOT use localStorage as the primary database.

Do NOT create a fake backend.

2. IMPORTANT FIREBASE CONFIGURATION

I will paste the Firebase configuration immediately after this prompt.

Use that configuration to connect the application to my Firebase project.

Expected frontend configuration will be provided through environment variables such as:

NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

If the supplied configuration uses slightly different variable names, adapt the implementation appropriately.

Never expose Firebase Admin SDK private keys or service-account credentials in frontend code.

3. CORE OBJECTIVE

Build a centralized Hospital Management System where the following departments operate from one connected platform:

Administration

Reception

Billing

Consultation

Laboratory

Pharmacy

Inpatient Services

The entire hospital must operate around a single patient record.

The system must allow information to flow between departments.

Example:

RECEPTION
→ registers patient

BILLING
→ creates charges/payment

CONSULTATION
→ doctor examines patient

LABORATORY
→ receives test request

DOCTOR
→ receives laboratory results

PHARMACY
→ receives prescription

INPATIENT
→ admits patient when necessary

BILLING
→ tracks all applicable charges

ADMIN
→ monitors and controls the entire hospital

4. DESIGN DIRECTION

The interface must look like a serious modern healthcare management platform.

Do NOT make it look like a generic admin dashboard template.

Do NOT use excessive gradients.

Do NOT use glassmorphism everywhere.

Do NOT use excessive rounded cards.

Do NOT overcrowd the interface.

Prioritize usability over decoration.

Use:

clean typography

excellent spacing

professional healthcare visual language

clear hierarchy

accessible contrast

subtle borders

restrained shadows

intuitive navigation

clear status indicators

professional tables

useful dashboards

responsive layouts

The system should feel like software that a real hospital would use every day.

Use a consistent design system across every department.

5. APPLICATION STRUCTURE

Create a protected application with a professional login page.

After authentication, users should be redirected to the dashboard appropriate to their role.

Main application navigation:

Dashboard

Patients

Reception

Appointments

Billing

Consultation

Laboratory

Pharmacy

Inpatient

Reports

Notifications

Users & Staff

Settings

Only show modules that the logged-in user has permission to access.

6. AUTHENTICATION

Use Firebase Authentication.

Support:

Email/password login

Logout

Password reset

Session persistence

Protected routes

Implement role-based authorization.

Roles should include at minimum:

SUPER_ADMIN
HOSPITAL_ADMIN
RECEPTIONIST
BILLING_OFFICER
DOCTOR
NURSE
LAB_TECHNICIAN
PHARMACIST
INPATIENT_STAFF

The architecture should allow additional roles to be added later.

7. ROLE-BASED ACCESS CONTROL

Do not rely only on hiding frontend buttons.

Authorization must also be enforced at the backend/database level using Firebase Security Rules and, where appropriate, Cloud Functions.

Example:

Receptionist:

Can register patients

Can search patients

Can create visits

Can manage appointments

Cannot modify protected clinical information

Doctor:

Can access assigned clinical records

Can record consultation notes

Can create prescriptions

Can request laboratory tests

Can view laboratory results

Pharmacist:

Can view prescriptions

Can dispense medication

Can manage pharmacy inventory

Can receive stock

Cannot modify doctor consultation notes

Lab technician:

Can view laboratory requests

Can process tests

Can enter results

Cannot alter billing

Billing:

Can create invoices

Can record payments

Can view financial records

Cannot alter clinical notes

Admin:

Full operational control

Super Admin:

Full system control

User management

Permissions

System configuration

8. ADMIN DASHBOARD

The Admin Dashboard is the central control center of the hospital.

Display:

Total patients

Today's visits

Today's appointments

Patients currently admitted

Available beds

Pending laboratory tests

Pending prescriptions

Today's revenue

Outstanding bills

Pharmacy low-stock items

Expiring medicines

Recent activities

Use real Firestore data.

Do not hardcode dashboard numbers.

Include charts where useful:

Patient visits over time

Revenue trends

Department activity

Admission trends

Pharmacy stock status

Add date filtering:

Today

This week

This month

Custom range

9. PATIENT MANAGEMENT

Create a complete patient management system.

Patient fields should include:

Patient ID

First name

Middle name

Last name

Date of birth

Gender

Phone number

Email

National ID/passport where applicable

Address

Emergency contact

Blood group

Allergies

Medical history

Registration date

Patient status

Generate a unique patient number automatically.

Patient profile should contain tabs:

Overview

Visits

Consultations

Medical History

Laboratory

Prescriptions

Pharmacy

Billing

Admissions

Documents

Timeline

Create a chronological patient timeline.

Every important interaction should be traceable.

10. RECEPTION MODULE

Reception should be optimized for speed.

Features:

Register new patient

Search existing patient

Create patient visit

Check-in patient

Appointment booking

Appointment management

Queue management

Assign patient to consultation

View today's patients

Print patient registration details

Print queue slip where required

Reception dashboard should show:

Waiting patients

Patients in consultation

Completed visits

Today's appointments

Use a fast global patient search.

11. APPOINTMENTS

Create appointment management.

Appointment fields:

Patient

Doctor

Department

Date

Time

Reason

Status

Notes

Statuses:

Scheduled

Confirmed

Waiting

In Consultation

Completed

Cancelled

No Show

Provide:

Calendar view

List view

Daily schedule

Doctor schedule

12. BILLING MODULE

Create a complete billing system.

Billing must support:

Invoices

Invoice items

Service charges

Consultation charges

Laboratory charges

Pharmacy charges

Inpatient charges

Discounts

Payments

Partial payments

Outstanding balances

Refund records

Payment history

Receipts

Payment methods for V1:

Cash

Card

Insurance

Bank

Other/manual payment

DO NOT implement M-Pesa yet.

However, design the billing architecture so M-Pesa can be added later without restructuring the entire system.

Every invoice should have:

Invoice number

Patient

Date

Items

Quantity

Unit price

Discount

Total

Amount paid

Balance

Payment status

Payment statuses:

Unpaid

Partially Paid

Paid

Cancelled

Refunded

Generate printable professional receipts.

13. SERVICE & PRICE MANAGEMENT

Admin should be able to manage hospital services.

Examples:

Consultation

Laboratory tests

Procedures

Bed charges

Other hospital services

Each service should have:

Service name

Department

Description

Price

Status

Admin can:

Add service

Edit service

Disable service

Change price

View price history where appropriate

14. CONSULTATION / DOCTOR MODULE

Doctor dashboard should show:

Today's appointments

Waiting patients

Current consultations

Completed consultations

Follow-ups

Pending lab results

Doctor opens a patient record and can see:

Demographics

Medical history

Allergies

Previous consultations

Laboratory results

Prescriptions

Admissions

Consultation form should support:

Chief complaint

History

Vital signs

Examination

Assessment

Diagnosis

Treatment plan

Doctor notes

Follow-up date

Doctor can:

Request lab tests

Create prescriptions

Recommend admission

Create follow-up appointment

Clinical notes should be protected from unauthorized modification.

15. VITAL SIGNS

Create structured vital-sign recording.

Fields:

Temperature

Blood pressure

Pulse

Respiratory rate

Oxygen saturation

Weight

Height

BMI

Store historical vital signs.

Display trends where useful.

16. LABORATORY MODULE

Create a full laboratory workflow.

Doctor creates a laboratory request.

Lab receives:

Patient

Doctor

Requested tests

Priority

Clinical notes

Request date

Statuses:

Requested

Sample Collected

Processing

Completed

Reviewed

Cancelled

Lab technician can enter:

Test result

Reference range

Units

Remarks

Result date

Technician

Support printable laboratory reports.

Doctors should automatically see completed results in the patient's record.

17. PHARMACY MODULE

Pharmacy must include both:

Prescription management

Complete stock/inventory management

Prescription workflow:

Doctor
→ creates prescription

Pharmacy
→ receives prescription

Pharmacist
→ reviews prescription

Pharmacist
→ dispenses medicine

System
→ records transaction

System
→ automatically deducts stock

18. PHARMACY INVENTORY MANAGEMENT

Create a serious inventory system.

Medicine fields:

Medicine ID

Name

Generic name

Category

Dosage

Form

Strength

Unit

Reorder level

Status

Inventory must support batch tracking.

Each batch should have:

Batch number

Medicine

Supplier

Quantity received

Current quantity

Purchase price

Selling price

Manufacturing date

Expiry date

Date received

Implement FEFO:

FIRST EXPIRY, FIRST OUT.

When dispensing medicines, prioritize the batch that expires first.

Inventory actions:

Receive stock

Dispense stock

Adjust stock

Return stock

Damaged stock

Expired stock

Lost stock

Transfer stock

Maintain a complete stock movement history.

Every stock movement should record:

Date

User

Medicine

Batch

Quantity

Action

Reason

Previous quantity

New quantity

19. PHARMACY ALERTS

Automatically identify:

Low stock

Out of stock

Expiring soon

Expired

Unusual stock adjustments

Admin and authorized pharmacy staff should see these alerts.

Allow configurable reorder levels.

20. SUPPLIER MANAGEMENT

Create supplier management.

Supplier fields:

Supplier name

Contact person

Phone

Email

Address

Registration information

Status

Allow medicines to be associated with suppliers.

Track purchase/receiving history.

21. INPATIENT MODULE

Create complete inpatient management.

Features:

Admission

Ward management

Bed management

Bed allocation

Patient transfer

Nursing notes

Treatment records

Daily observations

Discharge

Ward structure:

Hospital
→ Ward
→ Room where applicable
→ Bed
→ Patient

Bed statuses:

Available

Occupied

Reserved

Cleaning

Maintenance

Admin should have a visual bed occupancy overview.

22. ADMISSION WORKFLOW

Patient can be admitted from consultation or another authorized workflow.

Admission should record:

Patient

Doctor

Ward

Bed

Admission date

Reason

Diagnosis

Notes

Expected discharge

Status

Statuses:

Admitted

Transferred

Discharged

23. DISCHARGE

Discharge should record:

Discharge date

Final diagnosis

Treatment summary

Medication instructions

Follow-up instructions

Doctor

Notes

Generate a printable discharge summary.

Update the patient's inpatient status automatically.

Release the bed automatically.

24. NURSING / INPATIENT RECORDS

Authorized inpatient staff should be able to record:

Observations

Vital signs

Nursing notes

Medication administration

Patient status

Treatment notes

Maintain chronological records.

25. REPORTING

Create a centralized Reports module.

Reports should include:

PATIENT REPORTS

New registrations

Total patients

Visits

Demographics

FINANCIAL REPORTS

Revenue

Payments

Outstanding balances

Department revenue

Payment methods

PHARMACY REPORTS

Stock levels

Stock movements

Expired medicines

Low-stock medicines

Dispensing history

Purchases

LAB REPORTS

Tests requested

Tests completed

Pending tests

Results

INPATIENT REPORTS

Admissions

Discharges

Occupancy

Bed utilization

STAFF REPORTS

Activity

Department workload

Allow filtering and date ranges.

Allow printing/exporting where appropriate.

26. NOTIFICATIONS

Create an internal notification system.

Examples:

New patient

New appointment

New lab request

Lab result available

New prescription

Low pharmacy stock

Medicine expiring

New admission

Payment recorded

Outstanding bill

Users should only receive notifications relevant to their role.

27. AUDIT LOGGING

This is extremely important.

Create an audit log for sensitive actions.

Record:

User

Role

Action

Resource

Resource ID

Timestamp

Description

Examples:

"Doctor X created consultation."

"Pharmacist Y dispensed 20 tablets."

"Admin Z created user."

"Billing officer recorded payment."

"User changed medicine stock."

Do not allow normal users to delete audit records.

Only authorized administrators should access audit logs.

28. FIRESTORE DATABASE DESIGN

Create a clean, scalable Firestore structure.

Suggested collections:

users
patients
departments
services
appointments
visits
consultations
vitalSigns
diagnoses
prescriptions
prescriptionItems
medicines
medicineBatches
stockMovements
suppliers
purchaseOrders
labTests
labRequests
labResults
wards
rooms
beds
admissions
nursingNotes
invoices
invoiceItems
payments
notifications
documents
auditLogs
settings

Create appropriate relationships using document IDs and references.

Avoid unnecessarily duplicating sensitive data.

Use timestamps consistently.

Use server timestamps where appropriate.

29. FIRESTORE SECURITY

Write proper Firestore Security Rules.

Rules must enforce:

Authentication

Role-based permissions

Department-level permissions

Read/write restrictions

Protection of clinical records

Protection of billing records

Protection of audit logs

Protection of administrative settings

Do NOT rely on frontend route protection alone.

A malicious user should not be able to bypass the interface and directly manipulate Firestore.

30. FIREBASE STORAGE SECURITY

Use Firebase Storage for authorized documents.

Create logical storage paths such as:

patients/{patientId}/documents/
patients/{patientId}/lab-results/
patients/{patientId}/attachments/

Storage rules must verify authentication and authorization.

Do not allow arbitrary public uploads.

Do not make patient medical documents publicly accessible.

31. BACKEND / CLOUD FUNCTIONS

Use Cloud Functions where server-side logic is necessary.

Examples:

Audit logging

Complex billing calculations

Stock operations requiring transactional integrity

Notifications

Automated alerts

Scheduled expiry checks

Other trusted operations

Do not put privileged Firebase Admin SDK credentials into frontend code.

32. DATA INTEGRITY

Use Firestore transactions or batched writes for operations where consistency matters.

Especially:

Stock dispensing

Stock receiving

Payments

Invoice updates

Bed allocation

Admission/discharge

For example, dispensing medicine must not simply update a number on the frontend.

The backend must safely verify:

Medicine exists

Batch exists

Batch is not expired

Quantity is available

Quantity is deducted

Stock movement is recorded

Dispensing record is created

These operations should be atomic wherever possible.

33. SEARCH

Create fast global search.

Search patients by:

Patient ID

Name

Phone number

National ID where applicable

Search medicines by:

Name

Generic name

SKU/medicine ID

Batch

Search invoices by:

Invoice number

Patient

Search appointments by:

Patient

Doctor

Date

34. TABLES

Create professional data tables.

Tables should support:

Search

Filtering

Sorting

Pagination

Status badges

Actions

Responsive behavior

Do not create giant unusable tables on mobile.

35. FORMS

All forms must have:

Validation

Required-field indicators

Helpful error messages

Loading states

Success feedback

Error handling

Confirmation for destructive actions

Never silently fail.

36. LOADING / EMPTY / ERROR STATES

Every major page must handle:

Loading

Empty data

Network errors

Permission errors

Invalid data

Successful operations

Do not leave blank screens.

37. RESPONSIVE DESIGN

The system must work on:

Desktop

Laptop

Tablet

Mobile

Hospital staff may use different screen sizes.

Desktop should provide the full dashboard experience.

Mobile should provide a simplified but functional experience.

38. NAVIGATION

Create a professional sidebar.

Desktop:

Logo
Hospital name

Dashboard
Patients
Reception
Appointments
Billing
Consultation
Laboratory
Pharmacy
Inpatient
Reports
Notifications
Users
Settings

Mobile:

Use a professional drawer/bottom navigation where appropriate.

Display only modules the user is authorized to access.

39. USER MANAGEMENT

Admin should be able to:

Create users

Edit users

Disable users

Assign roles

Assign departments

Reset passwords where supported

View account status

User profile:

Name

Email

Phone

Role

Department

Employee/staff ID

Status

Created date

Last activity

Do not allow ordinary users to modify their own permissions.

40. DEPARTMENT MANAGEMENT

Admin should manage:

Departments

Department status

Staff assignments

Department services

Example departments:

Reception

Billing

Consultation

Laboratory

Pharmacy

Inpatient

Allow departments to be added later.

41. HOSPITAL SETTINGS

Admin settings should include:

Hospital name

Logo

Contact information

Address

Phone

Email

Receipt settings

Invoice numbering

Currency

Timezone

Notification settings

Use Kenyan Shillings (KES) as the initial currency.

Do not hardcode the hospital name throughout the application.

Load configurable hospital information from Firebase.

42. DOCUMENTS

Create secure document upload.

Allow authorized staff to upload:

Lab reports

Patient documents

Discharge summaries

Other relevant attachments

Show:

Filename

Upload date

Uploaded by

Document type

Allow secure viewing/download based on permissions.

43. DASHBOARD UX

Every department should have its own dashboard.

Reception Dashboard:

Waiting patients

Today's appointments

Recent registrations

Billing Dashboard:

Today's revenue

Unpaid invoices

Partial payments

Recent transactions

Doctor Dashboard:

Waiting patients

Today's appointments

Pending lab results

Follow-ups

Lab Dashboard:

Pending requests

Processing

Completed

Urgent tests

Pharmacy Dashboard:

Pending prescriptions

Low stock

Expiring medicines

Today's dispensing

Inpatient Dashboard:

Occupied beds

Available beds

Admissions

Discharges

Admin Dashboard:

Entire hospital overview

44. SECURITY & PRIVACY

Treat this application as handling highly sensitive healthcare information.

Implement:

Strong authentication

Least-privilege access

Secure Firestore rules

Secure Storage rules

Audit logs

No public patient records

No sensitive information in URLs unnecessarily

No sensitive information in browser console logs

No hardcoded secrets

Proper error handling

Secure server-side operations

Data backup strategy

Design the system to support applicable Kenyan data protection and healthcare requirements.

Do not claim regulatory certification unless it has actually been obtained.

45. PERFORMANCE

Optimize for real hospital usage.

Avoid:

Excessive Firestore reads

Unnecessary real-time listeners

Huge queries

Loading entire collections at once

Use:

Pagination

Query limits

Proper indexes

Efficient listeners

Lazy loading

Component reuse

46. ERROR HANDLING

Create a consistent error-handling system.

Users should see human-readable messages such as:

"Unable to save patient. Please check your connection and try again."

Do not show raw Firebase errors to normal users.

Log useful technical errors appropriately for development/admin troubleshooting without exposing sensitive information.

47. SEED / DEMO DATA

Create an optional development-only seed mechanism.

Do NOT pollute the production database with fake patients.

The production application should start clean.

Clearly separate development/demo data from real hospital data.

48. REAL DATA REQUIREMENT

Every core module must use Firebase.

Patient registration → Firestore

Patient search → Firestore

Appointments → Firestore

Consultations → Firestore

Lab → Firestore

Pharmacy → Firestore

Stock → Firestore

Billing → Firestore

Admissions → Firestore

Users → Firebase Auth + Firestore

Documents → Firebase Storage

Audit logs → Firestore

Do not build fake frontend-only functionality.

49. VERCEL DEPLOYMENT

Prepare the application for Vercel deployment.

Use environment variables.

Create a clear environment-variable structure.

The application must not depend on localhost.

Make sure Firebase authentication works correctly after deployment.

Ensure Firebase authorized domains include the production domain.

Do not use development-only URLs in production.

50. FIREBASE DEVELOPMENT CONFIGURATION

After receiving the Firebase configuration below this prompt:

Connect the application to that Firebase project.

Verify Firebase initialization.

Verify Authentication.

Verify Firestore.

Verify Storage.

Prepare Cloud Functions where required.

Create the required Firestore collections through actual application workflows.

Create Security Rules.

Create Storage Rules.

Create necessary Firestore indexes/configuration.

Test authentication.

Test role-based access.

Test core workflows.

51. BUILD ORDER

Do not randomly generate pages.

Build in this order:

PHASE 1
Project architecture
Firebase integration
Authentication
Role system
Security foundation

PHASE 2
Admin
Users
Departments
Services
Settings

PHASE 3
Patients
Reception
Appointments
Visits

PHASE 4
Billing
Invoices
Payments
Receipts

PHASE 5
Consultation
Medical records
Vital signs
Prescriptions

PHASE 6
Laboratory
Requests
Processing
Results

PHASE 7
Pharmacy
Prescriptions
Inventory
Batches
Stock movements
Suppliers
Alerts

PHASE 8
Inpatient
Wards
Rooms
Beds
Admissions
Nursing
Discharge

PHASE 9
Reports
Notifications
Documents
Audit logs

PHASE 10
Security testing
Performance optimization
Responsive testing
Production cleanup
Deployment preparation

52. DO NOT STOP AFTER THE UI

This instruction is critical.

Do NOT tell me:

"Backend can be added later."

Do NOT create placeholder buttons for major functionality.

Do NOT create fake dashboards.

Do NOT use static JSON as the permanent data source.

Do NOT use mock authentication.

Do NOT create fake patients.

Do NOT claim a feature works when only its UI exists.

If a feature is visible in the interface, connect it to the appropriate backend functionality.

53. DEVELOPMENT QUALITY

Write production-quality code.

Use:

Strong TypeScript typing

Reusable components

Modular architecture

Clear naming

Consistent formatting

Proper error handling

Validation

Security rules

Comments only where useful

Avoid one enormous unmaintainable component.

Keep the codebase organized.

54. FINAL ACCEPTANCE TEST

Before considering the system complete, test this complete workflow:

Admin logs in.

Admin creates a receptionist.

Admin creates a doctor.

Admin creates a pharmacist.

Admin creates a lab technician.

Admin creates billing staff.

Receptionist logs in.

Receptionist registers a patient.

Receptionist creates a visit.

Billing creates an invoice.

Billing records payment.

Patient enters consultation queue.

Doctor opens patient.

Doctor records vital signs.

Doctor creates consultation notes.

Doctor requests laboratory test.

Lab receives request.

Lab enters result.

Doctor sees result.

Doctor creates prescription.

Pharmacy receives prescription.

Pharmacist dispenses medicine.

Stock decreases correctly.

Stock movement is recorded.

Admin sees the updated activity.

Admin sees pharmacy inventory.

Patient is admitted.

Admin/inpatient staff assigns a bed.

Bed becomes occupied.

Patient is discharged.

Bed becomes available.

Billing reflects applicable charges.

Audit logs record important actions.

Unauthorized users cannot access restricted information.

If any step fails, fix it before considering the implementation complete.

55. MOST IMPORTANT PRODUCT PRINCIPLE

Build this as a real operational hospital system.

The objective is not to create a beautiful dashboard.

The objective is:

ONE HOSPITAL → ONE CONNECTED SYSTEM → ONE PATIENT RECORD → CONTROLLED ACCESS → REAL-TIME DEPARTMENT WORKFLOW.

Make every department feel like part of the same system.

The final product should be professional enough that a hospital administrator can understand what is happening across the facility from the Admin Dashboard while each department can efficiently perform its daily work.

Start implementing the application now.

Do not ask me to manually create the database first.

Do not ask me to create every collection manually.

Use the Firebase project configuration I provide below and build the system around it.

After implementation, identify any Firebase configuration, environment variables, indexes, Cloud Functions, Security Rules, or deployment steps that I still need to complete.

FIREBASE CONFIGURATION STARTS BELOW

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "@secret:GOOGLE_API_KEY ",
  authDomain: "hospitalmanagement-system-ke.firebaseapp.com",
  projectId: "hospitalmanagement-system-ke",
  storageBucket: "hospitalmanagement-system-ke.firebasestorage.app",
  messagingSenderId: "186525212144",
  appId: "1:186525212144:web:56c00c66dfb5bcb1ee5135",
  measurementId: "G-KS1RHFS83E"
};

FIREBASE CONFIGURATION ENDS

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/84e71dec-8ba3-4579-9f8d-1234646953b2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

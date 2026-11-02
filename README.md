# Clinic Appointment System

## 1. Project Overview

The **Clinic Appointment System** is a full-stack web application developed as a technical assessment.

The system helps clinic secretaries manage appointments by viewing existing bookings, selecting doctors, checking available time slots, and creating new appointments.

The application validates booking requests and prevents overlapping appointments based on each doctor's working schedule.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | Angular 19 |
| UI Framework | Angular Material 19 |
| Backend | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| Database | Microsoft SQL Server |
| API Documentation | Swagger / OpenAPI |

## 3. System Architecture

The application follows a layered architecture to separate business logic, data access, and API responsibilities.

```text
Angular 19 Frontend
        |
        | HTTP Requests
        v
ASP.NET Core Web API
        |
        v
Clinic.Application
        |
        v
Clinic.Domain
        |
        v
Clinic.Infrastructure
        |
        v
Microsoft SQL Server
```

**Main Backend Layers:**

- **API:** Handles HTTP requests, controllers, dependency injection, and Swagger.
- **Application:** Contains application services, DTOs, and interfaces.
- **Domain:** Contains the core business entities.
- **Infrastructure:** Handles database access, EF Core configurations, repositories, and migrations.

## 4. Main Features & Business Rules

### Main Features

- View and manage the appointment list.
- Retrieve available doctors.
- Check available appointment slots based on doctor schedules.
- Register patient information and book appointments.
- Validate appointment requests on the backend.
- Prevent overlapping appointments.
- Display loading, empty, and error states in the frontend.

### Business Rules

| Rule | Description |
|---|---|
| Appointment Duration | 30 minutes per appointment |
| Doctor Working Hours | Based on the doctor's database schedule |
| Friday | Weekly day off for the configured doctors |
| Available Slots | Generated based on working hours and existing appointments |
| Booking Validation | Performed on the backend |
| Double Booking | Overlapping appointments are rejected |

Working hours and days off are configured through the `DoctorSchedule` database table rather than being hardcoded in the application.

## 5. Database Design

The system uses SQL Server with Entity Framework Core.

**Main Entities:**

| Entity | Responsibility |
|---|---|
| Clinic | Stores clinic information |
| Doctor | Stores doctor information and clinic association |
| DoctorSchedule | Defines doctors' weekly working schedules |
| Patient | Stores patient information |
| Appointment | Stores appointment details and relationships |

**Entity Relationships:**

```text
Clinic
  |
  | 1 : Many
  v
Doctor
  |
  | 1 : Many
  +----------> DoctorSchedule
  |
  | 1 : Many
  v
Appointment
  ^
  |
  | Many : 1
Patient
```

The database schema is created using Entity Framework Core migrations.

Doctor and schedule reference data must be configured separately after database creation.

## 6. Appointment Booking Workflow

1. The secretary opens the appointments dashboard.
2. Selects the option to create a new appointment.
3. Enters the patient's information.
4. Selects a doctor and appointment date.
5. The system retrieves available time slots.
6. The secretary selects an available slot.
7. The booking request is submitted to the backend.
8. The backend validates the schedule and checks for booking conflicts.
9. If validation succeeds, the patient and appointment are saved.
10. The application returns to the appointment list and displays the new booking.

## 7. API Overview

Base URL: `/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/Doctors` | Retrieve available doctors |
| GET | `/Appointments` | Retrieve appointment list |
| GET | `/Appointments/available-slots` | Retrieve available slots for a doctor and date |
| POST | `/Appointments` | Create a new appointment |

Swagger is available in the Development environment for API exploration and testing.

## 8. Application Screenshots

Add actual application screenshots in this section.

Suggested screenshots:

- Appointments Dashboard
- New Appointment Form
- Available Time Slots

Example:

```text
Documentation/Screenshots/
    appointments-dashboard.png
    appointment-form.png
    available-slots.png
```

## 9. Installation & Running Instructions

### Prerequisites

- .NET 8 SDK
- Node.js and npm
- Angular CLI 19 (optional globally)
- Microsoft SQL Server (LocalDB, Express, or full instance)

### Step 1: Database Configuration

Update the connection string in:

`ClinicAppointmentAPI/src/Clinic.Api/appsettings.json`

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SQL_SERVER;Database=ClinicAppointmentDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Use your own SQL Server instance name. Do not commit credentials or secrets.

### Step 2: Apply Database Migrations

From the `ClinicAppointmentAPI` directory:

```bash
dotnet restore ClinicManagement.sln

dotnet ef database update \
  --project src/Clinic.Infrastructure/Clinic.Infrastructure.csproj \
  --startup-project src/Clinic.Api/Clinic.Api.csproj
```

After applying migrations, configure the required clinic, doctor, and doctor schedule reference data.

### Step 3: Run the Backend

From the `ClinicAppointmentAPI` directory:

```bash
dotnet run --project src/Clinic.Api/Clinic.Api.csproj --launch-profile https
```

Backend URL:

`https://localhost:7256`

Swagger:

`https://localhost:7256/swagger`

### Step 4: Run the Frontend

Open a new terminal and navigate to `ClinicAppointmentUI`:

```bash
npm install
npm start
```

Frontend URL:

`http://localhost:4200`

The Angular development proxy forwards API requests to the backend.

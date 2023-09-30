# Student Point Tracker

The purpose of this system is to be able to track the points a student has earned and utilized.

These points are redeemable for non-specific items, an the interface to view, update, add, and remove these points should be as easy as possible.

The current known requirements or specifications of this project:

* Students are separated by Homeroom. (No longer a requirement)
* Each entry then for every single student, contains a reference for every day of the year.
* On each day the amount of points a student has can be added to or reduced, changing their total points.
* In either scenario there are reasons added, such as the item they have purchased with their points, or the reason points have been removed.

But with this said, now lets get onto our requirements:

## Minimum Viable Product

* Able to view each student individually, including all occasions that points have been removed or added.
* View the full list of students ~~per homeroom~~
* An admin only dashboard that allows updates to points

## Ideal System

* Students can be searched via Names or Student Numbers
* Homerooms can be searched via Teacher or Room Number
* Viewing each student allows a view of how many points they have, as well as the occasions that caused them to receive or lose points
* If an Admin logs in, they are then able to deduct or add points from any student as needed.
* If a student logs in, they can view their own profile in this system. Track their own points, and maybe even earn special badges? (Like gained so many points, gained so many in a short time period, idk)


### Specs of an 'Ideal System':

To track this we would need the following:

* Database:
  - Student Table: Names, IDs, homeroom [foreign key], Point Total
  - Point Events: Point Amount, Student, Timestamp, Added/Removed, Points Before, Points After
  - Inventory: It seems inventory may exist on the system, and we may want to be able to track it
* Authentication:
  - Likely could be done via Google SSO
  - Will need a way to determine who are students and teachers or other admin staff
* Pages:
  - Public Pages:
    - Student Lookup
    - Student Summary View
  - Admin Pages:
    - All Public Pages
    - Student Add/Remove Points
  - User Pages:
    - All Public Pages
    - Profile View

### API Schema of 'Ideal System':

Things needed:
  - student lookup
  - student details
  - add points
  - remove points
  - login
  - (Maybe): Interface to manage homerooms and teachers, admins and such within the app? (Could just be a config, but then becomes ITs problem)

API Schema:
  - GET /api/student/:studentID - Returns the details of a single student. If this is the current logged in student, badge information could be returned
  - GET /api/student - Search endpoint among all students
  - POST /api/student/:studentID/points - Add new points to a specific student
  - DELETE /api/student/:studentID/points - Remove points from a specific student

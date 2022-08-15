# Flip React Native Technical Test

Approaches to get a better app performance in the MR / PR.

To achieve maximum MR/PR, we must know how big the team will be working on the application.
To illustrate, when a project consists of several teams and many junior programmers, the ideal way to do MR is
approximately 100 lines of code, to make it easier for us to review the code submitted. if from this team there are many senior programmers
can submit 300 lines of code or more.

Before MR, make sure the code to be submited is the latest code, so as to minimize the possibility of conflict
or outdated code. If the MR is too large, then the MR process must be split into several branches. Then
if there is shared logic, make sure the code is correct and pass the test. And as much as possible clean up unnecessary code.

This is a 2022 prototype of Gainzville, built as a standard client-server web app. I was focused on building a model and UX which was flexible enough to allow users to create their owns activities (run, rock climb, Romanian deadlift) and data types. It started as a desktop-only web app and I eventually started working on a mobile-friendly version to support what I still see as a primary use case: entering workout data on a phone while at the gym or out climbing. My experience trying to create a good user experience for a highly interactive app with many input fields in a mobile web browser eventually led me to React Native and, a few years later, Swift.

##### Viewing a recorded exercise in the desktop app
![Screenshot of viewing a record in the app](/images/viewing-record.png)
- On the left we see the user's libraries: collections of activities (exercises, events, etc) they've created or imported.
- Center screen is an exercise the user recorded: on 9/13/23 they did 8 reps of "Windshield Wipers" (a core exercise) with 10 pounds of ankle weights on. The goal is to create a system that is expressive enough for the user to capture the information they care about while maintaining the required structure to analyze and visualize the data.
- The right side of the screen contains the "log" of all the user's activities, with some basic search and filter capabilities.

##### Creating and using a "Climb Outcome" data type in the desktop app
![Screenshot of creating a "Climb Outcome" data type](/images/create-climb-outcome.png)
- Creating a data type (Facet) to capture information about a rock climb: Did you fall? Did you climb to the top without falling (redpoint)? Did you climb it first try without falling (onsight)?
- In this case, more than one of these cases can be true at the same time: you could fall on the climb, then spend some time "working" (practicing) the moves.
![Screenshot of using the newly created "Climb Outcome" data type](/images/use-climb-outcome.png)
- A record which represents attempting a sport climb (a type of rock climb) with a grade (difficulty) of 13a in which the user fell and then worked (practiced) the route.

##### Creating and using a new data type in the mobile app
https://github.com/user-attachments/assets/5dba0dd5-d175-4159-9e4b-171aef02f3f2
- This video demonstrates the process of creating a new data type (or "Facet" as I called it at this point).
- Here the idea is that the user wants to record how much effort they put into an exercise, which can modeled as selection from a list of options. Rate of the perceived exertion (RPE) is a common way of describing this but the choice is up to the user.

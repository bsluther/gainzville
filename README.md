### What is Gainzville?
Gainzville is an app to record and analyze physical training. The primary problem it sets out to address is that there are many apps which support particular types of training and exercises, but some training doesn't fit neatly into the boxes that app developers choose to create. What if rather than hard-coding particular exercises and relevant data points, the user was empowered to express the training they actually perform? Gainzville is an attempt to build a platform which is expressive enough to describe the vast majority of training while retaining enough structure to support analysis of that data.

See [here](https://github.com/bsluther/gainzville-swift/blob/main/Docs/product.md) for an aspirational description of Gainzville.

### About this repository
This is a 2022 prototype of Gainzville, built as a standard client-server web app. I was focused on building a model and UX which was flexible enough to allow users to create their owns activities (run, rock climb, Romanian deadlift) and data types. It started as a desktop-only web app and I eventually started working on a mobile-friendly version to support what I still see as a primary use case: entering workout data on a phone while at the gym or out climbing. My experience trying to create a good user experience for a highly interactive app with many input fields in a mobile web browser eventually led me to React Native and, a few years later, Swift.

#### Viewing a recorded exercise in the desktop app
![Screenshot of viewing a record in the app](/images/viewing-record.png)
- On the left we see the user's libraries: collections of activities (exercises, events, etc) they've created or imported.
- Center screen is an exercise the user recorded: on 9/13/23 they did 8 reps of "Windshield Wipers" (a core exercise) with 10 pounds of ankle weights on. The goal is to create a system that is expressive enough for the user to capture the information they care about while maintaining the required structure to analyze and visualize the data.
- The right side of the screen contains the "log" of all the user's activities, with some basic search and filter capabilities.

#### Creating a "Climb Outcome" data type in the desktop app
![Screenshot of creating a "Climb Outcome" data type](/images/create-climb-outcome.png)
- Creating a data type (Facet) to capture information about a rock climb: Did you fall? Did you climb to the top without falling (redpoint)? Did you climb it first try without falling (onsight)?
- In this case, more than one of these cases can be true at the same time: you could fall on the climb, then spend some time "working" (practicing) the moves.

#### Using the new "Climb Outcome" data type
![Screenshot of using the newly created "Climb Outcome" data type](/images/use-climb-outcome.png)
- A record which represents attempting a sport climb (a type of rock climb) with a grade (difficulty) of 13a in which the user fell and then worked (practiced) the route.

#### Re-using the new "Climb Outcome" data type
![Screenshot of using the newly created "Climb Outcome on another record](/images/record-boulder-problem.png)
- The "Climb Outcome" can be re-used on other types of exercises to capture consistent, structured data.
- Here "Boulder Problem" is another type of rock cliimbing, but the "Climb Outcome" data is structured exactly the same.
- This avoids repeated effort and enables queries such as "how many rock climbs did I attempt this week?", although those kind of analytical queries are not supported in this version.

#### Creating and using a new data type in the mobile app
https://github.com/user-attachments/assets/5dba0dd5-d175-4159-9e4b-171aef02f3f2
- This video demonstrates the process of creating a new data type (or "Facet" as I called it at this point).
- Here the idea is that the user wants to record how much effort they put into an exercise, which can modeled as selection from a list of options. Rate of the perceived exertion (RPE) is a common way of describing this but the choice is up to the user.

### Other versions of Gainzville

I've tried a lot of approaches, models, platforms, libraries, languages, etc. Part of this has been exploring the problem space, and part of it has been learning about software engineering.
- [A Gainzville mobile app via Swift](https://github.com/bsluther/gainzville-swift)
- [A Gainzville mobile app via React Native](https://github.com/bsluther/gv-2025-01-15)

export const About = () => {

  return (
    <div className="w-1/2 text-neutral-200 space-y-4 pt-10 p-2">
      <p>What is Gainzville?</p>
      <p>
        There are as many different ways to train for a sport or goal as there are people, and the aim of GV is to offer a platform to organize and analyze those training activities. Rather than providing a limited set of exercises to choose from, Gainzville tries to provide a limited set of building blocks which users can use to express whatever it is that they like to do.
      </p>

      <p>
        In GV we call all the exercises and other things you might want to record <strong>activities</strong>. Things like a run, some push-ups, or even waking up in the morning - whatever it is that you'd like to keep track of. Say I went for a run then did some stretching afterward. I can first search to see if someone has already created the activity I'm looking for - run, for example, already exists in the database. But if my quad stretches are nowhere to be found, I simply create a new activity and give it a name like "Quadriceps Stretch".
      </p>
      <p>
        What else would I like to record about my activity? Probably how far I ran, or what kind of quadriceps stretch I did. These kind of details are what we call <strong>facets</strong> - think of them as descriptions of your activity. Just like activities, I can search the existing database, or create my own. I can use the existing "duration" facet for my run, and then create a new facet called "position" for my quadriceps stretch. What I want to record is which sort of quadriceps stretch I was doing - standing up, lying face down, or lying face up. One way I could express this is a set of options: standing, prone, or supine. These are standard terms in physical training but if you want to call the positions "lying down" or "downward jaguar", the choice is yours.
      </p>
      <p>
        Now that I've created my "position" facet, I can reuse it wherever I want. It's by reusing facets that Gainzville gets an idea of what it is you're up to - rather than just a random string of letters, "supine" is a property that any exercise using "position" shares. If you want to see how often you stretch standing versus supine, or set a goal of doing more supine quad stretches, facets give you the power to do so.
      </p>
    </div>
  )
}
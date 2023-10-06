# Badges

An idea to further gamify this system is badges.

Essentially, this would mean a set series of badges as defined by the implmenting user,
that can be acheived by students.

Once acheived by a student, this badge then allows them to redeem the badge and earn a reward.
In this case the reward being a new customization of their duck.

While this sounds awesome, the difficult part comes with implmentation. Of which we have some choices:

* This system has a predefined set of badges that can be earned. And they cannot be changed.
* This system has NO predefined set badges, and they all must be implemented manually.
* This system has a predefined set of badges, that cannot be added to, but they can be disabled or enabled selectively.

Obviously, as I'm a lover of customization, I'd rather allow **no** predefined badges, and they can all be made custom.

So lets continue with implementation there.

## All Custom Badges

With this comes the decision of if we want badges to be within the db.
I really do think the performance hit of a multi-thousand long file declaring who has what badges would be a major blocker to utilizing the file system here.

Meaning we **must** keep badges within the db itself.

In order to accomplish this, here's a proposition:

To create a badge we add another config file, this one with properties like:

* serial: The unique identifier of the badge
* name: The friendly name of the badge
* image: The icon to display for the badge
* requirements: This is the hard one.

Since we are allowing custom badges we can never truly know what badges may be in use. Or what properties a badge will want to check to use them.

But still the most obvious approach is one similar to our tasks. A subset of constants allowed that relate to different elements.
Alternatively, we could allow full scripting capability. Full scripting capability could be in the shape of a JavaScript module that will be executed, which is obviously the easiest. Or it could take the form of some sort of custom requirements file.

While the later would be fun, the first two are far more realistic. With the JavaScript being the easiest on my end, although may be difficult for others to implement. But, since as of now it may make the most sense to prioritize ease of implementation, we will focus our efforts on a JavaScript module that's able to determine the requirements.

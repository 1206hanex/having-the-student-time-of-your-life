# Having the [Student] Time of Your Life

## Official repository of the University of Waikato's second-year Software Engineering project

Key Idea: Using content analysis of songs—music key, beats-per-minute, etc—and audio manipulation techniques such as pitch-shifting and sound-source separation, develop an environment that assists users in creating a musical mashup.

You've listened to the example mashups through the above playlist link. Now think about a computer-assisted environment that would support the identification and blending of different songs into such mashups. As suggested in the "Key Idea" text, an extremely useful capability, which could help identify songs that are suitable to mashup, is the application of audio content analysis. Further, in situations where songs might not have the same tempo or be in the same key, but follow the same relative chord progression, then audio content processing techniques such as pitch-shifting and time-stretching could be used to further massage the audio from different sources, so they fit together harmoniously. Links are provided below to software libraries that include such capabilities.

As a way of boosting access to content, where music content analysis has already been applied, a project worth taking a look at is AcousticBrainz, a companion project to MusicBrainz. These projects step you into the world of Linked Open Data. A range of software technologies have been developed to support Linked Open Data: one of them is SPARQL (pronounced sparkle) queries. Having stored your Knowledge Graph in a Triplestore, you can then search it using SPARQL queries. In the case of AcousticBrainz, this means access to extracted musical features such as key, and beats per minute (bpm); as well as higher-level musical content such as genre. MusicBrainz stores details on more than 44 million tracks, and AcousticBrainz has computed features on some 30 million of them! So, plenty to choose from to develop compatible/harmonious mashups!

You will also want to be able to cut and mix audio files together. There are plenty of libraries around that let you read and write out audio formats, such as WAV and MP3. The basic act of cutting, copying, and mixing is fairly straightforward to implement yourself: this essentially boils down to manipulating arrays of numbers; however, if implementing yourself, you do need to pay attention to issues such as precision and arithmetic overflow, which can lead to issues in the audio such as clipping. In the long run, taking a "rolling your own" approach to implementation will likely become a notable time-sink, as you encounter and work through such issues.

Drawing upon the subject of Digital Signal Processing (DSP), there is much more that can be done in terms of how audio can be manipulated than audio mixing, such as applying filters to the audio to change its acoustic properties. For any popular programming language you care to name, there will be a selection of DSP audio processing libraries available for it. These will do much of the heavy lifting for you—although it should be noted this is not a zero-cost move, as now you will need to invest time in learning how they work.

Given that cutting and combining different audio tracks is also part of what is required for this project, it is recommended that the team undertaking this project also review open-source audio/music editing applications. It could very well be that such software includes audio processing capabilities—quite likely using these same general-purpose audio processing library.

Note: While the emphasis for this project is primarily on audio processing, if a team member wanted to take on generating video that gets played along with the audio mashup, then that would definitely fit within the overall aims of the project.

Potentially useful resources:

There are a lot of Music APIs out there: Spotify is considered the market leader, although there are plenty of alternatives.
Special shout out to MusicBrainz and AcousticBrainz, as they are Linked Open Data resources.
For audio processing, again there are plenty of libraries available for a range of programming languages. Some core capabilities are already built into Java, for example, through its Sound packages, with more advanced techniques available in libraries such as TarsosDSP. For C# there are libraries such as CSCore and NAudio. For Python, Librosa and Pydub. For Javascript there is the Web Audio API, and a range of packages available for NodeJS.
For open-source tools that perform music source separation, Demucs is a Python-based open-source package that has proven straightforward to install and use. For a broader context see the following Python notebook based tutorial. There is also the Papers with Code listing.
A very popular open-source desktop audio editing application is Audacity, which includes support for plugins.
In the web-browser space, AudioMass is an HTML5-based audio editing library.
Additional Note 1: The Eurovision Linked Open Data Digital Library demoed in class is an example of a project that leverages Linked Open Data to form the Digital Library. It also re-expresses the amassed data as more nuanced Linked Open Data, which now includes musical data such as the tempo of the various song, and the voting data. It is this that drives the visualisation component of the site (such as those available through the Visualizer tab), as well as providing a SPARQL endpoint for others to use.

Additional Note 2: the tools developed that support Linked Open Data, such as SPARQL, are applicable to a wide range of subject material, not just in the music domain. This should be borne in mind when reading other project descriptions, as they could equally be used to help develop solutions to other projects listed here, such as SuppSense and Online Financial Scams.

Having the [Student] Time of Your Life
Project Managers: Hans Lomboy; and Justin Poutoa
Team Members: Noga Malal; Gloria Susan Saji; Jacob Watters; and Samantha Williams
Meeting Time: 3pm

Key Idea: Create a digital environment that enables you to better organise your time and studies at university.

Studying at Waikato—like at any other university—requires accessing information spread across multiple web-based systems. Keeping on top of the competing time commitments of student life depends on having a clear view of what needs attention at any given time. While the necessary information is technically available, its distribution across disparate systems makes it both tedious to piece together and easy to overlook important details—sometimes with dire consequences!

The goal of this project is to develop a student-centric digital environment that consolidates key information into one place. More than just bringing information together, the system will actively support planning and managing commitments—so you can be truly Having the [Student] Time of your Life.

In terms of an implementation strategy, one potentially useful approach is to use user-scripting. This is a technique that lets you splice bespoke Javascript that you have control over, into your web browser which then gets run when you visit other people's websites. You can achieve this by installing a browser extension such as TamperMonkey to your browser. Then you are free to install whatever userscripts you see fit, which are typically keyed to spring into life when you visit a website that matches certain regular expressions. As you are able to specify the JavaScript you would like to run, this means you are able to access the Document Object Model (DOM) for the webpage that has been loaded in. Connect this with a backend server that is under your control, and then you have a way to access the data across the various university web-based systems, and export the relevant data out—via your backend server—into a single unified location, which forms the source for your student-centric app.

Potentially useful topics and resources:

The origins of User-scripting
The TamperMonkey web browser extension
Article (representative) about Exploratory Data Analysis
Article (representative) about Learning Analytics
Article (representative) about Self-Regulated Learning (SRL)
Article (representative) about Dashboard-based User Interfaces

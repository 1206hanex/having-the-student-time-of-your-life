# Having the [Student] Time of Your Life

## Official repository of the University of Waikato's second-year Software Engineering project

Key Idea: Create a digital environment that enables you to better organise your time and studies at university.

Studying at Waikato—like at any other university—requires accessing information spread across multiple web-based systems. Keeping on top of the competing time commitments of student life depends on having a clear view of what needs attention at any given time. While the necessary information is technically available, its distribution across disparate systems makes it both tedious to piece together and easy to overlook important details—sometimes with dire consequences!

The goal of this project is to develop a student-centric digital environment that consolidates key information into one place. More than just bringing information together, the system will actively support planning and managing commitments—so you can be truly Having the [Student] Time of your Life.

In terms of an implementation strategy, one potentially useful approach is to use user-scripting. This is a technique that lets you splice bespoke Javascript that you have control over, into your web browser which then gets run when you visit other people's websites. You can achieve this by installing a browser extension such as TamperMonkey to your browser. Then you are free to install whatever userscripts you see fit, which are typically keyed to spring into life when you visit a website that matches certain regular expressions. As you are able to specify the JavaScript you would like to run, this means you are able to access the Document Object Model (DOM) for the webpage that has been loaded in. Connect this with a backend server that is under your control, and then you have a way to access the data across the various university web-based systems, and export the relevant data out—via your backend server—into a single unified location, which forms the source for your student-centric app.

Potentially useful topics and resources:

- The origins of User-scripting
- The TamperMonkey web browser extension
- Article (representative) about Exploratory Data Analysis
- Article (representative) about Learning Analytics
- Article (representative) about Self-Regulated Learning (SRL)
- Article (representative) about Dashboard-based User Interfaces

# knowledgeGraph_plugin

1. Brief intro:
This is a user script to provide direct answers to technology search on Google. You can also access our web application for technology knowledge graph from the direct answer panel.
It is written in Javascript and can run in Greasemonkey (Firefox) and Tampermonkey (Chrome). The direct answers are based on the structured knowledge mined from Stack Overflow. They can assist your technology search by providing an overview of technology landscape. A live video can be seen in https://youtu.be/LERcOBrZUSg.
Screenshot can be seen below:
![alt tag](https://raw.github.com/ccywch/knowledgeGraph_plugin/master/screenshot.png)

2. Functions:
(1). The script can detect technology terms (e.g., github, data visualization, machine learning) in your Google search. If the searched technology is in our structured knowledge base,  the script renders a definition of the technology (extracted from Stack Overflow TagWiki) and a graph overview of the correlated technologies.
(2). The script also provide an access to our web application (http://graphofknowledge.appspot.com/) that can give you more detailed information about your search technologies (e.g., technology trend, comparison of alternative technologies).
(3). You can right-click the node for brief definition or double-click for more details.

3. Usage:
(1). Install GreaseMonkey (Firefox) and TamperMonkey (Chrome) in  your web browser.
(2). Add a new script, copy & paste our code into GreaseMonky or TamperMonkey. (If using TamperMonkey, do remember remove the default comments. They are actually configuration settings that must be replaced by our script.)
(3). Search in Google (e.g., java, machine learning, unit testing, mocking), maybe there will be some suprise. Note that the current version support only search by one technology. Searching by multiple technology (e.g., php unit testing) is under development.

4. Contact:
If you have any problem, do not hesitate to contact me at chen0966|e.ntu.edu.sg. (change "|" to "@").

Thanks and enjoy the journey.

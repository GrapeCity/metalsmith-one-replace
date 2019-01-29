---
title: test page 1
permalink: false
message: this is simple message within page
f4: Mango
---

# Test Content

Some text. Insert content from another file in the following paragraph (with two leading blank lines).

{#insert insert1.svg}

End of file insert

Now some variable insert - first from variables defined in the page

the title of this page is {#var title}. And the message is {#var message}.

End of var within page

Now lets test some variables as defined in keyvalues in the option section.

The fruits are {#var f1}, {#var f2}, {#var f3}.

Lets see if the same variable is declared at 2 places (page one will get higher preference)

The best fruit is {#var f4}. The page says Mango, while the options says Grapes.
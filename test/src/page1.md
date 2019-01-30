---
title: test page 1
permalink: false
message: this is simple message within page
f4: Mango
---

# Test Content

## Insert File

Some text. Insert content from another file in the following paragraph (with two leading blank lines).

{#insert insert1.svg}

End of file insert

## Insert Variable

Now some variable insert - first from variables defined in the page

the title of this page is {#var title}. And the message is {#var message}.

End of var within page

Now lets test some variables as defined in keyvalues in the option section.

The fruits are {#var f1}, {#var f2}, {#var f3}.

Lets see if the same variable is declared at 2 places (page one will get higher preference)

The best fruit is {#var f4}. The page says Mango, while the options says Grapes.

## New Tags

Checking the image

{#img src="smiley.gif" alt="Smiley face" height="42" width="42"}

Now lets {#bold - this is text is bold -} tag in a sentence.
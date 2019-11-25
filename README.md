# functional-programming

## Concept

With my concept I want to give a picture of all the weapons in the collection that come from japan. I do this by means of an interactive bubble chart in which the size of the bubble shows how many objects there are in each category compared to the other bubbles.

When the visitor selects a bubble, the visitor receives a selection of the weapons that are in it. With this I give the visitor a picture of the use of weapons in japan and the visitor can actually see the weapons.

_This website was commissioned by the [university of applied science](https://www.hva.nl/) in Amsterdam and the [Museum of Volkenkunde](https://www.volkenkunde.nl/nl/plan-je-bezoek-in-museum-volkenkunde/openingstijden-en-prijzen) in Leiden_


### Screenshot

![screenshot-functional-programming](https://user-images.githubusercontent.com/45428822/68870363-11001f00-06fb-11ea-918e-c1b65bc2ce06.png)

### Data Cleaning

Click [here](https://github.com/MarcKunst/functional-programming/wiki/2.-Cleaning-data) for my data cleaning practice documentation.

## Build status

[![Netlify Status](https://api.netlify.com/api/v1/badges/ab58b408-dcbd-4045-a959-1663b591fac3/deploy-status)](https://app.netlify.com/sites/weapons-of-japan/deploys)


## Installation

I assume that you have already installed node and npm on your computer. If this is not the case. make sure you do this before you install this project. Select the links below for more information about installing [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)

When you have installed node and npm it is time to get the app working. Follow the following steps:

1. Clone this repo by running `git clone https://github.com/MarcKunst/functional-programming.git`
2. Run a development server. In my case I used the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) plugin for VSCode

## API reference

This app uses SPARQL to retrieve data from the museum's database. Here more information about [SPARQL](https://nl.wikipedia.org/wiki/SPARQL)

Used query and explanation can be found on my [SPARQL query wiki page](https://github.com/MarcKunst/functional-programming/wiki/4.-Data-ophalen-met-SPARQL)

## Credits

Thanks to the museum of volkenkunde for sharing their data. And thanks to my teachers and colleagues for their help during this project.

The D3 bubble chart example I used for this project was made by Alok K. Shukla. For more information see [link to his code](https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168)

The D3 tooltip example I used for this project was made by Justin Palmer. For more information see [link to his code](http://bl.ocks.org/caged/6476579)

The D3 pie chart example I used for this project was made by Karthik Thota. For more information see [this link to his video](https://www.youtube.com/watch?time_continue=113&v=kK5kKA-0PUQ&feature=emb_logo)

The background image that I use is a photo by [Maranda Vandergriff](https://unsplash.com/@mkvandergriff?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on Unsplash

I would like to thank my colleagues [Martijn Keesmaat](https://github.com/martijnkeesmaat) for helping me understand the overall patterns of functional programming and [Chazz Mannering](https://github.com/Chazzers) for helping me out with a function that I use in my code


## License

Unless stated otherwise, code is [MIT](https://github.com/MarcKunst/functional-programming/blob/master/LICENSE)

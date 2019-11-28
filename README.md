# Frontend data

## Build status

[![Netlify Status](https://api.netlify.com/api/v1/badges/78c11c1a-9928-4d9c-84ab-bec4295c931a/deploy-status)](https://app.netlify.com/sites/weapons-of-east-asia/deploys)

## Concept

With my concept I want to give a picture of all the weapons in the collection that come from East A sia. I do this by means of an interactive bubble chart in which the size of the bubble shows how many objects there are in each category compared to the other bubbles.

The target audience for this project is the interested museum visitor. With the visualization of weapons from Asia, I want to give the visitor to the museum an overview of the entire collection. The visualization must give a picture of the types of weapons that were used in East Asia in the past

When the user selects a bubble category, a pie chart appears. Within this pie chart, the user can see how many items of this category are in the collection per country in East Asia

_This website was commissioned by the [university of applied science](https://www.hva.nl/) in Amsterdam and the [Museum of Volkenkunde](https://www.volkenkunde.nl/nl/plan-je-bezoek-in-museum-volkenkunde/openingstijden-en-prijzen) in Leiden_


### Screenshot

![Schermafbeelding 2019-11-28 om 15 07 56](https://user-images.githubusercontent.com/45428822/69812821-3ad43e00-11f1-11ea-9c57-ced5d671aa99.png)

## Data

The data that I use comes from the joint database of the Museum van volkenkunde in Leiden. This museum collaborates with other museums ([Tropenmuseum](https://www.tropenmuseum.nl/nl), [Afrika Museum](https://www.afrikamuseum.nl/nl) and [Wereldmuseum](https://www.wereldmuseum.nl/nl)) to create this database. The collection contains all kinds of objects, artworks, clothing and images from all over the world. The total number of objects within the collection is above 700,000 unique objects. follow [this link to see te collection](https://collectie.wereldculturen.nl/#/query/20fc8276-9bd7-4e50-8c16-26f662855837)

### query

To retrieve the correct data from the database, I wrote a query using SPARQL that retrieves all weapons from East Asia. The variable that I retrieve per object are the objects related to hand weapons `?choSample`, the type of the weapon `?type` and the countries where the objects come from `?placeLabel`.

```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ns: <http://example.com/namespace>
SELECT (SAMPLE(?cho) AS ?choSample) ?type ?placeLabel WHERE {      <https://hdl.handle.net/20.500.11840/termmaster7104> skos:narrower* ?place .
  
  VALUES ?type { "zwaard" "Zwaard" "boog" "Boog" "lans" "Lans" "mes" "Mes" "knots" "Knots" "Piek" "Piek" "vechtketting" "Vechtketting" "dolk" "Dolk" "bijl" "Bijl" "strijdzeis" "Strijdzeis" "Sabel" "sabel" }.
  
     ?place skos:prefLabel ?placeLabel .      ?cho edm:isRelatedTo <https://hdl.handle.net/20.500.11840/termmaster2815>; # selecteer handwapens
                                                                                                               
     dc:type ?type ;
     dct:spatial ?place .
} ORDER BY ?cho
```

_The query above only fetches dutch names from the weapons. If you want to fetch english names, adjust the strings within the `VALUES ?typ`. Be aware of using uppercase and lowercase._

### JSON

After running the query, the data looks like this.

![json-data](https://user-images.githubusercontent.com/45428822/69532211-a0b49180-0f75-11ea-8a90-2b521297760d.png)

 The objects are still nested in `results`>` bindings`. On my wiki page [5. Data transformeren](https://github.com/MarcKunst/frontend-data/wiki/5.-Data-transformeren) I'll explain how I transform the data so it can be used within D3.
 
Click [here](https://github.com/MarcKunst/functional-programming/wiki/2.-Cleaning-data) for my data cleaning practice documentation.

## Epmty values

When the pie chart forms itself, it is unnecessary to show 0 values. To prevent this, I have written a function that filters out those empty values.

```js
function filterEmptyValues(data) {

    const newData = data.map(item => 
        item.value.countries.filter(country => country.countObj !== 0)
    );
    return newData;
}
```

This function runs over the items and filters out all empty values for each item. View my [wiki](https://github.com/MarcKunst/frontend-data/wiki/5.-Data-transformeren) for more information.

## Update pattern

Within the visualization it is possible to select a weapon type bubble. When the user does this, the pie chart next to that weapon type will show how many weapons are in the collection per country in East Asia.

The pie chart adjusts when a weapon type is selected. More about this update function on the wiki page [9. Update function](https://github.com/MarcKunst/frontend-data/wiki/9.-Update-function)

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

Yhis video helped me understand the update function in D3 [video](https://www.youtube.com/watch?v=NlBt-7PuaLk) van Curran Kelleher.


## License

Unless stated otherwise, code is [MIT](https://github.com/MarcKunst/functional-programming/blob/master/LICENSE)

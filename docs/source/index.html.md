--- 

title: CoronaAPI 

language_tabs: 
   - shell: cURL
   - javascript: JS

toc_footers: 
   - <div class="footer-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" width="12" height="16"><path fill="#eaeaea" fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg><a href='https://corona-api.org'>Homepage</a></div>
   - <div class="footer-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#eaeaea" fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg><a href='https://github.com/CoronaAPI/CoronaAPI'>Github</a></div>

includes: 
   - errors 

search: true 

--- 

# Introduction 

An HTTP API serving structured information on COVID-19's march around the globe. 

**Version:** 0.2.0 

# /daily
## ***GET*** 

```shell
# With shell, you can just pass the correct header with each request
curl "https://data.corona-api.org/v1/daily"
```

```javascript

fetch('https://data.corona-api.org/v1/daily')
  .then(response => response.json())
  .then(data => console.log(data))
```

> Sample Response:   

```json
{
  "rating": 0.21568627450980393,
  "stateId": "iso2:SI-101",
  "tz": [
    "Europe/Ljubljana"
  ],
  "population": 6183,
  "featureId": "iso2:SI-101",
  "sources": [
    {
      "name": "COVID-19 Sledilnik",
      "url": "https://covid-19.sledilnik.org/"
    }
  ],
  "url": "https://raw.githubusercontent.com/slo-covid-19/data/master/csv/stats.csv",
  "country": "Slovenia",
  "name": "Radlje ob Dravi, Slovenia",
  "state": "Radlje ob Dravi",
  "date": "2020-05-06",
  "updated": "2020-05-06 1:32",
  "level": "state",
  "maintainers": [
    {
      "name": "Quentin Golsteyn",
      "github": "qgolsteyn",
      "flag": "🇨🇦"
    }
  ],
  "cases": 1,
  "countryId": "iso1:SI",
  "ID": "9c2b87a9-759b-4e72-bb2d-5f061a05a659",
  "populationDensity": 66.21106755383377,
  "coordinates": [
    15.2475,
    46.591499999999996
  ]
}...
```


**Description:** Get high-level daily data on Corona infections around the world or for a specific country.

### HTTP Request 
`GET /daily` 

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| country | query | Please enter the 3-digit ISO Country Code. For valid codes to use see <a href=https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 target="_blank">ISO 3166-1 alpha-3</a> (e.g. DEU for Germany). | No | string |
| state | query | Please enter a *state* name | No | string |
| county | query | Please enter a *county* name | No | string |
| city | query | Please enter a valid city name. | No | string |
| rating | query | Please enter a minimum rating of the data quality based upon (<a href="https://github.com/lazd/coronadatascraper">@lazd/coronadatascraper</a> data rating). The rating takes into account completeness, machine readability and best practices. | No | number |
| source | query | Enter a source URL. For available sources, please check `/api/datasources` endpoint. | No | string |
| countryLevelOnly | query | Enter 'true' or 'false' if you would like only country level data (no counties / cities / states). | No | boolean |

<aside class='warning'>
Using these parameters can slow down the API response time.
</aside>

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The available Corona Virus data per country as a JSON array. The array as well as the data for each country is filtered according to the request parameters. |

<embed src="https://jsconsole.com/?fetch('https://data.corona-api.org/v1/daily').then(response%20=%3E%20response.json()).then(data%20=%3E%20console.log(%60$%7BJSON.stringify(data).substr(0,350)%7D...%60))" width="100%" height="400px" />


# /daily/confirmed
## ***GET*** 

**Description:** Get only confirmed daily case numbers

```shell
# With shell, you can just pass the correct header with each request
curl "https://data.corona-api.org/v1/daily/confirmed"
```

```javascript

fetch('https://data.corona-api.org/v1/daily/confirmed')
  .then(response => response.json())
  .then(data => console.log(data))
```

### HTTP Request 
`GET /daily/confirmed` 

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| country | query | Please enter the 3-digit ISO Country Code. For valid codes to use see <a href=https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 target="_blank">ISO 3166-1 alpha-3</a> (e.g. DEU for Germany). | No | string |
| state | query | Please enter a *state* name | No | string |
| county | query | Please enter a *county* name | No | string |
| city | query | Please enter a valid city name. | No | string |
| rating | query | Please enter a minimum rating of the data quality based upon (<a href="https://github.com/lazd/coronadatascraper">@lazd/coronadatascraper</a> data rating). The rating takes into account completeness, machine readability and best practices. | No | number |
| source | query | Enter a source URL. For available sources, please check `/api/datasources` endpoint. | No | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The available Corona Virus confirmed cases data, including datasource URL |

# /daily/recovered
## ***GET*** 

**Description:** Get only daily recovered numbers

### HTTP Request 
`GET /daily/recovered` 

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| country | query | Please enter the 3-digit ISO Country Code. For valid codes to use see <a href=https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 target="_blank">ISO 3166-1 alpha-3</a> (e.g. DEU for Germany). | No | string |
| state | query | Please enter a *state* name | No | string |
| county | query | Please enter a *county* name | No | string |
| city | query | Please enter a valid city name. | No | string |
| rating | query | Please enter a minimum rating of the data quality based upon (<a href="https://github.com/lazd/coronadatascraper">@lazd/coronadatascraper</a> data rating). The rating takes into account completeness, machine readability and best practices. | No | number |
| source | query | Enter a source URL. For available sources, please check `/api/datasources` endpoint. | No | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The available Corona Virus confirmed cases data, including datasource URL |

# /daily/deaths
## ***GET*** 

**Description:** Get only daily 'deaths' numbers

### HTTP Request 
`GET /daily/deaths` 

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| country | query | Please enter the 3-digit ISO Country Code. For valid codes to use see <a href=https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 target="_blank">ISO 3166-1 alpha-3</a> (e.g. DEU for Germany). | No | string |
| state | query | Please enter a *state* name | No | string |
| county | query | Please enter a *county* name | No | string |
| city | query | Please enter a valid city name. | No | string |
| rating | query | Please enter a minimum rating of the data quality based upon (<a href="https://github.com/lazd/coronadatascraper">@lazd/coronadatascraper</a> data rating). The rating takes into account completeness, machine readability and best practices. | No | number |
| source | query | Enter a source URL. For available sources, please check `/api/datasources` endpoint. | No | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The available Corona Virus confirmed cases data, including datasource URL |

# /timespan
## ***GET*** 

**Description:** Get data over time for a specific country.

### HTTP Request 
`GET /timespan` 

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| country | query | Please enter the 3-digit ISO Country Code. For valid codes to use see <a href=https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 target="_blank">ISO 3166-1 alpha-3</a> (e.g. DEU for Germany). | No | string |
| time | query | Please choose a timespan, how far back you want data. Must be one of "week", "month", "year". | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The available COVID-19 data per country as a JSON array. The array of days for the time span requested for the country requested. |

# /countries
## ***GET*** 

**Description:** Get Corona data for each country from different data sources.

### HTTP Request 
`GET /countries` 

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| country | query | Please enter the 3-digit ISO Country Code. For valid codes to use see <a href=https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 target="_blank">ISO 3166-1 alpha-3</a> (e.g. DEU for Germany). | No | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The Corona data for each country from different data sources. |

# /datasources
## ***GET*** 

**Description:** Get a list of datasources available via this API.

### HTTP Request 
`GET /datasources` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The list of available sources of the API. |

# /datasources/details
## ***GET*** 

**Description:** Get a list of datasources and their maintainers and contact info.

### HTTP Request 
`GET /datasources/details` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The list of available sources of the API. |

# /total
## ***GET*** 

**Description:** Total world figures

### HTTP Request 
`GET /total` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | Object of total numbers (cases, active, recovered, deaths) |

# /meta
## ***GET*** 

**Description:** Get metadata on the REST API under use. That includes information like where to find the code, where to create new tickets or when the underlying data has been updated the last time.

### HTTP Request 
`GET /meta` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The metadata on the REST API under use. |


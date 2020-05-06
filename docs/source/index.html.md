--- 

title: CoronaAPI 

language_tabs: 
   - shell 

toc_footers: 
   - <a href='#'>Sign Up for a Developer Key</a> 
   - <a href='https://github.com/lavkumarv'>Documentation Powered by lav</a> 

includes: 
   - errors 

search: true 

--- 

# Introduction 

An HTTP API serving structured information on COVID-19's march around the globe. 

**Version:** 0.0.5 

# /daily
## ***GET*** 

**Description:** Get high-level daily data on Corona infections around the world or for a specific country.

### HTTP Request 
`***GET*** /daily` 

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

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The available Corona Virus data per country as a JSON array. The array as well as the data for each country is filtered according to the request parameters. |

```shell
# With shell, you can just pass the correct header with each request
curl "https://data.corona-api.org/v1/daily"
```

```javascript

let dailyStats = fetch('https://data.corona-api.org/v1/daily').then(response => response.json()).(data => console.log(data))
```

# /daily/confirmed
## ***GET*** 

**Description:** Get only confirmed daily case numbers

### HTTP Request 
`***GET*** /daily/confirmed` 

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
`***GET*** /daily/recovered` 

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
`***GET*** /daily/deaths` 

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
`***GET*** /timespan` 

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
`***GET*** /countries` 

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
`***GET*** /datasources` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The list of available sources of the API. |

# /datasources/details
## ***GET*** 

**Description:** Get a list of datasources and their maintainers and contact info.

### HTTP Request 
`***GET*** /datasources/details` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The list of available sources of the API. |

# /total
## ***GET*** 

**Description:** Total world figures

### HTTP Request 
`***GET*** /total` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | Object of total numbers (cases, active, recovered, deaths) |

# /meta
## ***GET*** 

**Description:** Get metadata on the REST API under use. That includes information like where to find the code, where to create new tickets or when the underlying data has been updated the last time.

### HTTP Request 
`***GET*** /meta` 

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | The metadata on the REST API under use. |

<!-- Converted with the swagger-to-slate https://github.com/lavkumarv/swagger-to-slate -->

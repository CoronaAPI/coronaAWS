> **DEPRECATED**: This project was built for a hackathon in early 2020 and is currently unmaintained!

<img src="https://imgur.com/BYL9tJl.png" width="300px" align="right" alt="wirvsvirus logo" />

# 🦠 Corona API 

<!-- ![Version](https://img.shields.io/github/package-json/v/coronaapi/coronaapi?style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/coronaapi/coronaapi?label=commits&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/coronaapi/coronaapi?style=flat-square)
![Website](https://img.shields.io/website?down_color=lightgrey&down_message=offline&style=flat-square&up_color=green&up_message=online&url=https%3A%2F%2Fdata.corona-api.org) -->

### #WirVsVirus Project 0193

HTTP Corona API based on the great work of [covidatlas/coronadatascraper](https://github.com/covidatlas/coronadatascraper).

## 🏗️ Usage

1. `git clone https://github.com/ndom91/coronaAWS`

2. `cd coronaAWS`

3. `npm install`

4. Install Serverless `npm i -g serverless`

5. Login with Serverless `serverless login`

6. Develop locally `serverless offline`

7. Make changes 💪

8. Deploy with Serverless `serverless deploy --env dev`

## 📐 Architecture

```
User (Request) --> aws.corona-api.org --> AWS API Gateway --> Lambda --> DynamoDB 
                                                                |
                                                                └-?-> Redis
```

## ⚙️ Implementations

- R Library [paulvern/covid19]( https://github.com/paulvern/covid19/tree/master/readcorona )

## 🙏 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://ndo.dev"><img src="https://avatars2.githubusercontent.com/u/7415984?v=4" width="100px;" alt=""/><br /><sub><b>Nico Domino</b></sub></a><br /><a href="https://github.com/all-contributors/all-contributors/commits?author=ndom91" title="Documentation">📖</a> <a href="#tool-jakebolam" title="Tools">🔧</a> <a href="#infra-ndom91" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-ndom91" title="Maintenance">🚧</a><a href="#design-ndom91" title="Design">🎨</a><a href="#code-ndom91" title="Code">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/martiL"><img src="https://avatars2.githubusercontent.com/u/5569498?v=4" width="100px;" alt=""/><br /><sub><b>Martin Lux</b></sub></a><br /><a href="#code-ndom91" title="Code">💻</a>
    </td>
  </tr>
</table>

#### 🖥️ [DevPost](https://devpost.com/software/1_038_a_daten_0193_coronaapi) 

## 📝 License

MIT

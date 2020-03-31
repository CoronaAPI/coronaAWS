<img src="https://imgur.com/BYL9tJl.png" width="300px" align="right" alt="wirvsvirus logo" />

# 🦠 Corona API 

<!-- ![Version](https://img.shields.io/github/package-json/v/coronaapi/coronaapi?style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/coronaapi/coronaapi?label=commits&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/coronaapi/coronaapi?style=flat-square)
![Website](https://img.shields.io/website?down_color=lightgrey&down_message=offline&style=flat-square&up_color=green&up_message=online&url=https%3A%2F%2Fdata.corona-api.org) -->

### #WirVsVirus Project 0193

HTTP Corona API based on the great work of [@lazd/coronadatascraper](https://github.com/lazd/coronadatascraper).

#### 💌 Join our [Slack](https://join.slack.com/t/corona-api/shared_invite/zt-d3q97q52-2~0Jh7YV1WHVDY~TpENVtg)

## 🏗️ Usage

1. `git clone https://github.com/ndom91/coronaAWS`

2. `cd coronaAWS`

3. `npm install`

4. Install Serverless `npm i -g serverless`

5. Login with Serverless `serverless login`

6. Make changes 💪

7. Deploy with Serverless `serverless deploy --env dev`

## 📐 Architecture

```
User -- Request --> aws.corona-api.org --> AWS API Gateway --> Lambda Functions -?-> Redis --> DynamoDB 
```

## ⚙️ Implementations

- R Library [paulvern/covid19]( https://github.com/paulvern/covid19/tree/master/readcorona )

## 👀 Status

[Hyperping](https://status.corona-api.org)

## 🙏 Contributors

<table>
  <tr>
    <td align="center"><a href="https://ndo.dev"><img src="https://avatars2.githubusercontent.com/u/7415984?v=4" width="100px;" alt=""/><br /><sub><b>Nico Domino</b></sub></a><br /><a href="https://github.com/all-contributors/all-contributors/commits?author=ndom91" title="Documentation">📖</a> <a href="#tool-jakebolam" title="Tools">🔧</a> <a href="#infra-ndom91" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-ndom91" title="Maintenance">🚧</a><a href="#design-ndom91" title="Design">🎨</a></td>
  </tr>
</table>

#### 🖥️ [DevPost](https://devpost.com/software/1_038_a_daten_0193_coronaapi) 

## 📝 License

MIT
